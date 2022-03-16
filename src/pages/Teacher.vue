<template>
    <div class="main">
        <Card shadow >
            <p slot="title" style="font-size:20px;height:24px">全部教师</p>
            <div class="filter-group">
            <el-input
                placeholder="请输入关键词"
                prefix-icon="el-icon-search"
                v-model="query.keyword"
                style="width: 200px"
                size="small"
                @input="debouncedGetTeachers()"
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
            <el-button type="primary" size="mini" @click="searchTeacherByKeyword()">搜索</el-button>
            <el-button @click="pushRoute({})" size="mini" type="primary">
              重置</el-button>
            </div>

            <el-table :data="teachers">
                <el-table-column prop="id" label="ID" width="120"></el-table-column>
                <el-table-column prop="avatar" label="头像" width="180">
                  <template slot-scope="scope">
                    <img class="avatar" :src="scope.row.avatar" alt=""/>
                  </template>
                </el-table-column>
                <el-table-column prop="userid" label="教师工号" width="180"></el-table-column>
                <el-table-column prop="username" label="教师名称" width="200"></el-table-column>
                <el-table-column prop="lastlogintime" label="上次登录时间" width="260"></el-table-column>
                <el-table-column prop="pre" label="个人介绍" width="260"></el-table-column>
            </el-table>
            <el-pagination
                layout="total, prev, pager, next"
                :total="total"
                :page-size.sync="query.limit"
                :current-page.sync="query.page"
                @current-change="pushRoute()">
            </el-pagination>
        </Card>
    </div>
</template>
<script>

import { filterEmptyValue, debounce, voidFunc } from '@/util';

export default {
    name: 'Teacher',
    data() {
        return {
            teachers: [
            ],
            query: {
                page: 1,
                limit: 10,
                keyword: '',
                kind: 't',
                active: undefined,
            },
            total: 0,
        };
    },
    methods: {
      updateQuery() {
          const { page, limit, active, keyword } = this.$route.query;
          const query = {};
          query.page = parseInt(page) || 1;
          query.limit = parseInt(limit) || 10;
          query.active = parseInt(active) || undefined;
          query.keyword = keyword || '';
          query.kind = 't';
          return query;
      },
      getTeachers() {
          const query = this.updateQuery();
          const params = filterEmptyValue(query);
          this.$http('/api/user/filter', 'get', { params }).then((res) => {
            this.teachers = res?.data || [];
            this.total = res?.total || 0;
            Object.assign(this.query, query);
          }).catch(voidFunc);
      },
      pushRoute(ctm = null) {
          this.$router.push({
          name: 'teacher',
          query: ctm || filterEmptyValue(this.query, [false]),
        });
      },
      debouncedGetTeachers() {},
      checkNumber(val) {
        const num = parseInt(val);
        if (!num || num < 1) {
          this.query.active = undefined;
        }
      },
      searchTeacherByKeyword() {
        this.query.page = 1;
        this.pushRoute();
      },
    },
    mounted() {
      this.getTeachers();
      this.debouncedGetTeachers = debounce(this.searchTeacherByKeyword);
    },
    watch: {
      $route(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.getTeachers();
        }
      },
    },
};
</script>
<style scope>
  .avatar {
    width: 50px;
    height: 50px;
  }
</style>
