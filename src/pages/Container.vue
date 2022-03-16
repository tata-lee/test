<template>
  <div class="main">
    <Card shadow>
      <el-tabs :value="op" type="card" @tab-click="handleSelectOp">
        <el-tab-pane
          v-for="item in opList"
          :key="item[0]"
          :label="item[1]"
          :name="item[0]"
        ></el-tab-pane>
      </el-tabs>
      <div class="filter-group">
        <el-input
          placeholder="请输入关键词"
          prefix-icon="el-icon-search"
          v-model="query.keyword"
          style="width: 200px"
          size="small"
        >
        </el-input>
        <span style="margin-left: 5px">最近</span>
        <el-input
          v-model="query.day"
          style="width: 60px"
          size="mini"
          @input="checkNumber">
          </el-input>
        <span>天访问过</span>
        <span style="margin-left: 5px">状态</span>
        <el-select v-model="query.status" size="mini" style="width: 100px">
          <el-option v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="pushRoute()">搜索</el-button>
        <el-button type="primary" size="mini" @click="pushRoute({ op })">重置</el-button>
      </div>
      <el-table :data="containers">
        <el-table-column label="ID" prop="id" width="80"></el-table-column>
        <el-table-column label="学号" prop="userid"></el-table-column>
        <el-table-column label="创建时间" prop="createtime"></el-table-column>
        <el-table-column
          label="上次访问时间"
          prop="lastopentime"
        ></el-table-column>
        <el-table-column label="使用时间" prop="usedtime"></el-table-column>
        <el-table-column prop="status" label="容器状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status !== undefined">
              <el-tag type="danger" v-if="scope.row.status === 0">关闭</el-tag>
              <el-tag type="warning" v-if="(scope.row.status & 0b100) > 0"
                >关闭中</el-tag
              >
              <el-tag
                type="success"
                v-if="
                  (scope.row.status & 0b001) > 0 &&
                  (scope.row.status & 0b100) === 0
                "
                >运行中</el-tag
              >
              <el-tag v-if="(scope.row.status & 0b010) > 0">访问中</el-tag>
            </div>
            <div v-else>
              <el-tag type="info">无数据</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <div v-if="scope.row.status !== undefined">
              <el-button
                size="small"
                v-if="scope.row.status === 0"
                :disabled="scope.row.pending"
                :loading="scope.row.loading"
                @click="handleStartContainer(scope.row.userid, scope.$index)"
                >开启</el-button
              >
              <el-button
                size="small"
                v-if="
                  (scope.row.status & 0b001) > 0 &&
                  (scope.row.status & 0b100) === 0
                "
                :disabled="scope.row.pending || scope.row.loading"
                @click="openPage(scope.row.url)"
                >访问</el-button
              >
              <el-button
                size="small"
                v-if="
                  (scope.row.status & 0b001) > 0 &&
                  (scope.row.status & 0b100) === 0
                "
                :disabled="scope.row.pending"
                :loading="scope.row.loading"
                @click="hanldeStopContainer(scope.row.userid, scope.$index)"
                >关闭</el-button
              >
              <el-button size="small" @click="alert('功能暂未开放')"
                >查看日志</el-button
              >
            </div>
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
import { filterEmptyValue, voidFunc, invokeArray, cvtSeconds2Str } from '@/util';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Container',
  data() {
    return {
      op: undefined,
      containers: [],
      query: {
        page: 1,
        limit: 10,
        status: undefined,
        day: undefined,
        keyword: '',
      },
      total: 0,
      statusOptions: [
        {
          value: null,
          label: '全部',
        },
        {
          value: 1,
          label: '运行中',
        },
        {
          value: 2,
          label: '访问中',
        },
        {
          value: 0,
          label: '已关闭',
        },
      ],
    };
  },
  methods: {
    ...mapActions(['getEnv']),
    updateQuery() {
      const { op, page, limit, day, status, keyword } = this.$route.query;
      const query = {};
      if (this.opList.length === 0 && op === undefined) {
        return undefined;
      }
      this.op = op || this.opList[0][0];
      query.page = parseInt(page) || 1;
      query.limit = parseInt(limit) || 10;
      query.day = parseInt(day) || undefined;
      query.keyword = keyword || '';
      query.status = status && parseInt(status);
      return query;
    },
    async getContainers() {
      const query = this.updateQuery();
      if (query) {
        const params = filterEmptyValue(query, [0]);
        const res = await this.$http(`/${this.op}/manage`, 'get', {
          params,
        }).catch(voidFunc);
        this.containers = res?.data || [];
        this.containers.forEach((e) => {
          e.pending = false;
          e.loading = false;
          e.usedtime = cvtSeconds2Str(e.usedtime);
        });
        this.total = res?.total || 0;
        Object.assign(this.query, query);
      }
    },
    async handleStartContainer(userID, index) {
      if (this.op) {
        const container = this.containers[index];
        container.pending = true;
        container.loading = true;
        invokeArray(this.containers);
        const data = {
          user_id: userID,
        };
        const res = await this.$http(`/${this.op}/manage`, 'post', {
          data,
        }).catch(voidFunc);
        if (res) {
          this.$info('启动成功');
          container.status = 0b001;
          container.url = res.url;
        }
        container.pending = false;
        container.loading = false;
        invokeArray(this.containers);
      } else {
        this.$error('环境类型未知');
      }
    },
    async hanldeStopContainer(userID, index) {
      if (this.op) {
        const container = this.containers[index];
        container.pending = true;
        container.loading = true;
        invokeArray(this.containers);
        this.$info('关闭容器可能会花费几十秒的时间');
        const data = {
          user_id: userID,
        };
        const res = await this.$http(`/${this.op}/manage`, 'delete', { data }).catch(voidFunc);
        if (res) {
          this.$info('关闭成功');
          container.status = 0;
        }
        container.pending = false;
        container.loading = false;
        invokeArray(this.containers);
      } else {
        this.$error('环境类型未知');
      }
    },
    openPage: (url) => {
      window.open(url);
    },
    checkNumber(val) {
      const num = parseInt(val);
      if (!num || num < 1) {
        this.query.day = undefined;
      }
    },
    handleSelectOp(pane) {
      this.pushRoute({ op: pane.name });
    },
    pushRoute(ctm = null) {
      const query = { op: this.op, ...this.query };
      this.$router.push({
        name: 'container',
        query: ctm || filterEmptyValue(query, [0]),
      });
    },
  },
  computed: {
    ...mapGetters(['opMapper', 'opReqMapper']),
    opList() {
      return Object.entries(this.opMapper || {});
    },
  },
  mounted() {
    if (!this.opMapper) this.getEnv();
    this.getContainers();
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getContainers();
      }
    },
    opMapper(newVal, oldVal) {
      if (this.op === undefined && newVal) {
        this.handleSelectOp({ name: Object.keys(newVal)[0] });
      }
    },
  },
};
</script>
