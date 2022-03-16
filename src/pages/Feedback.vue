<template>
   <div class="main">
    <Card shadow>
      <p slot="title" class="card-title">意见反馈</p>
      <el-table :data="comments" style="width: 100%">
        <el-table-column prop="id" label="ID"> </el-table-column>
        <el-table-column prop="userid" label="用户ID"> </el-table-column>
        <el-table-column prop="userwid" label="用户名"> </el-table-column>
        <el-table-column prop="time" label="时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
                <el-button type="primary" @click="showDetail(scope.row)">详情</el-button>
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
    <el-dialog :title="modalTitle" width="40%" :visible.sync="visible" >
        <p class="text">{{detail.comment}}</p>
        <br/>
        <p v-show="detail.contact" class="text">联系方式：{{detail.contact}}</p>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      comments: [],
      detail: {
        comment: '',
        contact: '',
        time: '',
      },
      modalTitle: '',
      query: {
        page: 1,
        limit: 10,
        source: 'experiment',
      },
      visible: false,
      total: 0,
    };
  },
  methods: {
    getFeedback() {
      const params = Object.assign({}, this.query);
      this.$http('/comment', 'get', { params }).then((res) => {
        this.comments = res.data;
        this.total = res.total;
      });
    },
    init() {
      const query = this.$route.query;
      this.query.page = parseInt(query.page) || 1;
      this.getFeedback();
    },
    pushRoute() {
      const query = Object.assign({}, this.query);
      this.$router.push({
        name: 'feedback',
        query,
      });
    },
    showDetail(row) {
      this.detail = row;
      this.modalTitle = `${row.userwid} 于 ${row.time}`;
      this.visible = true;
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.init();
      }
    },
  },
};
</script>
<style scoped>

.text{
  font-size:20px;
  font-weight: 500;
}

</style>
