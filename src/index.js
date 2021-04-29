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

export function getTime(val) {
  return val;
}
