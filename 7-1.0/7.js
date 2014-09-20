/*
 * @Author: paper
 * @Blog: papaeragain.wordpress.com
 * @Gmail: zhang.binjue@gmail.com
 */

/*==================================
 * 初始化
 * 
 * 1) 背景图片初始化
 ==================================*/
function init(){
	FIP.stopPageDrag();
	FIP.stopHandSelect('#menu a');
	
	if(sessionStorage.getItem('bgImage')){
		var bgImage=sessionStorage.getItem('bgImage');
		
		if(bgImage.indexOf('#')>-1){
			document.getElementById('body').style.background=bgImage;
		}else{
			document.getElementById('body').style.background='url('+bgImage+') no-repeat';
		}
	}
};

/*==================================
 * 全局变量
 ==================================*/
var global_para={
	//判断游戏是否结束
	//目前用在：如果游戏结束了，点击“继续游戏”，就不再计时。除非你点击了“重置”按钮。
	gameover:false,
	
	eventName:(FIP.isTouch ? 'touchend' : 'click'),
};

/*=============================================
 * @num
 * -1 就向左移动320 (假设这里是320)
 * -2 就向左移动640
 * 
 * 1 就向右移动320
 * 2 就向右移动640
 ===============================================*/
function move(num,callback){
	var step=320;
	var node=FIP.$id('moveWrapper');
	var b=parseInt( node.style.marginLeft );
	var e=b+step*num;
	
	FIP.animate({
		elem:node,
		begin:b,
		end:e,
		doingCallback:function(v){
			this.style.marginLeft=v+'px';
		},
		endCallback:function(){
			callback && callback();
		}
	});
};

/*====================================
 * 点击返回按钮，触发的事件
 *=================================== */
function goBack(id,callback){
	callback && callback();
	
	move(1,function(){
		FIP.hide(id);
	});
};

/*====================================
 * 点击每个menu的按钮，进行相应的操作
 * @callback是指：做完了ajax数据交互后，然后做的事情
 *=================================== */
function getContent(clickbt, wrap, url,callback){
	
	clickbt.addEventListener(global_para.eventName, function(){
		var dataLoaded = wrap.getAttribute('data-loaded');
		
		if (dataLoaded !== 'yes') {
			FIP.ajax({
				url: url,
				before: function(){
					FIP.loading.createLoading();
				},
				success: function(m){
					wrap.setAttribute('data-loaded', 'yes');
		
					FIP.loading.removeLoading(function(){
						FIP.asynInnerHTML(m, function(f){
							wrap.appendChild(f);
						}, function(){
							FIP.show(wrap);
							move(-1,callback);
						});
					});
				}
			});
		} else {
			if(clickbt.innerHTML=='继续游戏'){
				!global_para.gameover && yourTime.continueTime();
			}
			
			FIP.show(wrap);
			move(-1);
		}
	}, false);
};

function bindGoBack(elem_wrap,callback){
	elem_wrap.getElementsByClassName('back-bt')[0].addEventListener(global_para.eventName,function(){
		goBack(elem_wrap,callback);
	},false);
};

FIP.ready(function(){
	init();
	
	var $id=FIP.$id,

		game_info_wrapper = $id('game_info_wrapper');
		game_info=$id('game_info'),
		
		game_team_wrapper=$id('game_team_wrapper'),
		game_team=$id('game_team'),
		
		game_setting_wrapper=$id('game_setting_wrapper'),
		game_setting=$id('game_setting'),
		
		game_start_wrapper=$id('game_start_wrapper'),
		game_start=$id('game_start');
		
	//获取制作团队
	getContent(game_team,game_team_wrapper,'game_team_data.html',function(){
		bindGoBack(game_team_wrapper);
	});
	
	//获取游戏说明
	getContent(game_info,game_info_wrapper,'game_info_data.html',function(){
		bindGoBack(game_info_wrapper);
	});
	
	//获取游戏设置
	getContent(game_setting,game_setting_wrapper,'game_setting_data.html',function(){
		bindGoBack(game_setting_wrapper);
		
		FIP.loadScriptEx(['game-setting-7.js'],function(){
			FIP.loading.createLoading('Load JS...');
		},function(){
			FIP.loading.removeLoading();
		});
	});
	
	//获取游戏开始
	getContent(game_start,game_start_wrapper,'game_start_data.html',function(){		
		FIP.loadScriptEx(['game-start-7.js'],function(){
			FIP.loading.createLoading('Load JS...');
		},function(){
			bindGoBack(game_start_wrapper,function(){
				yourTime.stopTime();
			});
			
			FIP.loading.removeLoading(function(){
				game_start.innerHTML='继续游戏';
			});
		});
	});
});


