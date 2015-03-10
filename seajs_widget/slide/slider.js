/*===========================================
  @Author paper
  @Date 2015-02-12
  
  通用轮播图，基于jq和css3
  只做基本功能，大部分都自定义
  前面加了 $ 的都是jq对象
===========================================*/

define(function(require, exports, module) {
  
  var Slider = {};
  var noop = function(){};
  
  Slider.init = function(o){
  
    o = $.extend({
      // 左按钮
      '$prevBtn': null,
      'prevBtnDisabledClassName' : 'disabled',
      'prevBtnValidClassName' : '',
      'prevBtnCallback' : noop,
      
      // 右按钮
      '$nextBtn':null,
      'nextBtnDisabledClassName' : 'disabled',
      'nextBtnValidClassName' : '',
      'nextBtnCallback' : noop,
      
      // 小圆点集合
      '$dotWrap': null,
      'dotCurClassName' : 'cur',
      'dotBtnCallback' : noop,
      
      //每次动画一次后的回调函数
      'callback' : noop,
      
      // 轮播的总数
      'total': 1,
      
      // 每次轮播要走的距离
      'stepWidth': 0,
      
      // 整个 Slider 或者 gallery的容器
      '$wrap' : null,
      
      // 要移动的那个容器
      '$list': null,
      
      // 默认是左右，如果定义为top，也可以上下
      'direction' : 'left',
      
      // 是否自动轮播
      'auto': false,
      'autoInterval' : 3000
    }, o);
   
    var $prevBtn = o.$prevBtn;
    var prevBtnDisabledClassName = o.prevBtnDisabledClassName;
    var prevBtnValidClassName = o.prevBtnValidClassName;
    var prevBtnCallback = o.prevBtnCallback;
    
    var $nextBtn = o.$nextBtn;
    var nextBtnDisabledClassName = o.nextBtnDisabledClassName;
    var nextBtnValidClassName = o.nextBtnValidClassName;
    var nextBtnCallback = o.nextBtnCallback;
    
    var $dotWrap = o.$dotWrap;
    var dotCurClassName = o.dotCurClassName;
    var dotBtnCallback = o.dotBtnCallback;
    
    var callback = o.callback;
    
    var total = o.total;
    var stepWidth = o.stepWidth;
    
    var $wrap = o.$wrap;
    var $list = o.$list;
    var direction = o.direction;
    
    var auto = o.auto;
    var autoInterval = o.autoInterval;
    
    
    var curPos = 0;
    var curIndex = 0;
    var $someDot = null;
    
    var time = null;
    var key = true;

    function prevBtnDisabled(){
      $prevBtn.removeClass( prevBtnValidClassName ).addClass( prevBtnDisabledClassName );
    }
    function prevBtnValid(){
      $prevBtn.removeClass( prevBtnDisabledClassName ).addClass( prevBtnValidClassName );
    }
    
    function nextBtnDisabled(){
      $nextBtn.removeClass( nextBtnValidClassName ).addClass( nextBtnDisabledClassName );
    }
    function nextBtnValid(){
      $nextBtn.removeClass( nextBtnDisabledClassName ).addClass( nextBtnValidClassName );
    }
    
    // 根据当前的 cusIndex，更新左右按钮和点按钮 的样式
    function updateSomething(){
      
      if( total <= 1 ) return;
      
      prevBtnValid();
      nextBtnValid();
      
      if( curIndex == 0 ){
        prevBtnDisabled();
      }else if( curIndex == total - 1 ){
        nextBtnDisabled();
      }
      
      if( $someDot ){
        $someDot.removeClass(dotCurClassName);
        $someDot.eq(curIndex).addClass(dotCurClassName);
      }
      
      curPos = curIndex * stepWidth * -1;
    }
    
    function animate(index){
      curIndex = index;
      updateSomething();
      
      $list.css(direction, curPos);
    }
    
    // 小圆点初始化
    function initDot(){
      
      if( $dotWrap ){
      
        var dotHtml = '';
        
        for( var i=0; i<total; i++ ){
          if( i == 0 ){
            dotHtml += '<a href="javascript:;" data-chw-slider="'+ i +'" class="'+ dotCurClassName +'"></a>';
          }else{
            dotHtml += '<a href="javascript:;" data-chw-slider="'+ i +'" ></a>';
          }
        }
        
        $dotWrap.html( dotHtml );
        
        if( total > 1 ){
          
          $someDot = $dotWrap.find("a");
          
          $dotWrap.on("click", "a", function(){
            var i = +$(this).attr("data-chw-slider");
            animate(i);
            
            dotBtnCallback.call(this, curIndex, total, stepWidth);
            callback(curIndex, total, stepWidth);
          });
          
        }
        
      }
    }
    
    // 上一个按钮
    function initPrevBtn(){
      if( $prevBtn ){
        $prevBtn.on('click', function(){
          if( curIndex == 0 ) return;
          
          curIndex--;
          animate(curIndex);
          
          prevBtnCallback.call(this, curIndex, total, stepWidth);
          callback(curIndex, total, stepWidth);
        });
      }
    }
    
    // 下一个按钮
    function initNextBtn(){
      if( $nextBtn ){
        $nextBtn.on('click', function(){
          if( curIndex == total - 1 ) return;
          
          curIndex++;
          animate(curIndex);
          
          nextBtnCallback.call(this, curIndex, total, stepWidth);
          callback(curIndex, total, stepWidth);
        });
      }
    }
    
    function autoScroll(){
      
      if( auto !== true || total <= 1 || $wrap == null ){
        return;
      }
      
      function fn(){
        
        time = setTimeout(function(){
          if( key ){
            if( curIndex == total - 1 ){
              curIndex = 0;
            }else{
              curIndex++;
            }
            
            animate(curIndex);
            callback(curIndex, total, stepWidth);
          }
          
          fn();
        }, autoInterval);
        
      }
      
      fn();
      
      $wrap.on('mouseover', function(){
        key = false;
      });
      
      $wrap.on('mouseout', function(){
        key = true;
      });
      
    }//end autoScroll
    
    updateSomething();

    initPrevBtn();
    initNextBtn();
    initDot();
    
    autoScroll();
    
  }//end Slider.init
  
  
  // 或者通过 module.exports 提供整个接口
  module.exports = Slider;

});



