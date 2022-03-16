import axios from 'axios';
import context from '../main';

axios.withCredentials = true;

async function basicHttp(url, method, payload, pass = true) {
  return new Promise((resolve, reject) => {
    axios.request({ url, method, params: payload?.params, data: payload?.data }).then((res) => {
      if (res.status !== 200) {
        context.$error(res.statusText);
        reject(res.statusText);
      }
      if (res.data.error !== undefined && pass) {
        if (res.data.error === '请登录') {
          context.$info('请重新登录');
          context.$router.push({ name: 'login' });
        } else {
          context.$error(res.data.error);
        }
        reject(res.data.error);
      } else {
        resolve(res.data);
      }
    }).catch((res) => {
      context.$error(res.response.data);
      reject(res);
    });
  });
}

async function basicHttpNew(url, method, payload, pass = true) {
  return new Promise((resolve, reject) => {
    axios.request({ url, method, params: payload?.params, data: payload?.data }).then((res) => {
      if (res.status !== 200 && res.status !== 201) {
        context.$error(res.statusText);
        reject(res.statusText);
      }
      if (res.data.success === false && pass) {
        if (res.data.statusCode === 403) {
          context.$info('请重新登录');
          context.$router.push({ name: 'login' });
        } else {
          context.$error(res.data.message);
        }
        reject(res.data);
      } else {
        resolve(res.data);
      }
    }).catch((res) => {
      context.$error(res.response.data);
      reject(res);
    });
  });
}

export { basicHttp, basicHttpNew };
