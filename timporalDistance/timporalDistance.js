;(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.timporalDistance = factory();
  }

})(this, function(require, exports, module) {
  /**
    1分钟前，2分钟前，59分钟前
    1小时前，2小时前，23小时前
    1天前(昨天)，2天前（前天），3天前，29天前，
    1个月前，2个月前，3个月前，11个月前，
    1年前，2年前。。。。。。
    @beginTime  一般是文章或信息发布时间
    @endTime    一般是系统时间(一般是now)
  */
  var timporalDistance = function(beginTime, endTime){
    var str = "";
    var suffix = "前";
    var result = "";
    
    var beginDate = new Date(beginTime);
    var endDate = typeof endTime == "undefined" ? new Date() : new Date(endTime);
    var beginTimeStamp = +beginDate;
    var endTimeStamp = +endDate;
    
    if( endTimeStamp < beginTimeStamp ){
      suffix = "后";
    }
    
    var second = Math.abs( endTimeStamp - beginTimeStamp ) / 1000;
    var minute = second / 60;
    var hour = minute / 60;
    var day = hour / 24;
    var month = day / 30;
    var year = month / 12;
    
    if( minute < 59 ){
      str = parseInt( minute, 10 ) + 1 + "分钟";
    }else if( hour < 23  ){
      str = parseInt( hour, 10 ) + 1 + "小时";
    }else if( day < 29 ){
      str = parseInt( day, 10 ) + 1 + "天";
    }else if( month < 11 ){
      str = parseInt( day, 10 ) + 1 + "个月";
    }else{
      str = parseInt( year, 10 ) + 1 + "年";
    }
    
    result = str + suffix;
    
    if(str == "1天"){
      if( suffix == "前" ){
        result = "昨天";
      }else{
        result = "明天";
      }
    }else if(str == "2天"){
      if( suffix == "前" ){
        result = "前天";
      }else{
        result = "后天";
      }
    }
    
    return result;
  }
  
  return timporalDistance;
});