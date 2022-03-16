<template>
  <div class="main">
    <Modal v-model="modalPayload" title="payload详情">
      <p><span></span>{{payload.payload}}</p>
    </Modal>
    <Modal v-model="modalUserExtra" title="用户信息详情">
      <p><span></span>{{payload.user_extra}}</p>
    </Modal>
    <Card shadow>
      <div>
        <span>选择时间段：</span>
        <span>{{startValue}}</span>
        <el-date-picker
        v-model="startValue"
        type="date"
        align="right"
        placeholder="请选择开始日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="timestamp"
        >
        </el-date-picker>
        <span>{{endValue}}</span>
        <el-date-picker
        v-model="endValue"
        type="date"
        align="right"
        placeholder="请选择结束日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="timestamp"
        >
        </el-date-picker>
        <span>选择行为：</span>
        <!-- 远程搜索 -->
        <el-select
        placeholder="请输入关键字搜索"
        filterable
        remote
        size="mini"
        v-model="selected"
        value-key="id"
        :remote-method="searchType"
        :loading="loading"
        >
        </el-select>
        <el-button size="mini" type="primary" plain>筛选</el-button>
        <!-- <el-input
        placeholder="请输入关键词"
        prefix-icon="el-icon-search"
        v-model="query.type"
        style="width: 200px"
        size="small"
        @input="debouncedGetActions()"
        ></el-input> -->
      </div>
      <p slot="title" style="font-size:20px">Action</p>
      <el-table :data="actions" stripe>
        <el-table-column prop="id" label="ID" width="100px"></el-table-column>
        <el-table-column prop="type" label="行为"></el-table-column>
        <el-table-column prop="user" label="用户" width="150px"></el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">
            <p>{{ cvtStamp2String(scope.row.time) }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="user_extra" label="用户信息">
          <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleCheckUserextra(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column label="payload">
          <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleCheckPayload(scope.row)">查看详情</el-button>
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
import { filterEmptyValue, voidFunc, cvtStamp2String } from '@/util';
import { debounce } from '../util';

export default({
  name: 'PayLoad',
  data() {
    return {
      modalPayload: false,
      modalUserExtra: false,
      total: 0,
      query: {
        startTime: 0,
        endTime: 0,
        type: '',
        page: 1,
        limit: 10,
      },
      startValue: '',
      endValue: '',
      keytype: '',
      selected: '',
      options: [],
      loading: false,
      value: [],
      payload: {},
    };
  },
  methods: {
    change() {
    },
    handleCheckPayload(row) {
      this.modalPayload = true;
      Object.assign(this.payload, row);
    },
    handleCheckUserextra(row) {
      this.modalUserExtra = true;
      Object.assign(this.payload, row);
    },
    updatequery() {
      const { startTime, endTime, type, page, limit } = this.$route.query;
      const query = {};
      query.startTime = parseInt(startTime);
      query.endTime = parseInt(endTime);
      query.page = parseInt(page) || 2;
      query.limit = parseInt(limit) || 10;
      query.type = type || '';
      return query;
    },
    getAction() {
      const query = this.updatequery();
      const params = filterEmptyValue(query);
      this.$http('/action', 'get', { params }).then((res) => {
        this.actions = res?.data || [];
        this.total = res?.total || 0;
        console.log(res);
        Object.assign(this.query, query);
      }).catch(voidFunc);
    },
    async searchType(val) {
      if (val) {
        const params = {
          type: '',
          limit: 20,
        };
        this.loading = true;
        const res = await this.$newHttp('/action', 'get', { params }).catch(voidFunc);
        this.loading = false;
        if (res) {
          console.log('aaa');
          this.options = res.data;
        }
      }
    },
    pushRoute(ctm = null) {
      this.$router.push({
        name: 'action',
        query: ctm || filterEmptyValue(this.query),
      });
    },
    cvtStamp2String,
    searchActionsBytype() {
      this.query.page = 1;
      this.pushRoute();
    },
    debouncedGetActions() {},
  },
  mounted() {
    this.getAction();
    this.debouncedGetActions = debounce(this.searchActionsBytype);
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getAction();
      }
    },
  },
});
</script>
<style>
</style>
