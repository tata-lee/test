<template>
  <div style="height:100%">
    <Menu class="side-menu">
      <MenuItem name="/personalinfo" style="text-align: center">
        <Dropdown :transfer="true">
          <div>
            <img class="avatar" :src="user.avatar" />
            <h2 class="text">
              {{ user.username }}
              <Icon type="ios-arrow-down"></Icon>
            </h2>
          </div>
          <DropdownMenu slot="list">
            <DropdownItem name="/personalinfo" style="text-align: center"
              >个人中心</DropdownItem
            >
            <DropdownItem divided>
              <Button type="text" @click="logout">退出登录</Button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </MenuItem>
      <Submenu name="website">
        <p slot="title">网站管理</p>
        <MenuItem name="anno" :to="{ name: 'anno' }">公告</MenuItem>
        <MenuItem name="feedback" :to="{ name: 'feedback' }">意见反馈</MenuItem>
      </Submenu>
      <Submenu name="user">
        <p slot="title">用户管理</p>
        <MenuItem name="student" :to="{ name: 'student' }">学生</MenuItem>
        <MenuItem name="class" :to="{ name: 'class' }">班级</MenuItem>
        <MenuItem name="teacher" :to="{ name: 'teacher'}">教师</MenuItem>
        <MenuItem name="manager" :to="{ name: 'manager' }">管理员</MenuItem>
      </Submenu>
      <Submenu name="course">
        <p slot="title">课程管理</p>
        <MenuItem name="course" :to="{ name: 'course' }">课程管理</MenuItem>
        <MenuItem name="experiment" :to="{ name: 'experiment' }">实验管理</MenuItem>
        <MenuItem name="selection" :to="{ name:'selection' }">选课管理</MenuItem>
      </Submenu>
      <Submenu name="env">
        <p slot="title">实验环境管理</p>
          <MenuItem name="op" :to="{ name: 'env' }">实验环境</MenuItem>
          <MenuItem name="container" :to="{ name: 'container' }">容器管理</MenuItem>
      </Submenu>
    </Menu>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'SideMenu',
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    ...mapActions(['getUser', 'clearUser']),
    logout() {
        this.clearUser();
        this.$cookies.remove('checker');
        this.$cookies.remove('kind');
        this.$router.push({
          name: 'login',
        });
    },
  },
  mounted() {
    if (!this.user.id) {
      this.getUser();
    }
  },
};
</script>
<style scoped>
.side-menu {
  height: 98%;
  border-radius: 5px;
  margin: 5px 3px;
}
.avatar {
  width: 60px;
  height: 60px;
}
</style>
