import config from "./config";

let truck = {}
truck.getUuid = function () {
  var len = 32;//32长度
  var radix = 16;//16进制
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); var uuid = [], i; radix = radix || chars.length; if (len) { for (i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix]; } else { var r; uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'; uuid[14] = '4'; for (i = 0; i < 36; i++) { if (!uuid[i]) { r = 0 | Math.random() * 16; uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]; } } }
  return uuid.join('');
}

function isObject(obj) {
  return typeof obj === 'object' && obj != null;
}

truck.deepClone = (source, hash = new WeakMap()) => {
  if (!isObject(source)) return source;
  if (hash.has(source)) return has.get(source)
  const target = Array.isArray(source) ? [] : {};
  hash.set(source, target);
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = truck.deepClone(source[key], hash)
    }
  }
  return target;
}
/* 颜色取反算法 */
truck.colorReverse = function (oldColorValue) {
  if (config.isColorReverse) {
    var oldColorValue = "0x" + oldColorValue.replace(/#/g, "");
    var str = "000000" + (0xFFFFFF - oldColorValue).toString(16);
    return "#" + str.substring(str.length - 6, str.length);
  } else {
    return oldColorValue;
  }
}
export default truck