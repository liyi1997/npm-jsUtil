export function add(a, b) {
  return a + b;
}

export function getStorge(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setStorge(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function removeStorge(key) {
  localStorage.removeItem(key);
}

/**
 * 深拷贝
 * @param {object} obj 要进行深拷贝的数组or对象
 * @returns 深拷贝结果
 */
export function deepClone(obj) {
  //判断要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
  const objClone = Array.isArray(obj) ? [] : {};
  //进行深拷贝的不能为空，并且是对象或者是
  let key;
  if (obj && typeof obj === 'object') {
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = deepClone(obj[key]);
        } else {
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}

// js精度解决
function toInt(num) {
  const res = {};
  let str = num < 0 ? String(-num) : String(num); // 2.12
  let pos = str.indexOf('.'); // 获取小数点下标
  let len = str.substr(pos + 1).length; // 取出小数的具体数值
  let times = Math.pow(10, len + 1); //当小数位数较多时，避免出错，所以多扩大一倍，提高精度
  res.times = times;
  res.num = num;
  return res;
}

/**
 * js进度计算
 * @param {number} a 计算值
 * @param {number} b 计算值
 * @param {string} option 计算操作符
 * @returns 计算结果
 */
export function operate(a, b, option) {
  const num1 = toInt(a);
  const num2 = toInt(b);
  const maxTimes = num1 > num2 ? num1.times : num2.times;
  let val = null;
  switch (option) {
    case '+':
      val = (num1.num * maxTimes + num2.num * maxTimes) / maxTimes;
      break;

    case '-':
      val = (num1.num * maxTimes - num2.num * maxTimes) / maxTimes;
      break;

    case '*':
      val = (num1.num * maxTimes * num2.num * maxTimes) / (maxTimes * maxTimes);
      break;

    case '/':
      val = (num1.num * maxTimes) / (num2.num * maxTimes);
      break;

    default:
      break;
  }
  return val;
}

/**
 * 时间戳格式化函数
 * @param  {string} format    格式
 * @param  {int}    timestamp 要格式化的时间 默认为当前时间
 * @param  {string} str       格式的符号 (-,.cn) 传cn时间就为YY年mm月dd日
 * @return {string}           格式化的时间字符串
 */
export function getTime(format, timestamp, str = '-') {
  let a,
    jsdate = timestamp ? new Date(timestamp * 1000) : new Date();
  let pad = (n, c) => {
    if ((n = n + '').length < c) {
      return new Array(++c - n.length).join('0') + n;
    } else {
      return n;
    }
  };
  let txt_weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let txt_ordin = { 1: 'st', 2: 'nd', 3: 'rd', 21: 'st', 22: 'nd', 23: 'rd', 31: 'st' };
  let txt_months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let f = {
    // Day
    d: () => {
      return pad(f.j(), 2);
    },
    D: () => {
      return f.l().substr(0, 3);
    },
    j: () => {
      return jsdate.getDate();
    },
    l: () => {
      return txt_weekdays[f.w()];
    },
    N: () => {
      return f.w() + 1;
    },
    S: () => {
      return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th';
    },
    w: () => {
      return jsdate.getDay();
    },
    z: () => {
      return ((jsdate - new Date(jsdate.getFullYear() + '/1/1')) / 864e5) >> 0;
    },

    // Week
    W: () => {
      let a = f.z(),
        b = 364 + f.L() - a;
      let nd2,
        nd = (new Date(jsdate.getFullYear() + '/1/1').getDay() || 7) - 1;
      if (b <= 2 && (jsdate.getDay() || 7) - 1 <= 2 - b) {
        return 1;
      } else {
        if (a <= 2 && nd >= 4 && a >= 6 - nd) {
          nd2 = new Date(jsdate.getFullYear() - 1 + '/12/31');
          return date('W', Math.round(nd2.getTime() / 1000));
        } else {
          return (1 + (nd <= 3 ? (a + nd) / 7 : (a - (7 - nd)) / 7)) >> 0;
        }
      }
    },

    // Month
    F: () => {
      return txt_months[f.n()];
    },
    m: () => {
      return pad(f.n(), 2);
    },
    M: () => {
      return f.F().substr(0, 3);
    },
    n: () => {
      return jsdate.getMonth() + 1;
    },
    t: () => {
      let n;
      if ((n = jsdate.getMonth() + 1) == 2) {
        return 28 + f.L();
      } else {
        if ((n & 1 && n < 8) || (!(n & 1) && n > 7)) {
          return 31;
        } else {
          return 30;
        }
      }
    },

    // Year
    L: () => {
      let y = f.Y();
      return !(y & 3) && (y % 1e2 || !(y % 4e2)) ? 1 : 0;
    },
    //o not supported yet
    Y: () => {
      return jsdate.getFullYear();
    },
    y: () => {
      return (jsdate.getFullYear() + '').slice(2);
    },

    // Time
    a: () => {
      return jsdate.getHours() > 11 ? 'pm' : 'am';
    },
    A: () => {
      return f.a().toUpperCase();
    },
    B: () => {
      // peter paul koch:
      let off = (jsdate.getTimezoneOffset() + 60) * 60;
      let theSeconds = jsdate.getHours() * 3600 + jsdate.getMinutes() * 60 + jsdate.getSeconds() + off;
      let beat = Math.floor(theSeconds / 86.4);
      if (beat > 1000) beat -= 1000;
      if (beat < 0) beat += 1000;
      if (String(beat).length == 1) beat = '00' + beat;
      if (String(beat).length == 2) beat = '0' + beat;
      return beat;
    },
    g: () => {
      return jsdate.getHours() % 12 || 12;
    },
    G: () => {
      return jsdate.getHours();
    },
    h: () => {
      return pad(f.g(), 2);
    },
    H: () => {
      return pad(jsdate.getHours(), 2);
    },
    i: () => {
      return pad(jsdate.getMinutes(), 2);
    },
    s: () => {
      return pad(jsdate.getSeconds(), 2);
    },
    O: () => {
      let t = pad(Math.abs((jsdate.getTimezoneOffset() / 60) * 100), 4);
      if (jsdate.getTimezoneOffset() > 0) t = '-' + t;
      else t = '+' + t;
      return t;
    },
    P: () => {
      let O = f.O();
      return O.substr(0, 3) + ':' + O.substr(3, 2);
    },
    c: () => {
      return f.Y() + `-` + f.m() + `-` + f.d() + 'T' + f.h() + ':' + f.i() + ':' + f.s() + f.P();
    },
    U: () => {
      return Math.round(jsdate.getTime() / 1000);
    },
  };
  format = format.replace(/([a-zA-Z])/g, (t, s) => {
    if (t != s) {
      // escaped
      ret = s;
    } else if (f[s]) {
      // a date function exists
      ret = f[s]();
    } else {
      // nothing special
      ret = s;
    }
    return ret;
  });
  if (str === 'cn') {
    return format.replace(/-/, '年').replace(/-/, '月').replace(/\s/, '日 ');
  }
  return format.replace(/-/g, str);
}
