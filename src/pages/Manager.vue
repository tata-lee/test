<template>
  <div class="main">
    <Modal v-model="modalAdmin.visible" title="添加管理员">
      <el-form
        :model="adminForm"
        label-position="right"
        label-width="80px"
        :rules="adminRules"
        ref="adminForm"
      >
        <el-form-item label="账号" prop="userid">
          <el-input v-model="adminForm.userid"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="username">
          <el-input v-model="adminForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="adminForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="adminForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button
          type="primary"
          :loading="modalAdmin.loading"
          size="small"
          @click="handleAdminSubmit()"
          >确认</el-button
        >
        <el-button size="small" @click="resetForm('adminForm')">重置</el-button>
      </div>
    </Modal>
    <Modal
      :title="`修改${selectedUser.username}的密码`"
      v-model="showPasswordForm"
      @on-visible-change="handleModalClose"
    >
      <el-form v-model="passwordForm">
        <el-form-item label="新密码">
          <p :class="{ 'error-text': !passwordValid }">密码长度6-20位</p>
          <el-input
            show-password
            placeholder="请输入新密码"
            v-model="passwordForm.pwd"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            show-password
            placeholder="请确认密码"
            v-model="passwordForm.again"
            maxlength="20"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" @click="handleResetPassword">确认</el-button>
      </div>
    </Modal>
    <Card shadow>
      <p slot="title" class="card-title">管理员</p>
      <el-button slot="extra" size="mini" type="primary" @click="handleToAdmin">添加管理员</el-button>
      <el-table :data="managers">
        <el-table-column label="ID" prop="id" width="80"></el-table-column>
        <el-table-column label="工号" prop="userid"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column
          label="上次登录时间"
          prop="lastlogintime"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleToPassword(scope.row)"
            >
              修改密码
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
import { voidFunc } from '@/util';

export default {
  name: 'Manager',
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.adminForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      managers: [],
      query: {
        page: 1,
        limit: 10,
      },
      total: 0,
      selectedUser: {},
      showPasswordForm: false,
      passwordForm: {
        pwd: '',
        again: '',
      },
      modalAdmin: {
        visible: false,
        loading: false,
      },
      adminForm: {
        userid: '',
        username: '',
        password: '',
        checkPass: '',
      },
      adminRules: {
        userid: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 30, message: '请输入3-30个字符', trigger: 'blur' },
        ],
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 30, message: '请输入2-30个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 30, message: '请输入6-30个字符', trigger: 'blur' },
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    updateQuery() {
      const { page, limit } = this.$route.query;
      const query = {};
      query.page = parseInt(page) || 1;
      query.limit = parseInt(limit) || 10;
      return query;
    },
    async getManagers() {
      const query = this.updateQuery();
      const { page, limit } = query;
      const params = {
        page,
        limit,
        kind: 'm',
      };
      const res = await this.$http('/api/user/filter', 'get', { params }).catch(voidFunc);
      this.managers = res?.data || [];
      this.total = res?.total || 0;
      Object.assign(this.query, query);
    },
    pushRoute() {
      this.$router.push({
        name: 'manager',
        query: this.query,
      });
    },
    handleToPassword(row) {
      this.selectedUser = row;
      this.showPasswordForm = true;
    },
    async handleResetPassword() {
      if (this.passwordValid) {
        const { pwd, again } = this.passwordForm;
        if (pwd === '' || pwd !== again) {
          this.$error('两次输入的密码不匹配！');
          this.passwordForm.again = '';
          return;
        }
        const data = {
          password: pwd,
          id: this.selectedUser.id,
        };
        const res = await this.$http('/api/user/reset', 'post', { data }).catch(voidFunc);
        if (res) {
          this.$info('修改成功');
          this.showPasswordForm = false;
        }
      }
    },
    handleModalClose(status) {
      if (status) {
        this.passwordForm = {
          pwd: '',
          again: '',
        };
      }
    },
    handleToAdmin() {
      this.resetForm();
      this.modalAdmin.visible = true;
    },
    resetForm() {
      this.$refs.adminForm.resetFields();
    },
    handleAdminSubmit() {
      this.$refs.adminForm.validate(async (valid) => {
        if (valid) {
          const data = Object.assign({}, this.adminForm);
          data.kind = 'm';
          this.modalAdmin.loading = true;
          const res = await this.$http('/api/user/user', 'post', { data })
          .catch(
            () => {
              this.modalAdmin.loading = false;
            },
          );
          if (res) {
            this.$info('创建成功');
            this.modalAdmin.visible = false;
            this.getManagers();
          }
          this.modalAdmin.loading = false;
        } else {
          this.$error('请正确填写表单');
        }
      });
    },
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getManagers();
      }
    },
  },
  computed: {
    passwordValid() {
      return this.passwordForm.pwd.length >= 6 || this.passwordForm.pwd === '';
    },
  },
  mounted() {
    this.getManagers();
  },
};
</script>
<style scoped>
.error-text {
  color: red;
}
</style>
