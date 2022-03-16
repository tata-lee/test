<template>
   <div class="main">
    <Card shadow>
      <p slot="title" class="card-title">公告</p>
      <div slot="extra" class="clearfix">
        <el-button style="float: right; padding: 3px 0;width:60px;height:30px"
        type="primary"
        @click="visible=true">添加</el-button>
      </div>
      <el-table :data="annos" style="width: 100%">
        <el-table-column prop="id" label="ID"> </el-table-column>
        <el-table-column prop="content" label="内容"> </el-table-column>
        <el-table-column prop="time" label="时间"> </el-table-column>
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
    <el-dialog title="新建公告" width="40%" :visible.sync="visible" >
        <el-input
        type="textarea"
        :rows="4"
        show-word-limit
        placeholder="请输入内容"
        v-model="content">
        </el-input>
        <el-button type="primary" @click="submit" style="margin-top:2%">提交</el-button>
    </el-dialog>
  </div>
</template>


<script>
import { voidFunc } from '../util';

export default {
  data() {
    return {
      annos: [],
      query: {
        page: 1,
        limit: 10,
      },
      visible: false,
      total: 0,
      content: '',
    };
  },
  methods: {
    getAnno() {
      const params = Object.assign({}, this.query);
      this.$http('/anno', 'get', { params }).then((res) => {
        this.annos = res.data;
        this.total = res.total;
      });
    },
    init() {
      const query = this.$route.query;
      this.query.page = parseInt(query.page) || 1;
      this.getAnno();
    },
    pushRoute() {
      const query = Object.assign({}, this.query);
      this.$router.push({
        name: 'anno',
        query,
      });
    },
    showDetail(row) {
      this.detail = row;
      this.modalTitle = `${row.userwid} 于 ${row.time}`;
      this.visible = true;
    },
    submit() {
      this.$confirm('确定发布吗？').then(() => {
        const data = {
          content: this.content,
        };
        this.$http('/anno', 'post', { data }).then((res) => {
          this.$info('发布成功');
          this.visible = false;
          this.content = '';
          this.init();
        }).catch(voidFunc);
      }).catch(voidFunc);
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
