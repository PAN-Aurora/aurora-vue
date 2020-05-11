/**
 * Created by ligua on 2017/8/17.
 */
import {warning} from './alert_util'


export function timeDuration(_this,startTime,endTime){
  if (startTime > endTime) {
    warning(_this,'结束时间应该大于开始时间！')
    return
  } else {
    let timeLong = parseInt((endTime.getTime() - startTime.getTime())/1000)
    var str = ''
    if (timeLong > 60) {
      if (Math.round(timeLong / 3600) >= 1) {
        let hour =parseInt(timeLong / 60 / 60)
        let minute = parseInt(timeLong / 60 - hour*60)
        let second = parseInt((timeLong - (hour * 60 * 60 + minute * 60)))
        str += hour + '时' + minute + '分' + second + '秒'
      } else {
        let minute = parseInt(timeLong / 60)
        str += minute + '分' + timeLong-minute*60 + '秒'
      }
    } else {
      str += timeLong + '秒'
    }
  }
  return str
}

Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

export function timeFormatter (date,format) {
  return new Date(date).Format(format) //'yyyy-MM-dd hh:mm:ss'
}

export function getCurrentTime () {
  return new Date().Format('yyyy-MM-dd hh:mm:ss')
}

//毫秒转00：00：00
export function hmsFormat (ms) {
  var hours = parseInt((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = parseInt((ms % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = parseInt((ms % (1000 * 60)) / 1000);
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return hours + ":" + minutes + ":" + seconds;
}

export function convertLastSeconds2Str(seconds)
{

  if( seconds == '-' || parseInt(seconds) < 0 ){
    return seconds;
  }
  if(seconds) {
    var s = parseInt(seconds);
    var d = parseInt(s / (3600 * 24));
    var h = parseInt(s % (3600 * 24) / 3600);
    var m = parseInt(s % 3600 / 60);
    s = s % 60;
    return (d == 0 ? "" : d + "天") + (h == 0 ? "" : h + "时") + (m == 0 ? "" : m + "分") + (s == 0 ? "0秒" : s + "秒")
  }
}

export function getNowFormatDate() {//'yyyy-MM-dd'
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

