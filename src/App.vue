<template>
  <div v-if="isLogin"><router-view/></div>
  <div id="app" v-else>
    <Row style="height: 100%">
      <Col span="4">
        <SideMenu></SideMenu>
      </Col>
      <Col span="20"><router-view/></Col>
    </Row>
  </div>
</template>

<script>
import SideMenu from '@/components/SideMenu';

export default {
  name: 'App',
  components: {
    SideMenu,
  },
  computed: {
    isLogin() {
      return this.$route.path === '/login';
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
.main {
  margin: 5px;
}
html,body {
  height: 100%;
  background: lightgray;
}
.ivu-card {
  text-align: left;
}
.card-title {
  font-size: 20px !important;
}
</style>
