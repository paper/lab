/*
 * @Author : paper
 * @Blog : paperagain.diandian.com
 * @Email: zhang.binjue@gmail.com
 */

/*========================================
 * 基本函数
 ========================================*/
function addClass(elem,classname){
	var old_classname=elem.className;
	
	if(old_classname.indexOf(classname)==-1){
		elem.className=old_classname+' '+classname;
	}
};

function removeClass(elem,classname){
	var old_classname=elem.className;
	
	if(old_classname.indexOf(classname)>=-1){	
		elem.className=old_classname.replace(classname,"");
	}
};

function each(elem,func){
	if(!elem.length){
		elem=[elem];
	}
	
	for(var i=0,len=elem.length;i<len;i++){
		func.call(elem[i],i);
	}
};

/*========================================
 * 手势的名称
 ========================================*/
var names_zh=["剪刀","石头","布"],
	names_en=["scissors","stone","cloth"],
	image_src="images/";

/*==== 一些节点 ====*/

var btns_value=document.getElementById("game_btns_value"),
	btns=document.querySelectorAll("#game_btns a"),
	differenceA_msg=document.getElementById("differenceA_msg"),
	play_btn=document.getElementById("play_btn"),
	get_infomation_btn=document.getElementById("get_infomation_btn"),
	
	differenceB=document.getElementById("differenceB"),
	differenceB_back=document.getElementById("differenceB_back"),
	differenceB_h1=document.getElementById("differenceB_h1"),
	differenceB_image=document.getElementById("differenceB_image"),
	differenceB_name_zh=document.getElementById("differenceB_name_zh"),
	
	differenceB_cover=document.getElementById("differenceB_cover"),
	differenceB_cover_btn=document.getElementById("differenceB_cover_btn"),
	
	differenceC=document.getElementById("differenceC"),
	differenceC_back=document.getElementById("differenceC_back");

/*========================================
 * 点击3个选项中的一个
 ========================================*/
function gameBtnsChoose(){
	function removeCurrentClass(){
		each(btns,function(){
			removeClass(this,'on');
		});
	};
	
	//init
	btns_value.value=-1;
	removeCurrentClass();
	
	each(btns,function(i){
		this.addEventListener(FIP.touchClick,function(){
			removeCurrentClass();
			
			addClass(this,'on');
			btns_value.value=i;
			
			removeClass(play_btn,"play-btn-disabled");
			FIP.hide(differenceA_msg);
		},false);
	});
};
gameBtnsChoose();

/*========================================
 * ok 按钮的点击
 ========================================*/
function okChoose(){
	var v,time;
	
	play_btn.addEventListener(FIP.touchClick,function(){
		clearTimeout(time);
		
		v=btns_value.value;
		
		if(v==-1){
			FIP.show(differenceA_msg);
			time=setTimeout(function(){
				FIP.fOut(differenceA_msg);
			},1500);
		}else{
			FIP.show(differenceB_cover);
			FIP.show(differenceB);
			move(-1,function(){
				differenceB_h1.innerHTML=names_en[v];
				differenceB_image.src=image_src+names_en[v]+'.jpg';
				differenceB_name_zh.innerHTML=names_zh[v];
			});
		}
	},false);
};
okChoose();

/*========================================
 * Click Me At the same time
 ========================================*/
differenceB_cover_btn.addEventListener(FIP.touchClick,function(){
	FIP.fOut(differenceB_cover);
},false);

/*========================================
 * differenceB_back
 ========================================*/
differenceB_back.addEventListener(FIP.touchClick,function(){
	move(1,function(){
		FIP.hide(differenceB);
	});
},false);

/*========================================
 * get_infomation
 ========================================*/
get_infomation_btn.addEventListener(FIP.touchClick,function(){
	FIP.show(differenceC);
	move(-1);
},false);

/*========================================
 * differenceC_back
 ========================================*/
differenceC_back.addEventListener(FIP.touchClick,function(){
	move(1,function(){
		FIP.hide(differenceC);
	});
},false);
	
