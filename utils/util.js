export function getFullDate(t) {
  var time = new Date(t)
  console.log(time,"time")
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  return y + '/' + (m < 10 ? '0' + m : m) + '/' + (d < 10 ? '0' + d : d)
}
export function getTime(value) {
  var time = Math.round(new Date(value).getTime() / 1000);
  return time;
}
export function timestampToTime(timestamp) {
  if (!timestamp){
    return;
  }
  var len = timestamp.length;
  // console.log(len,"len")
  var value = "";
  if (len == 10) {
    value = timestamp * 1000;
  } else if (len == 13) {
    value = timestamp;
  }
  var date = new Date(value);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  // console.log(date, "date")
  var Y = date.getFullYear() + '/';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
  var D = date.getDate()< 10 ? '0' + date.getDate() : date.getDate();
  // var h = date.getHours() + ':';
  // var m = date.getMinutes() + ':';
  // var s = date.getSeconds();
  return Y + M + D;
}

export function hasNull(params){
  var keys = Object.keys(params);
  for (var i = 0; i < keys.length; i++) {
    console.log(params[keys[i]], "params[keys[i]]")
    var obj = params[keys[i]];
    if (!obj && obj!=0) {
      return true;
    }
  }
  return false;
}