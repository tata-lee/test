<template>
  <div class="main">
    <Modal
      v-model="showClassSelect"
      title="绑定班级"
      :footer-hide="true"
      width="30px"
      :styles="{ top: '20px' }"
    >
      <el-select
        filterable
        :remote-method="searchClass"
        remote
        clearable
        :loading="loading"
        v-model="classForm.class_id">
        <el-option
          v-for="item in classOptions"
          :value="item.id"
          :label="item.name"
          :key="item.id"
          style="font-size:14px;width:196px">
          <span>
            {{ item.name }}<span>(学生数：{{ item.stunum }})</span>
          </span>
        </el-option>
      </el-select>
      <el-button
      :disabled="!classForm.class_id"
      @click="handleBindClass"
      type="primary"
      :loading="btnLoading"
      >确定</el-button>
    </Modal>
    <Card shadow style="text-align: left">
      <p slot="title" style="font-size:20px;height:24px">
        {{ content }}
      </p>
      <div>
        <el-input
          placeholder="请输入关键词搜索"
          prefix-icon="el-icon-search"
          v-model="query.keyword"
          style="width: 200px"
          size="small"
          @input="debouncedGetStudents()"
        >
        </el-input>
        <span style="margin-left: 5px">最近</span>
        <el-input
          v-model="query.active"
          style="width: 60px"
          size="mini"
          @input="checkNumber">
          </el-input>
        <span>天访问过</span>
        <el-button type="primary" size="mini" @click="pushRoute()">搜索</el-button>
        <el-button @click="pushRoute({})" size="mini" type="primary"
          >重置</el-button
        >
      </div>
      <el-table :data="students" stripe>
        <el-table-column
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="avatar"
          label="头像"
          width="110">
          <template slot-scope="scope">
            <img class="avatar" :src="scope.row.avatar" alt=""/>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="130">
        </el-table-column>
        <el-table-column
          prop="userid"
          label="用户ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="classname"
          label="班级名称"
          width="200">
        </el-table-column>
        <el-table-column
          prop="classid"
          label="班级ID">
        </el-table-column>
        <el-table-column
          prop="lastlogintime"
          label="上次登录时间"
          width="180">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleShowModal(scope.row)" >绑定班级</el-button>
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
import { filterEmptyValue, debounce, voidFunc } from '@/util';

export default{
  name: 'Student',
  data() {
    return {
      content: '学生信息',
      students: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        keyword: '',
        kind: 's',
        class: '',
        active: undefined,
      },
      showClassSelect: false,
      classOptions: [],
      classForm: {
        student_id: undefined,
        class_id: undefined,
      },
      loading: false,
      btnLoading: false,
    };
  },
  methods: {
    checkNumber(val) {
      const num = parseInt(val);
      if (!num || num < 1) {
        this.query.active = undefined;
      }
    },
    updateQuery() {
      const { page, limit, active, keyword } = this.$route.query;
      const query = {};
      query.page = parseInt(page) || 1;
      query.limit = parseInt(limit) || 10;
      query.active = parseInt(active) || undefined;
      query.keyword = keyword || '';
      query.kind = 's';
      return query;
    },
    getStudents() {
      const query = this.updateQuery();
      const params = filterEmptyValue(query);
      this.$http('/api/user/filter', 'get', { params }).then((res) => {
        this.students = res?.data || [];
        this.total = res?.total || 0;
        Object.assign(this.query, query);
      }).catch(voidFunc);
    },
    pushRoute(ctm = null) {
      this.$router.push({
        name: 'student',
        query: ctm || filterEmptyValue(this.query),
      });
    },
    debouncedGetStudents() {},
    async searchClass(query) {
      if (query !== '') {
        const params = {
          page: 1,
          limit: 1000,
          keyword: query,
        };
        const res = await this.$http('/api/user/class', 'get', {
          params,
        }).catch(voidFunc);
        this.classOptions = res?.data || [];
      } else {
        this.options.classes = [];
      }
    },
    handleShowModal(row) {
      this.classForm.class_id = undefined;
      this.classForm.student_id = row.id;
      this.showClassSelect = true;
    },
    async handleBindClass() {
      const data = { ...this.classForm };
      this.btnLoading = true;
      const res = await this.$http('/api/user/classRel', 'put', { data }).catch(voidFunc);
      if (res) {
        this.showClassSelect = false;
        this.btnLoading = false;
        this.$info('绑定成功');
        this.getStudents();
      }
    },
    searchStudentByKeyword() {
      this.query.page = 1;
      this.pushRoute();
    },
  },
  mounted() {
    this.getStudents();
    this.debouncedGetStudents = debounce(this.searchStudentByKeyword);
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getStudents();
      }
    },
  },
};
</script>
<style scoped>
.avatar {
  width: 20px;
  height: 20px;
}
</style>
