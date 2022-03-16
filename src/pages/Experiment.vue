<template>
  <div class="main">
    <Modal
      v-model="contentModal"
      :title="content.title"
      :footer-hide="true"
      width="80"
      :styles="{ top: '20px' }"
    >
      <mavon-editor
        v-model="content.content"
        :toolbarsFlag="false"
        :subfield="false"
        defaultOpen="preview"
        style="min-height: 200px"
      ></mavon-editor>
    </Modal>
    <Card shadow>
      <p slot="title" class="card-title">所有实验</p>
      <div class="filter-group">
        <el-input
          placeholder="请输入关键词"
          prefix-icon="el-icon-search"
          v-model="query.keyword"
          style="width: 300px"
          @input="debouncedGetExperiments()"
          size="small"
        >
        </el-input>
        <el-button @click="pushRoute({})" size="mini" type="primary"
          >重置</el-button
        >
      </div>
      <el-table :data="experiments">
        <el-table-column label="ID" prop="id" width="80"></el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="课程名">
          <template slot-scope="scope">
            <el-button size="mini" @click="toCourse(scope.row.courseid)">{{
              scope.row.coursename
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="报告提交数量"
          prop="submitnum"
        ></el-table-column>
        <el-table-column label="创建时间" prop="createtime"></el-table-column>
        <el-table-column
          label="上次修改时间"
          prop="lastupdatetime"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="showContent(scope.row.id)"
              >查看正文</el-button
            >
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

export default {
  name: 'Experiment',
  data() {
    return {
      experiments: [],
      query: {
        page: 1,
        limit: 10,
        keyword: '',
        courseid: 0,
      },
      page: 1,
      content: {
        title: '',
        content: '',
      },
      total: 0,
      contentModal: false,
    };
  },
  methods: {
    updateQuery() {
      const { page, limit, keyword, courseid } = this.$route.query;
      const query = {};
      query.page = parseInt(page) || 1;
      query.limit = parseInt(limit) || 10;
      query.keyword = keyword || '';
      query.courseid = parseInt(courseid) || 0;
      return query;
    },
    async getExperiments() {
      const query = this.updateQuery();
      const params = filterEmptyValue(query);
      const res = await this.$http('/api/experiment/exp', 'get', {
        params,
      }).catch(voidFunc);
      this.experiments = res?.data;
      this.total = res?.total || 0;
      Object.assign(this.query, query);
    },
    pushRoute(ctm = null) {
      this.$router.push({
        name: 'experiment',
        query: ctm || filterEmptyValue(this.query, [false]),
      });
    },
    async showContent(id) {
      this.contentModal = true;
      const res = await this.$http('/api/experiment/content', 'get', {
        params: { id },
      }).catch(voidFunc);
      this.content = res;
    },
    toCourse(id) {
      this.query.page = 1;
      this.query.courseid = id;
      this.pushRoute();
    },
    debouncedGetExperiments: voidFunc,
  },
  mounted() {
    this.getExperiments();
    this.debouncedGetExperiments = debounce(this.pushRoute);
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getExperiments();
      }
    },
  },
};
</script>
<style>
</style>
