<template>
  <div class="page">
    <Form
      :model="formLogin"
      ref="LoginForm"
      :rules="ruleLogin"
      class="login-form"
    >
      <br />
      <h2 style="text-align: center">请登录</h2>
      <br />
      <FormItem label="账号" prop="userid">
        <Input
          type="text"
          v-model="formLogin.userid"
          placeholder="账号"
          @on-enter="handleLogin"
          class="input"
        ></Input>
      </FormItem>

      <FormItem label="密码" prop="password">
        <Input
          type="password"
          v-model="formLogin.password"
          placeholder="密码"
          @on-enter="handleLogin"
          class="input"
        ></Input>
      </FormItem>

      <FormItem>
        <Button
          type="warning"
          class="submit-btn"
          round
          @click="handleLogin"
          :loading="btnLoginLoading"
          style="margin-left: -1px"
          >登录</Button
        >
        <br />
      </FormItem>
      <br />
      <br />
    </Form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      btnLoginLoading: false,
      formLogin: {
        username: '',
        password: '',
        type: 'm',
      },
      ruleLogin: {
        userid: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'change',
            min: 6,
            max: 20,
          },
        ],
      },
    };
  },
  methods: {
    ...mapActions(['setUser']),
    handleLogin() {
      this.btnLoginLoading = true;
      this.$refs.LoginForm.validate(valid => new Promise((resolve, reject) => {
        if (!valid) {
          this.btnLoginLoading = false;
          this.$error('请正确填写表单');
          reject(valid);
        } else {
          resolve(valid);
        }
      })).then(async () => {
        const data = Object.assign({}, this.formLogin);
        const user = await this.$http('/api/user/login', 'post', { data }).catch(() => {
          this.btnLoginLoading = false;
        });
        if (user) {
          this.$info('登录成功');
          this.btnLoginLoading = false;
          this.setUser(user);
          this.$router.push({
            name: 'overview',
          });
        }
      }).catch();
    },
  },
  computed: {
    ...mapGetters(['user']),
  },
};
</script>

<style scoped>
.login-form {
  margin: 20px auto;
  width: 400px;
  background: rgb(194, 230, 241);
  box-shadow: 0 0 35px #b4bccc;
  padding: 0px 30px 0 30px;
  border-radius: 25px;
  position: relative;
  top: 40%;
  transform: translateY(-50%);
}
.submit-btn {
  width: 100%;
  margin-left: -40px;
}
.page {
  height: 100%;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-image: url("../assets/login.jpg");
  background-size: 100% 100%;
  background-attachment: fixed;
}
.input {
  margin-left: 0px;
}
</style>
