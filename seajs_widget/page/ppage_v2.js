/*===========================================
  @Author paper
  @Date 2014-11-21
  
  acg 翻页组件
===========================================*/

// 所有模块都通过 define 来定义
define(function(require, exports, module) {
  
  var ppage_css_id = '__CHW_PPAGE_CSS_ID_2015__';
  
  var multiline = require('http://www.18touch.com/Public/js/seajs-widget/multiline.js');
  
  var ppageDefaultCss =  multiline(function(){
    
    /*
      .chw-mod-page-wrap {
          clear: both;
          margin: 24px 0;
      }
      .chw-mod-page {
          text-align: center;
      }
      .chw-mod-page * {
          vertical-align: middle;
      }
      .chw-mod-page a, .chw-mod-page span, .chw-mod-page em {
          border-radius: 2px;
          color: #999;
          display: inline-block;
          margin-right: 5px;
          padding: 3px 8px;
      }
      .chw-mod-page span {
          padding: 5px 2px 4px;
      }
      .chw-mod-page a {
          background-color: #f1f1f1;
          background-image: -moz-linear-gradient(center top , #fff, #f5f5f5);
          border: 1px solid #afd7eb;
          text-decoration: none;
      }
      .chw-mod-page a:hover {
          border: 1px solid #7fc3e6;
          color: #444;
      }
      .chw-mod-page em {
          background-color: #7fc3e6;
          border: 1px solid #7fc3e6;
          color: #fff;
          font-weight: normal;
          position: relative;
          text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.1);
      }
      .chw-mod-page em i {
          height: 13px;
          left: 50%;
          margin-left: -7px;
          position: absolute;
          top: -13px;
          width: 13px;
      }
      .chw-mod-page .chw-mod-page-elevator-wrap {
          margin-left: 30px;
          position: relative;
      }
      .chw-mod-page .chw-mod-page-elevator-warning {
          background-color: #fff;
          border: 1px solid #7fc3e6;
          border-radius: 2px;
          box-shadow: 0 1px 3px #cfcfcf;
          font-family: Tahoma;
          left: -22px;
          line-height: 1.2;
          margin: 0;
          padding: 3px 5px 5px;
          position: absolute;
          text-align: center;
          top: -28px;
          width: 82px;
          z-index: 10;
      }
      .chw-mod-page .chw-mod-page-elevator-warning span {
          color: #fa0000;
          margin: 0;
          padding: 0;
      }
      .chw-mod-page .chw-mod-page-elevator-warning b, .chw-mod-page .chw-mod-page-elevator-warning i {
          height: 0;
          overflow: hidden;
          position: absolute;
          width: 0;
      }
      .chw-mod-page .chw-mod-page-elevator-warning b {
          border-left: 5px dashed transparent;
          border-right: 5px dashed transparent;
          border-top: 5px solid #b3b3b3;
          bottom: -5px;
          left: 40px;
      }
      .chw-mod-page .chw-mod-page-elevator-warning i {
          border-left: 4px dashed transparent;
          border-right: 4px dashed transparent;
          border-top: 4px solid #fff;
          bottom: -3px;
          left: 41px;
      }
      .chw-mod-page .chw-mod-page-txt {
          border: 1px solid #afd7eb;
          border-radius: 2px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) inset;
          color: #999;
          height: 21px;
          margin-right: 4px;
          padding: 1px 3px 2px;
          text-align: center;
          width: 35px;
      }
      .chw-mod-page .chw-mod-page-txt:hover, .chw-mod-page .chw-mod-page-txt:focus {
          border-color: #7fc3e6;
          color: #444;
      }
      .chw-mod-page .chw-mod-page-btn {
          background-color: #f1f1f1;
          background-image: -moz-linear-gradient(center top , #fff, #f5f5f5);
          border: 1px solid #afd7eb;
          border-radius: 2px;
          color: #999;
          display: inline-block;
          margin-right: 4px;
          padding: 3px 8px;
          text-decoration: none;
      }
      .chw-mod-page .chw-mod-page-btn:hover, .chw-mod-page .chw-mod-page-btn:focus {
          border-color: #7fc3e6;
          outline: medium none;
      }
    */
    
  });
  
	function ppage(pid,curNum,maxNum,funcName,elevator){
  
    //直达页面UI是否出现 , 为true 时出现
    elevator = elevator || false;
    
    function getAHtml(num){
      return '<a href="javascript:;" onclick="'+funcName+'('+num+');return false;">'+num+'</a>';
    }
    
    if( curNum > maxNum ){
      curNum = maxNum;
    }
    
    var page = typeof pid=="string" ? document.getElementById(pid) : pid,
    
      sPrev='',
      sNext='',
      sResult='',
      sp='',
      sn='',
      sCur='<em>'+curNum+'<i></i></em>',
      gd='<span>...</span>',
      
      prevNum,
      nextNum,
      
      i,
      
      elevatorHtml='';
    
    if( maxNum <= 0 ){
      page.innerHTML = '<em>1<i></i></em>';
      return;
    }

    if(curNum==1){
      //sPrev='<span>«</span>';
      sPrev='';
    }else{
      prevNum=curNum-1;
      sPrev='<a href="javascript:;" onclick="'+funcName+'('+prevNum+');return false;" title="上一页">«</a>';
    }
    
    if(curNum==maxNum){
      //sNext='<span>»</span>';
      sNext='';
    }else{
      nextNum=curNum+1;
      sNext='<a href="javascript:;" onclick="'+funcName+'('+nextNum+');return false;" title="下一页">»</a>';
    }
    
    if(maxNum<=6){
      for(i=1;i<curNum;i++){
        sp+=getAHtml(i);
      }
      
      for(i=curNum+1;i<=maxNum;i++){
        sn+=getAHtml(i);
      }
      
      sResult=sPrev+sp+sCur+sn+sNext;
    }else{
      if (curNum <= 4) {
        for (i = 1; i < curNum; i++) {
          sp += getAHtml(i);
        }

        for (i = curNum + 1; i <= 5; i++) {
          sn += getAHtml(i);
        }
        
        sNext=getAHtml(maxNum)+sNext;
        
        sResult=sPrev+sp+sCur+sn+gd+sNext;
      }else{
        sPrev=sPrev+getAHtml(1);
        
        if(curNum<maxNum-3){
          for (i = curNum-2; i < curNum; i++) {
            sp += getAHtml(i);
          }
        
          for (i = curNum + 1; i <= curNum+2; i++) {
            sn += getAHtml(i);
          }
          
          sNext=getAHtml(maxNum)+sNext;
          
          sResult=sPrev+gd+sp+sCur+sn+gd+sNext;
        }else{
          for (i = maxNum-4; i < curNum; i++) {
            sp += getAHtml(i);
          }
          
          for (i = curNum + 1; i <= maxNum; i++) {
            sn += getAHtml(i);
          }
          
          sResult=sPrev+gd+sp+sCur+sn+sNext;
        }
      }
    }
    
    function ok(v, max){
      v = +v;
      
      if(!v || typeof v!=="number" || v>max || v<0){
        var pageWarningElem = document.getElementById(pageWarningId);
        
        clearTimeout(timeout);
      
        pageWarningElem.style.display="block";

        timeout=setTimeout(function(){
          pageWarningElem.style.display="none";
        },time);
        
        return;
      }
      
      eval(funcName+'('+v+')');
    }
    
    if(elevator===true && maxNum != 1){
      var n1 = +new Date(),
          n2 = parseInt(Math.random()*1000, 10),
          pagetTextId = "J_page_num"+n1+n2,
          pageWarningId = "J_page_elevator_warning" + n1 + n2,
          
          timeout = "time" + n1 + n2,
          time = 2000,
        
          f = funcName.replace(/\./g,"_");
      
      elevatorHtml='<span class="chw-mod-page-elevator-wrap"><div id="'+pageWarningId+'" class="chw-mod-page-elevator-warning" style="display:none;"><span>最大页数 '+maxNum+'</span><b></b><i></i></div><input class="chw-mod-page-txt" type="text" id="'+pagetTextId+'" autocomplete="off" style="ime-mode:disabled" title="请输入页码，最大页数：'+maxNum+'" /><button class="chw-mod-page-btn" onclick="PPage_elevator_'+f+'(document.getElementById(\''+pagetTextId+'\').value,'+maxNum+');return false;">确定</button></span>';
    }
    
    page.innerHTML = '<div class="chw-mod-page-wrap"><div class="chw-mod-page">' + sResult + elevatorHtml + '</div></div>';
    
    if($){
      $(document).keyup(function(e){
        if( e.keyCode == 13 && $("#" + pagetTextId).is(":focus") ){
          ok($("#" + pagetTextId).val(), maxNum);
        }
      });
    }
    
    window['PPage_elevator_'+f] = function(v, max){
      ok(v, max);
    }
    
  };
  
  // 加载样式，只加载一次
  if( !document.getElementById(ppage_css_id) ){
    multiline.addSheet(ppageDefaultCss, ppage_css_id);
  }
  
  // 或者通过 module.exports 提供整个接口
  module.exports = ppage;

});



