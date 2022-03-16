<template>
  <div class="main">
    <Modal
      v-model="showCourseSelect"
      title=""
      :footer-hide="true"
      width="80"
      :styles="{ top: '20px' }"
    >
      <CourseSelect @finish="showCourseSelect = false" />
    </Modal>
    <Card shadow>
      <p slot="title" class="card-title" >选课管理</p>
      <div class="filter-group">
        <el-input
          placeholder="请输入关键词"
          prefix-icon="el-icon-search"
          v-model="query.keyword"
          style="width: 200px"
          size="small"
          @input="debouncedGetSelections()"
        >
        </el-input>
        <el-button @click="pushRoute({})" size="mini" type="primary"
          >重置</el-button
        >
        <el-button @click="showCourseSelect = true" size="mini" type="primary">选课</el-button>
      </div>
      <el-table :data="selections">
        <el-table-column label="ID" prop="id" width="100"></el-table-column>
        <el-table-column label="课程名">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleDiveIn('courseid', scope.row.courseid)"
            >
              {{ scope.row.coursename }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column size="mini" label="学生姓名">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleDiveIn('studentid', scope.row.studentid)"
            >
              {{ scope.row.studentname }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="学号" prop="studentwid"></el-table-column>
        <el-table-column label="班级">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.classid !== -1"
              size="mini"
            >
              {{ scope.row.classname }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="学习时间">
          <template slot-scope="scope">
            <p>{{ cvtSeconds2Str(scope.row.optime) }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDelete(scope.row)"
              >删除</el-button
            >
            <el-button
              size="mini"
              v-if="scope.row.classid !== -1"
              @click="handleDelete(scope.row, true)"
            >
              班级退选
            </el-button>
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
import { filterEmptyValue, debounce, voidFunc, cvtSeconds2Str } from '@/util';
import CourseSelect from '@/components/CourseSelect';

export default {
  name: 'Selection',
  components: {
    CourseSelect,
  },
  data() {
    return {
      selections: [],
      query: {
        page: 1,
        limit: 10,
        keyword: '',
        studentid: 0,
        classid: 0,
        courseid: 0,
      },
      total: 0,
      showCourseSelect: false,
    };
  },
  methods: {
    updateQuery() {
      const { page, limit, keyword, studentid, classid, courseid } = this.$route.query;
      const query = {};
      query.page = parseInt(page) || 1;
      query.limit = parseInt(limit) || 10;
      query.keyword = keyword || '';
      query.studentid = parseInt(studentid) || 0;
      query.classid = parseInt(classid) || 0;
      query.courseid = parseInt(courseid) || 0;
      return query;
    },
    async getSelections() {
      const query = this.updateQuery();
      const params = filterEmptyValue(query);
      const res = await this.$http('/api/courseselect/courseselect', 'get', {
        params,
      }).catch(voidFunc);
      this.selections = res?.data;
      this.total = res?.total || 0;
      Object.assign(this.query, query);
    },
    pushRoute(ctm = null) {
      this.$router.push({
        name: 'selection',
        query: ctm || filterEmptyValue(this.query, [false]),
      });
    },
    handleDiveIn(key, val) {
      this.query[key] = val;
      this.query.page = 1;
      this.pushRoute();
    },
    async handleDelete(row, isClass = false) {
      const { courseid, studentid, classid } = row;
      const confirm = await this.$confirm('确定要删除吗').catch(voidFunc);
      if (confirm === undefined) return;
      const data = isClass ? { courseid, classid } : { courseid, studentid };
      const res = await this.$http('/api/courseselect/courseselect', 'delete', {
        data,
      }).catch(voidFunc);
      if (res === undefined) return;
      this.$info('删除成功');
      this.getSelections();
    },
    debouncedGetSelections: voidFunc,
    cvtSeconds2Str,
  },
  mounted() {
    this.getSelections();
    this.debouncedGetSelections = debounce(this.pushRoute);
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getSelections();
      }
    },
  },
};
</script>
<style scoped>
</style>
