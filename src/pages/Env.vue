<template>
  <div class="main">
    <Modal v-model="modalEdit.visible" :title="edit ? editForm.name : '新建环境'">
      <el-form :model="editForm" :rules="envRules" ref="editForm" label-position="right">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" size="small" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="intro">
          <el-input v-model="editForm.intro" size="small" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="route">
          <el-input v-model="editForm.route" size="small" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">下线</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button
          type="primary"
          :loading="modalEdit.loading"
          size="small"
          @click="handleSubmit"
          >确认</el-button
        >
      </div>
    </Modal>
    <Card shadow>
      <p slot="title" class="card-title">实验环境</p>
      <div class="filter-group">
        <el-input
          placeholder="请输入关键词"
          prefix-icon="el-icon-search"
          v-model="query.keyword"
          style="width: 200px"
          size="small"
        >
        </el-input>
        <span style="margin-left: 5px">状态</span>
        <el-select v-model="query.status" size="mini" style="width: 100px">
          <el-option v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="pushRoute()">搜索</el-button>
        <el-button type="primary" size="mini" @click="pushRoute({})">重置</el-button>
        <el-button type="primary" size="mini" @click="handleAddEnv">新建环境</el-button>
      </div>
      <el-table :data="envs">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="intro" label="描述"></el-table-column>
        <el-table-column prop="route" label="路径" width="100"></el-table-column>
        <el-table-column label="上次修改时间">
          <template slot-scope="scope">
            <p>{{ cvtStamp2String(scope.row.time) }}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <p>{{scope.row.status & 1 > 0 ? '正常':'下线'}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEditEnv(scope.row)">编辑</el-button>
            <el-button size="mini"
              v-if="scope.row.status === 0"
              @click="handleUpdateEnv(scope.row.id, 1)"
              type="success">上线</el-button>
            <el-button size="mini"
              v-if="scope.row.status === 1"
              @click="handleUpdateEnv(scope.row.id, 0)"
              type="danger">下线</el-button>
            <el-button size="mini" @click="handleDelete(scope.row.id)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </Card>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { filterEmptyValue, voidFunc, cvtStamp2String, reAssign } from '../util';

export default {
  name: 'Env',
  data() {
    return {
      envs: [],
      total: 0,
      query: {
        page: 1,
        limit: 10,
        status: undefined,
        keyword: '',
        creator: undefined,
      },
      edit: false,
      editForm: {
        name: '',
        intro: '',
        route: '',
        status: 1,
      },
      emptyForm: {
        name: '',
        intro: '',
        route: '',
        status: 1,
      },
      modalEdit: {
        loading: false,
        visible: false,
      },
      statusOptions: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '正常',
          value: 1,
        },
        {
          label: '下线',
          value: 0,
        },
      ],
      envRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在1到20个字符', trigger: 'blur' },
        ],
        route: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在1到20个字符', trigger: 'blur' },
        ],
        intro: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在1到20个字符', trigger: 'blur' },
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' },
        ],
      },
    };
  },
  methods: {
    ...mapActions(['getEnv']),
    updateQuery() {
      const { page, limit, status, keyword, creator } = this.$route.query;
      const query = {};
      query.page = parseInt(page) || 1;
      query.limit = parseInt(limit) || 10;
      query.status = status && parseInt(status);
      query.keyword = keyword || '';
      query.creator = creator || '';
      return query;
    },
    async getEnvs() {
      const query = this.updateQuery();
      const params = filterEmptyValue(query, [0]);
      const res = await this.$newHttp('/env/env', 'get', { params }).catch(voidFunc);
      this.envs = res?.data || [];
      this.total = res?.total || 0;
      Object.assign(this.query, query);
    },
    pushRoute(ctm = null) {
      this.$router.push({
        name: 'env',
        query: ctm || filterEmptyValue(this.query, [0]),
      });
    },
    handleAddEnv() {
      this.editForm = { ...this.emptyForm };
      this.modalEdit.visible = true;
      this.edit = false;
    },
    handleEditEnv(row) {
      reAssign(this.editForm, row);
      this.editForm.id = row.id;
      this.edit = true;
      this.modalEdit.visible = true;
    },
    handleSubmit() {
      this.$refs.editForm.validate(async (valid) => {
        if (valid) {
          this.modalEdit.loading = true;
          const data = this.editForm;
          const res = await this.$newHttp('/env/env', this.edit ? 'put' : 'post', { data }).catch(voidFunc);
          this.modalEdit.loading = false;
          if (res) {
            this.$info('修改成功');
            this.modalEdit.visible = false;
            this.getEnvs();
            this.getEnv();
          }
        } else {
          this.$error('请正确填写表单');
        }
      });
    },
    handleDelete(id) {
      this.$confirm('确定要删除吗？').then(async () => {
        const data = { id };
        const res = await this.$newHttp('/env/env', 'delete', { data }).catch(voidFunc);
        if (res) {
          this.$info('删除成功');
          this.getEnvs();
          this.getEnv();
        }
      }).catch(voidFunc);
    },
    async handleUpdateEnv(id, status) {
      const data = {
        id,
        status,
      };
      const res = await this.$newHttp('/env/env', 'put', { data }).catch(voidFunc);
      if (res) {
        this.$info('修改成功');
        this.getEnvs();
        this.getEnv();
      }
    },
    cvtStamp2String,
  },
  mounted() {
    this.getEnvs();
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getEnvs();
      }
    },
  },
};
</script>
