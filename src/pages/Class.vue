<template>
    <div class="main">
      <Modal v-model="modalClass.visible" title="新建班级">
        <el-form
        :model="classForm"
        label-position="right"
        label-width="80px"
        :rules="classRules"
        ref="classForm">
          <el-form-item label="班级名称" prop="name">
          <el-input v-model="classForm.name">
          </el-input>
          </el-form-item>
        </el-form>
      <div slot="footer" style="text-align: center">
        <el-button
        type="primary"
        :loading="modalClass.loading"
        @click="handleClassSubmit"
        >确认</el-button>
         <el-button size="small" @click="resetForm('classForm')">取消</el-button>
      </div>
      </Modal>
    <Card shadow style="text-align: left">
      <p slot="title" style="font-size:20px;height:24px">
        所有班级
      </p>
      <el-input
        placeholder="请输入关键词"
        prefix-icon="el-icon-search"
        v-model="query.keyword"
        style="width: 200px"
        size="small"
        @input="debouncedGetClasses()"
        >
      </el-input>
      <el-button @click="pushRoute({})" size="mini" type="primary"
          >重置</el-button>
      <el-button size="mini" @click="handleCreate">新建班级</el-button>
      <el-table
      :data="classes"
      style="width:100%">
        <el-table-column
        prop="id"
        label="ID"
        width="180">
        </el-table-column>
        <el-table-column
        prop="name"
        label="班级名称"
        width="180">
        </el-table-column>
        <el-table-column
        prop="stunum"
        label="学生数">
        </el-table-column>
        <el-table-column
        prop="createtime"
        label="创建时间">
        </el-table-column>
      </el-table>
  <el-pagination
  layout="total, prev, pager, next"
          :total="total"
          :page-size.sync="query.limit"
          :current-page.sync="query.page"
          @current-change="pushRoute()">
  </el-pagination>
  <!-- total取完数据之后再变更v-if="total !=0" -->
    </Card>
    </div>
</template>

<script>
import { filterEmptyValue, debounce } from '@/util';

export default {
  name: 'Class',
  data() {
    return {
      classes: [],
      query: {
        page: 1,
        limit: 10,
        keyword: '',
      },
      modalClass: {
        visible: false,
        loading: false,
      },
      classForm: {
        name: '',
      },
      classRules: {
        name: [
          { required: true, message: '请输入班级名称', trigger: 'blur' },
          { min: 3, max: 30, message: '请输入3-30个字', trigger: 'blur' },
        ],
      },
      total: 0,
    };
  },
  methods: {
    updateQuery() {
      const { page, limit, keyword } = this.$route.query;
      const query = {};
      query.page = parseInt(page) || 1;
      query.limit = parseInt(limit) || 10;
      query.keyword = keyword || '';
      return query;
    },
    async getClasses() {
      const query = this.updateQuery();
      const params = filterEmptyValue(query);
      const res = await this.$http('/api/user/class', 'get', { params }).catch();
      this.classes = res?.data || [];
      this.total = res?.total || 0;
      Object.assign(this.query, query);
    },
    handleCreate() {
      this.resetForm();
      this.modalClass.visible = true;
    },
    resetForm() {
      this.$refs.classForm.resetFields();
    },
    handleClassSubmit() {
      this.$refs.classForm.validate(async (valid) => {
        if (valid) {
          const data = Object.assign({}, this.classForm);
          this.modalClass.loading = true;
          const res = await this.$http('/api/user/class', 'post', { data })
          .catch(
            () => {
              this.modalClass.loading = false;
            },
          );
          if (res) {
            this.$info('创建成功');
            this.modalClass.visible = false;
            this.getClasses();
          }
          this.modalClass.loading = false;
        } else {
          this.$error('请正确填写表单');
        }
      });
    },
    searchClassesByKeyword() {
      this.query.page = 1;
      this.pushRoute();
    },
    pushRoute(ctm = null) {
      this.$router.push({
        name: 'class',
        query: ctm || filterEmptyValue(this.query, [false]),
      });
    },
    debouncedGetClasses() {},
  },
  mounted() {
    this.getClasses();
    this.debouncedGetClasses = debounce(this.searchClassesByKeyword);
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getClasses();
      }
    },
  },
};

</script>
<style scoped>
.class-table .el-button {
  display: inline;
}
.class-table .el-button + .el-button {
  margin: 2px 0;
}
</style>
