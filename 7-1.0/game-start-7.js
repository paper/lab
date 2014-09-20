/*
 * @Author: paper
 * @Blog: papaeragain.wordpress.com
 * @Gmail: zhang.binjue@gmail.com
 * 
 * 7键游戏运行代码
 */

/*===================
 * 游戏代码
 ===================*/
var SevenButton=(function(){
	var sevenButton=document.getElementById('sevenButton'),
		buttons=sevenButton.getElementsByTagName('li'),
		
		//找到第下num个兄弟，num默认是1
		next = function(node, num){
			var num = num || 1, elem = node;
			
			while (num != 0) {
				do {
					elem = elem.nextSibling;
				}
				while (elem && elem.nodeType != 1);
				
				num--;
			}
			
			return elem ? elem : null;
		},
		
		//找到第上num个兄弟，num默认是1
		pre = function(node, num){
			var num = num || 1, elem = node;

			while (num != 0) {
				do {
					elem = elem.previousSibling; 
				}
				while (elem && elem.nodeType != 1);
				
				num--;
			}
			
			return elem ? elem : null;
		},
		
		//判断游戏是不是结束了
		checkWin=function(buttons){
			if(buttons[0].className=='game-bt-up' 
			&& buttons[1].className=='game-bt-up' 
			&& buttons[2].className=='game-bt-up'
			&& buttons[3].className=='game-bt-space'
			&& buttons[4].className=='game-bt-down'
			&& buttons[5].className=='game-bt-down'
			&& buttons[6].className=='game-bt-down'){
				yourTime.stopTime();
				global_para.gameover=true;
				alert('恭喜，你成功了！\n 时间是:'+(+document.getElementById('yourTime_min').innerHTML)+'分'+(+document.getElementById('yourTime_sec').innerHTML)+'秒，快和朋友分享吧！');
				return;
			}
		},
		
		//点击每一个按钮所做的事情
		clickButton=function(node,buttons){
			var curClassName=node.className;
			
			if(curClassName=='game-bt-space') return;
			
			if(curClassName=='game-bt-down'){
				var next1=next(node);
				if(next1 && next1.className=='game-bt-space'){
					node.className='game-bt-space';
					next1.className='game-bt-down';
					checkWin(buttons);
					return;
				}
				
				var next2=next(node,2);
				if(next2 && next2.className=='game-bt-space'){
					node.className='game-bt-space';
					next2.className='game-bt-down';
					checkWin(buttons);
					return;
				}
			}
			
			if(curClassName=='game-bt-up'){
				var pre1=pre(node);
				if(pre1 && pre1.className=='game-bt-space'){
					node.className='game-bt-space';
					pre1.className='game-bt-up';
					checkWin(buttons);
					return;
				}
				
				var pre2=pre(node,2);
				if(pre2 && pre2.className=='game-bt-space'){
					node.className='game-bt-space';
					pre2.className='game-bt-up';
					checkWin(buttons);
					return;
				}
			}
		},
		
		bind=function(){
			for (var i = 0; i < 7; i++) {
				buttons[i].addEventListener(global_para.eventName,function(){
					clickButton(this,buttons);
				},false);
			}
		};
		
		FIP.stopHandSelect(buttons);
		
		return bind;
})();
SevenButton();

/*===================
 * 重置游戏
 ===================*/
var gameAgain=(function(){
	var resetButton=document.getElementById('re'),
		sevenButton=document.getElementById('sevenButton'),
		buttons=sevenButton.getElementsByTagName('li');
	
	FIP.stopHandSelect(resetButton);
	
	return function(){
		resetButton.addEventListener(global_para.eventName,function(){
			for(var i=0;i<7;i++){
				if(i<3){
					buttons[i].className='game-bt-down';
				}else if(i==3){
					buttons[i].className='game-bt-space';
				}else{
					buttons[i].className='game-bt-up';
				}
			}
			
			yourTime.resetTime();
			global_para.gameover=false;
		},false);
	}
})();
gameAgain();

/*===================
 * 计时
 ===================*/
var yourTime=(function(){
	var yourTime_min=document.getElementById('yourTime_min'),
		yourTime_sec=document.getElementById('yourTime_sec'),
		T,
		t=-1,min=0,sec=0;
	
	function getMin(t){
		var m=parseInt(t/60);
		
		return m<10 ? ('0'+m) : m;
	};
	
	function getSec(t){
		var s=t%60;
		
		return s<10 ? ('0'+s) : s;
	};
	
	return {
		startTime:function(){
			(function(){
				t++;
				yourTime_min.innerHTML=getMin(t);
				yourTime_sec.innerHTML=getSec(t);
				
				T=setTimeout(arguments.callee,1000);
			})();
		},
		resetTime:function(){
			clearTimeout(T);
			yourTime_min.innerHTML="00";
			yourTime_sec.innerHTML="00";
			
			t=-1;min=0;sec=0;
			yourTime.startTime();
		},
		stopTime:function(){
			clearTimeout(T);
		},
		continueTime:function(){
			yourTime.startTime();
		}
	}
})();

yourTime.startTime();

