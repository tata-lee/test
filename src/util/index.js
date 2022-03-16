// 去掉传入对象中的假值（undefined, null, 0, false），exclude中可以声明不需要去除的值
const filterEmptyValue = (obj, exclude = []) => {
  const ret = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v || exclude.includes(v)) {
      ret[k] = v;
    }
  });
  return ret;
};

// 将'true'和'false'转换为对应布尔值，其他返回undefined
const cvtStr2Bool = val => (val ? (/^true$/i).test(val) : undefined);

// 从obj2中提取obj1中所有键的元素赋值给obj1
const reAssign = (obj1, obj2) => {
  Object.keys(obj1).forEach((k) => {
    obj1[k] = obj2[k];
  });
};

// 防抖 在输入结束的时候执行函数
function debounce(func) {
  let timer = null;
  return () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(func, 500);/* 500毫秒后执行，每次输入都会把前面的请求取消掉 */
  };
}/* 不防抖的话就会每打一个字就弹一个页面，每次输入都会触发事件，当用户在短时间内连续输入时，只会在输入结束时触发，让查询函数延时查询 */

// 空函数，用于catch中不做任何操作
const voidFunc = Function.prototype;

function cvtSeconds2Str(time) {
  const hour = Math.floor(time / 3600);
  const minute = Math.floor((time % 3600) / 60);
  if (hour === 0 && minute === 0) {
    return '小于一分钟';
  } else if (hour === 0) {
    return `${minute}分钟`;
  }
  return `${hour}小时${minute}分钟`;
}

// 触发vue对数组变化的监听
const invokeArray = (arr) => {
  arr.splice(arr.length, 0);
};

function cvtStamp2String(ts) {
  return new Date(parseInt(ts) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}

function runAllPromises(promises) {
  return new Promise((resolve, reject) => {
    let ret = 0;
    let total = 0;
    const len = promises.length;
    promises.forEach((p) => {
      p.then(() => {
        ret++;
        total++;
        if (total === len) {
          resolve(ret);
        }
      }).catch(() => {
        total++;
        if (total === len) {
          resolve(ret);
        }
      });
    });
  });
}

export { filterEmptyValue,
  cvtStr2Bool,
  reAssign,
  debounce,
  voidFunc,
  cvtSeconds2Str,
  invokeArray,
  cvtStamp2String,
  runAllPromises };
