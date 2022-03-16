import Login from '@/pages/Login';
import Course from '@/pages/Course';
import Class from '@/pages/Class';
import Experiment from '@/pages/Experiment';
import Selection from '@/pages/Selection';
import Student from '@/pages/Student';
import Teacher from '@/pages/Teacher';
import Manager from '@/pages/Manager';
import Container from '@/pages/Container';
import Env from '@/pages/Env';
import Overview from '@/pages/Overview';
import Anno from '@/pages/Anno';
import Feedback from '@/pages/Feedback';
import Payload from '@/pages/Payload';
import Action from '@/pages/Action';
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'overview',
      component: Overview,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/class',
      name: 'class',
      component: Class,
    },
    {
      path: '/course',
      name: 'course',
      component: Course,
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: Teacher,
    },
    {
      path: '/student',
      name: 'student',
      component: Student,
    },
    {
      path: '/experiment',
      name: 'experiment',
      component: Experiment,
    },
    {
      path: '/selection',
      name: 'selection',
      component: Selection,
    },
    {
      path: '/manager',
      name: 'manager',
      component: Manager,
    },
    {
      path: '/container',
      name: 'container',
      component: Container,
    },
    {
      path: '/env',
      name: 'env',
      component: Env,
    },
    {
      path: '/anno',
      name: 'anno',
      component: Anno,
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: Feedback,
    },
    {
      path: '/payload',
      name: 'payload',
      component: Payload,
    },
    {
      path: '/action',
      name: 'action',
      component: Action,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (!Vue.$cookies.get('checker') || Vue.$cookies.get('type') !== 'm') { // 判断是否已经登录且前往的页面不是登录页
    if (to.name === 'login') next();
    else {
      next({
        name: 'login',
      });
    }
  } else {
      next();
  }
});

export default router;
