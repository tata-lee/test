<template>
  <div class="main">
    <Modal v-model="modalCtrl.course.visible" :title="modalCtrl.course.title" width="80">
      <p><span>教师名：</span>{{courseView.teachername}}</p>
      <p><span>实验数量：</span>{{courseView.expnum}}</p>
      <p><span>实验环境：</span>{{(opMapper && opMapper[courseView.operationcode]) || '当前不支持'}}</p>
      <p><span>课容量：</span>{{courseView.capacity}}</p>
      <p><span>选课人数：</span>{{courseView.choosenum}}</p>
      <p><span>开始时间：</span>{{courseView.starttime}}</p>
      <p><span>结束时间：</span>{{courseView.endtime}}</p>
      <p>封面：</p>
      <img :src="courseView.cover" style="width: 50%" alt="调查显示国人，较去年快乐"></img>
      <p>介绍:</p>
      <mavon-editor
        v-model="courseView.intro"
        :toolbarsFlag="false"
        :subfield="false"
        defaultOpen="preview"
        style="min-height: 200px;"
      ></mavon-editor>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="modalCtrl.course.visible = false">确认</el-button>
      </div>
    </Modal>
    <Modal v-model="modalCtrl.edit.visible" :title="modalCtrl.edit.title">
      <el-form label-position="right">
        <el-form-item label="课程库内可见(其他教师可见)">
          <el-switch v-model="ctrlForm.share"></el-switch>
        </el-form-item>
        <el-form-item label="公共课(所有学生可选)">
          <el-switch v-model="ctrlForm.public"></el-switch>
        </el-form-item>
        <el-form-item label="整体可见(教师自己删除课程)">
          <el-switch v-model="ctrlForm.visible"></el-switch>
        </el-form-item>
        <el-form-item label="有效时间">
          <el-date-picker
            v-model="ctrlForm.time"
            type="datetimerange"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="课容量">
          <el-input type="number"
          :min="ctrlForm.choosenum"
          v-model="ctrlForm.capacity"
          size="small"
          style="width: 100px">
          </el-input>
        </el-form-item>
        <p :class="{ 'error-text': !capacityValid }">
          当前选课人数<span style="margin-left: 5px;font-weight: 500">{{ctrlForm.choosenum}}</span>
          <span v-if="!capacityValid"> 课容量不能小于已选课人数</span>
        </p>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button
          type="primary"
          :loading="modalCtrl.edit.loading"
          size="small"
          @click="handleEditSubmit"
          >确认</el-button
        >
      </div>
    </Modal>
    <Card shadow>
      <p slot="title" class="card-title">所有课程</p>
      <div class="filter-group">
        <el-input
          placeholder="请输入关键词"
          prefix-icon="el-icon-search"
          v-model="query.keyword"
          style="width: 200px"
          size="small"
        >
        </el-input>
        <span>课程库内公开</span>
        <el-select v-model="query.share" placeholder="请选择" size="small">
          <el-option
            v-for="item in options.bool"
            :value="item.value"
            :label="item.label"
            :key="item.value"
          >
          </el-option>
        </el-select>
        <span>公共课(所有学生可选)</span>
        <el-select v-model="query.public" placeholder="请选择" size="small">
          <el-option
            v-for="item in options.bool"
            :value="item.value"
            :label="item.label"
            :key="item.value"
          >
          </el-option>
        </el-select>
        <span>状态</span>
        <el-select v-model="query.expired" placeholder="请选择" size="small">
          <el-option
            v-for="item in options.expired"
            :value="item.value"
            :label="item.label"
            :key="item.value"
          >
          </el-option>
        </el-select>
        <el-button size="small" type="primary" @click="pushRoute()"
          >查询</el-button
        >
        <el-button size="small" type="primary" @click="pushRoute({})">重置</el-button>
      </div>
      <el-table :data="courses" class="course-table">
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column
          prop="name"
          label="课程名"
          width="160"
        ></el-table-column>
        <el-table-column prop="teachername" label="教师名"></el-table-column>
        <el-table-column prop="" label="实验环境类型" width="120">
          <template slot-scope="scope">
            <p>{{ (opMapper && opMapper[scope.row.operationcode]) || '当前不支持' }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="expnum" label="实验数量"></el-table-column>
        <el-table-column prop="capacity" label="课容量"></el-table-column>
        <el-table-column prop="choosenum" label="选课人数"></el-table-column>
        <el-table-column prop="starttime" label="开始时间"></el-table-column>
        <el-table-column prop="endtime" label="结束时间"></el-table-column>
        <el-table-column prop="" label="课程库内可见">
          <template slot-scope="scope">
            {{ scope.row.share ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="公共课">
          <template slot-scope="scope">
            {{ scope.row.public ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{
              map.status[scope.row.expired] +
              (scope.row.visible ? '' : '，已删除')
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleViewCourse(scope.row)">课程详情</el-button>
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑属性</el-button
            >
            <el-button size="mini" @click="handleToExperiment(scope.row.id)">实验列表</el-button>
            <el-button size="mini" @click="handleToSelection(scope.row.id)">选课情况</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="total, prev, pager, next"
        :total="total"
        :page-size.sync="query.limit"
        :current-page.sync="query.page"
        @current-change="pushRoute()"
      >
      </el-pagination>
    </Card>
  </div>
</template>
<script>
import { filterEmptyValue, cvtStr2Bool, reAssign, voidFunc } from '@/util';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Course',
  data() {
    return {
      courses: [],
      query: {
        page: 1,
        limit: 4,
        keyword: '',
        share: undefined,
        public: undefined,
        expired: undefined,
      },
      modalCtrl: {
        edit: {
          visible: false,
          title: '',
          loading: false,
        },
        course: {
          visible: false,
          title: '',
        },
      },
      options: {
        bool: [
          { label: '全部', value: '' },
          { label: '是', value: true },
          { label: '否', value: false },
        ],
        expired: [
          { label: '全部', value: '' },
          { label: '未开始', value: 0 },
          { label: '正常', value: 1 },
          { label: '已结束', value: 2 },
        ],
      },
      map: {
        status: {
          [-1]: '未开始',
          0: '正常',
          1: '已结束',
        },
      },
      ctrlForm: {
        id: -1,
        share: undefined,
        public: undefined,
        visible: undefined,
        starttime: undefined,
        endtime: undefined,
        capacity: 0,
        choosenum: 0,
      },
      courseView: {},
      total: 0,
    };
  },
  methods: {
    ...mapActions(['getEnv']),
    updateQuery() {
      const { page, limit, keyword, share, public: isPublic, expired } = this.$route.query;
      const query = {};
      query.page = parseInt(page) || 1;
      query.limit = parseInt(limit) || 4;
      query.keyword = keyword || '';
      query.share = cvtStr2Bool(share);
      query.public = cvtStr2Bool(isPublic);
      query.expired = parseInt(expired) || undefined;
      return query;
    },
    async getCourses() {
      const query = this.updateQuery();
      const params = filterEmptyValue(query, [false]);
      const res = await this.$http('/api/course/course', 'get', {
        params,
      }).catch(voidFunc);
      this.courses = res?.data;
      this.total = res?.total || 0;
      Object.assign(this.query, query);
    },
    handleEdit(row) {
      this.modalCtrl.edit.title = row.name;
      this.modalCtrl.edit.visible = true;
      reAssign(this.ctrlForm, row);
      this.ctrlForm.time = [row.starttime, row.endtime];
    },
    async handleEditSubmit() {
      if (this.capacityValid) {
        const {
          id,
          share,
          visible,
          capacity,
          time: [starttime, endtime],
        } = this.ctrlForm;
        const data = { id, share, visible, starttime, endtime, capacity };
        data.public = this.ctrlForm.public;
        this.modalCtrl.edit.loading = true;
        const res = await this.$http('/api/course/course', 'put', { data }).catch(
          () => {
            this.modalCtrl.edit.loading = false;
          },
        );
        if (res) {
          this.$info('编辑成功');
          this.modalCtrl.edit.loading = false;
          this.modalCtrl.edit.visible = false;
          this.getCourses();
        }
      } else {
        this.$error('请正确填写表单');
      }
    },
    handleViewCourse(row) {
      Object.assign(this.courseView, row);
      this.modalCtrl.course.title = row.name;
      this.modalCtrl.course.visible = true;
    },
    handleToExperiment(courseid) {
      this.$router.push({
        name: 'experiment',
        query: {
          courseid,
        },
      });
    },
    handleToSelection(courseid) {
      this.$router.push({
        name: 'selection',
        query: {
          courseid,
        },
      });
    },
    checkCapacity(val) {
      if (val < this.ctrlForm.choosenum) {
        this.ctrlForm.capacity = this.ctrlForm.choosenum;
      }
    },
    pushRoute(ctm = null) {
      this.$router.push({
        name: 'course',
        query: ctm || filterEmptyValue(this.query, [false]),
      });
    },
  },
  mounted() {
    if (!this.opMapper) this.getEnv();
    this.getCourses();
  },
  computed: {
    ...mapGetters(['opMapper']),
    capacityValid() {
      const { capacity, choosenum } = this.ctrlForm;
      return capacity >= choosenum;
    },
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getCourses();
      }
    },
  },
};
</script>
<style scoped>
.filter-group .el-select {
  width: 100px;
}
.course-table .el-button {
  display: inline;
}
.course-table .el-button + .el-button {
  margin: 2px 0;
}
.error-text {
  color: red;
}
</style>
