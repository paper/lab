/*
 * @Author: paper
 * @Date: 2011-6-14
 * @Blog: papaeragain.wordpress.com
 * @Gmail: zhang.binjue@gmail.com
 */

FIP.stopPageDrag();
//FIP.stopHandSelect("#sticksWrap");

/*==================================
 * 全局变量
 ==================================*/
var global_para={
	eventName:(FIP.isTouch ? 'touchstart' : 'click')
};

//创建很多棍子
function createSticks(obj){
	var wrapper=document.getElementById(obj.wrapperId),
		sticksWrap=document.getElementById(obj.sticksWrapId),
		resultNumber=document.getElementById(obj.resultId),
		resultNumber_i=0,
		
		restartBt=document.getElementById(obj.restartId),
		
		num=obj.num || 2,
		zIndex=0,
		i=0,
		
		width=524,height=10,//棍子的宽度，高度
		wrapWidth=320,wrapHeight=416,//容器的宽度，高度
		
		random=Math.random,
		sin=Math.sin,
		cos=Math.cos,
		max=Math.max,
		min=Math.min,
		PI=Math.PI,
		abs= Math.abs,
		sqrt=Math.sqrt,
		
		yourTime=new FIP.GetTime('time_min','time_sec'),
		
		stick,
		r=[]; // createOneStick tempDiv 的容器
		
	 //begin<= x < end , not include notNum
	function getRandom(begin,end,notNum){
		var n=parseInt( random()*(end-begin)+begin,10 );
		
		if(typeof notNum!=='undefined'){
			if(notNum==n){
				return getRandom(begin,end,notNum);
			}
		}
		
		return n;
	};
	
	//角度乘以0.017(2π/360)可以转变为弧度
	function degChange(deg){
		return deg*parseFloat(PI/180).toFixed(3);
	};
	
	//得到浮点，可以设置精度
	function getFloat(num){
		return parseFloat(num).toFixed(3);
	};
	
	//设置节点的样式
	function setStyle(elem,obj){
		for(var i in obj){
			elem.style[i]=obj[i];
		}
	};
	
	//判断一个点是否在容器里面
	//在里面就返回true，不在就返回false
	function isInWrap(x,y,w,h){
		var step=3, //模糊界限，因为刚好在界限边缘看不清，所以缩小点范围
			w=w-step || wrapWidth-step,
			h=h-step || wrapHeight-step;
		
		if(x<=0 || x>=w || y<=0 || y>=h) return false;
						
		return true;
	};//end isInWrap(x,y,w,h)
	
	//create one stick
	function createOneStick(){
		var tempDiv=document.createElement('div'),
			n=getRandom(1,6), 		 	// 1<= n < 6  (1~5)
			deg=getRandom(1,180,90),   // 0< deg <= 179 not 90
			left=getRandom(-212,8), 	// 50<left+(width/2)<270
			top=getRandom(45,361);  	// 50<top+(height/2)<366
		
		tempDiv.id='stick-'+i;
		tempDiv.style.zIndex=zIndex;
		//tempDiv.innerHTML='stick-'+i;
		tempDiv.className='line line-style'+n;
		tempDiv.setAttribute('data-deg',deg);
		
		setStyle(tempDiv,{
			left:left+'px',
			top:top+'px',
			width:width+'px',
			height:height+'px',
			transform:'rotate('+deg+'deg)',
			WebkitTransform:'rotate('+deg+'deg)',
			MozTransform:'rotate('+deg+'deg)'
		});

		r.push(tempDiv);
		
		return tempDiv;
	};// end createOneStick()
	
	//比较两个stick是否相交，并且在容器里面
	//相交返回true，否则返回false
	function compareStick(A,B){
		var Adeg=+A.getAttribute('data-deg'),
			Bdeg=+B.getAttribute('data-deg'),
			Awidth=width,
			Bwidth=width,
			Aheight=height,
			Bheight=height,
			Aleft=parseInt(A.style.left),
			Bleft=parseInt(B.style.left),
			Atop=parseInt(A.style.top),
			Btop=parseInt(B.style.top);	
		
		//A左右两边中间的坐标
		var AwidthHalf=Awidth/2,
			AheightHalf=Aheight/2,
			
			//左边
			ALx=Aleft,
			ALy=Atop+AheightHalf, 		
			
			//右边
			ARx=Aleft+Awidth,
			ARy=ALy; 				
		
		//旋转之后，A左右两边中间的坐标
		var cosAdeg=cos(degChange(Adeg)),sinAdeg=sin(degChange(Adeg)),
			ALxx=parseInt( ALx+AwidthHalf-AwidthHalf*cosAdeg,10 ),
			ALyy=parseInt( ALy-AwidthHalf*sinAdeg,10 ),
			
			ARxx=parseInt( ARx-AwidthHalf+AwidthHalf*cosAdeg,10 ),
			ARyy=parseInt( ARy+AwidthHalf*sinAdeg,10 );
		
		if(A.getAttribute('data-coord')===null){
			A.setAttribute('data-coord',ALxx+','+ALyy+','+ARxx+','+ARyy);
		}
		
		
		//旋转之后，A四个角的坐标
		var ALTx=parseInt( ALxx+AheightHalf*sinAdeg,10 ),
			ALTy=parseInt( ALyy-AheightHalf*cosAdeg,10 ),
			
			ALBx=parseInt( ALxx-AheightHalf*sinAdeg,10 ),
			ALBy=parseInt( ALyy+AheightHalf*cosAdeg,10 ),
			
			ARTx=parseInt( ARxx+AheightHalf*sinAdeg,10 ),
			ARTy=parseInt( ARyy-AheightHalf*cosAdeg,10 ),
			
			ARBx=parseInt( ARxx-AheightHalf*sinAdeg,10 ),
			ARBy=parseInt( ARyy+AheightHalf*cosAdeg,10 );
			
		
		//B左右两边中间的坐标
		var BwidthHalf=Bwidth/2,
			BheightHalf=Bheight/2,
			
			//左边
			BLx=Bleft,
			BLy=Btop+BheightHalf, 		
			
			//右边
			BRx=Bleft+Bwidth,
			BRy=BLy;
		
		//旋转之后，B左右两边中间的坐标
		var cosBdeg=cos(degChange(Bdeg)),sinBdeg=sin(degChange(Bdeg)),
			BLxx=parseInt( BLx+BwidthHalf-BwidthHalf*cosBdeg,10 ),
			BLyy=parseInt( BLy-BwidthHalf*sinBdeg,10 ),
			
			BRxx=parseInt( BRx-BwidthHalf+BwidthHalf*cosBdeg,10 ),
			BRyy=parseInt( BRy+BwidthHalf*sinBdeg,10 );
			
		if (B.getAttribute('data-coord') === null) {
			B.setAttribute('data-coord', BLxx + ',' + BLyy + ',' + BRxx + ',' + BRyy);
		}
		
		//旋转之后，B四个角的坐标
		var BLTx=parseInt( BLxx+BheightHalf*sinBdeg,10 ),
			BLTy=parseInt( BLyy-BheightHalf*cosBdeg,10 ),
			
			BLBx=parseInt( BLxx-BheightHalf*sinBdeg,10 ),
			BLBy=parseInt( BLyy+BheightHalf*cosBdeg,10 ),
			
			BRTx=parseInt( BRxx+BheightHalf*sinBdeg,10 ),
			BRTy=parseInt( BRyy-BheightHalf*cosBdeg,10 ),
			
			BRBx=parseInt( BRxx-BheightHalf*sinBdeg,10 ),
			BRBy=parseInt( BRyy+BheightHalf*cosBdeg,10 );
		
		return isLineCross(ALTx,ALTy,ARTx,ARTy,BLTx,BLTy,BRTx,BRTy) || isLineCross(ALBx,ALBy,ARBx,ARBy,BLBx,BLBy,BRBx,BRBy)
			|| isLineCross(ALTx,ALTy,ARTx,ARTy,BLBx,BLBy,BRBx,BRBy) || isLineCross(ALBx,ALBy,ARBx,ARBy,BLTx,BLTy,BRTx,BRTy);
		
	};//end compareStick(A,B)
	
	//给出两条线段它们两边的坐标，判断它们是否相交，
	//相交就返回相交的那个点的坐标，不相交就返回false
	function isLineCross(Ax1,Ay1,Ax2,Ay2,Bx1,By1,Bx2,By2){
		var AK=getFloat((Ay2-Ay1)/(Ax2-Ax1)),
			BK=getFloat((By2-By1)/(Bx2-Bx1));
		
		//平行
		if(AK==BK) return false;
		
		//相交的点坐标
		var x=getFloat((By1-Bx1*BK+Ax1*AK-Ay1)/(AK-BK)),
			y=getFloat(By1+BK*(x-Bx1)),
		
			//判断x，y是不是在一条线段上
			//假设在A线段上
			AxMax=max(Ax1,Ax2),
			AxMin=min(Ax1,Ax2);
		
		var step=3;//模糊边界，因为眼睛不见得看得那么清楚
		//相交点不在线段上，或者它不在容器里面
		if(x>AxMax-step || x<AxMin+step || !isInWrap(x,y)) return false;
		
		return {
			x:x,
			y:y
		}
	
	};//end isLineCross(Ax1,Ay1,Ax2,Ay2,Bx1,By1,Bx2,By2)
	
	//创建一个小圆圈,并且显示位置，而且一段时间后消失
	//去掉当前的stick，去掉其他棍子带有elem的id的data-up属性
	var createClickRange=(function(){
		var time;
		
		//clickRange 的碰撞函数
		//如果碰到了，就消失棍子，并返回true
		//如果没有一根能够消失（你点错了），就返回false。
		function checkClickRange(cr){
			var sticks=sticksWrap.getElementsByTagName('div'),
				len=sticks.length,
				i=0;
			
			for(;i<len;i++){
				//只有可以去掉的棍子，才有判断是否碰撞的意义
				if(sticks[i].getAttribute('data-up')===null){
					if(checkClickRangeDetail(cr,sticks[i])){
						return true;
					}
				}
			}
			
			return false;
		};//end checkClickRange(cr)
		
		//判断cr和stick是否碰撞，
		//碰撞就消失，并返回true
		//否则返回false
		function checkClickRangeDetail(cr,stick){
			var R=15; //cr的半径(本来是17，我为了提高精度，改为15)
			var X=parseInt(cr.style.left)+17; //cr的中心点的坐标
			var Y=parseInt(cr.style.top)+17;
			
			var MAXRANG=20; // R+height/2
			
			//接下来就是要求点到直线的距离了。
			//直线取棍子的中线，所以在之前运算的时候，预先保存了起来，放在data-coord里面
			var coord=stick.getAttribute('data-coord').split(',');
			var x1=+coord[0],
				y1=+coord[1],
				x2=+coord[2],
				y2=+coord[3];
			
			var x,y; 	//圆点到直线的垂直线的相交的那个点。
			var L;		//圆点到直线的垂直线的距离
			
			//首先把直线转化成Ax+By+C=0;求出A,B，C的值，这样方便利用公式
			var A=y2-y1,
				B=x1-x2,
				C=y1*x2-x1*y2;
			
			L=getFloat( abs(A*X+B*Y+C)/sqrt(A*A+B*B) );
			x=getFloat( (B/A*X-Y-C/B)/(B/A+A/B) );
			//y=getFloat( (A/B)*(Y+C/B-X*B/A)/(B/A+A/B)-C/B );

            if (L < MAXRANG) {
                var xMax = max(x1, x2), xMin = min(x1, x2);
                
                if (x > xMax || x < xMin) return false;
                
				//消失它
                removeDataUp(stick);
                
                return true;
                
            } else { return false; }
		};
		
		//去掉当前的stick
		//去掉其他棍子带有elem的id的data-up属性
		function removeDataUp(stick){
			var sticks = sticksWrap.getElementsByTagName('div'),
				 tempStick,
				 dataUp,
				 idName=stick.id,
				 reg = new RegExp(idName),
				 idNum = +idName.match(/\d+$/)[0],
				 i=0,
				 len=sticks.length;

			for (; i < len; i++) {
				tempStick = sticks[i];
				
				//替换那些zindex比自己小的，而且带有我的idname的节点的data-up数据
				//id里面的数字和zindex是相同的
				if (tempStick.getAttribute('data-up') !== null && (+tempStick.style.zIndex < idNum)) {
					dataUp = tempStick.getAttribute('data-up').replace(reg, '');
					
					dataUp.indexOf('stick') > -1 ? tempStick.setAttribute('data-up', dataUp):tempStick.removeAttribute('data-up');
				}
			}
			
			sticksWrap.removeChild(stick);
		};
		
		return function(ev){
			clearTimeout(time);
			
			var cr = document.getElementById('clickRange');
			
			if (!cr) {
				cr = document.createElement('span');
				cr.id = "clickRange";
				cr.className = "clickRange";
				cr.style.display = "none";
				sticksWrap.appendChild(cr);
			}
			
			var mouseX, 
				mouseY,
				sticksWrapX = sticksWrap.offsetLeft, 
				sticksWrapY = sticksWrap.offsetTop;
			
			if(FIP.isTouch){
				mouseX=ev.targetTouches[0].pageX;
				mouseY=ev.targetTouches[0].pageY;
			}else{
				mouseX=ev.pageX;
				mouseY=ev.pageY;
			}
			
			cr.style.left = mouseX - sticksWrapX - 17 + 'px';
			cr.style.top = mouseY - sticksWrapY - 17 + 'px';
			cr.style.display = "block";
			
			time = setTimeout(function(){
				cr.style.display = 'none';
			}, 1000);
			
			//判断如何使得棍子消失
			//消失了，成绩+1；错误了，成绩-1
			if(checkClickRange(cr)){
				num--;
				resultNumber.innerHTML=++resultNumber_i;
			}else{
				resultNumber.innerHTML=--resultNumber_i;
			}
			
			//判断游戏是否成功
			gameSuccess();
		}
		
	})();//end createClickRange
	
	//wrapper的触发函数
	function wrapperEvent(e){
		createClickRange(e);
	};
	
	//游戏成功后做什么
	function gameSuccess(){
		//首先判断是否成功
		if(num==0){
			gamePause();
			
			sticksWrap.innerHTML='<p style="line-height:416px;text-align:center;">恭喜你完成了！</p>'
		}
	};
	
	//游戏暂停
	function gamePause(){
		yourTime.stopTime();
		wrapper.removeEventListener(global_para.eventName,wrapperEvent,false);
	};
	
	//游戏继续
	function gameContinue(){
		yourTime.continueTime();
		wrapper.addEventListener(global_para.eventName,wrapperEvent,false);
	};
	
	//全部还原
	//游戏加载
	function gameLoading(){
		FIP.loading.createLoading();
		restartBt.disabled="disabled";
		
		wrapper.removeEventListener(global_para.eventName,wrapperEvent,false);
		i=0;
		zIndex=0;
		num=obj.num;
		
		yourTime.stopTime();
		
		//内容清空
		sticksWrap.innerHTML='';
		
		//成绩归0
		resultNumber.innerHTML=0;
		resultNumber_i=0;
	};
	
	function gameStart(){
		restartBt.disabled = "";
		yourTime.resetTime();
						
		//绑定sticksWrap，触发移除棍子的事件
		wrapper.addEventListener(global_para.eventName,wrapperEvent, false);
	};
	
	return {
		create: function(){
			gameLoading();
			
			(function(){
				if (i < num) {
					stick = createOneStick();

					if (i != 0) {
						for (var j = 0, len = r.length - 1; j < len; j++) {
							//如果相交，并且在容器里面
							if (compareStick(r[j], stick)) {
								r[j].setAttribute('data-up', r[j].getAttribute('data-up') + "," + stick.id);
							}
						}
					}
					
					sticksWrap.appendChild(stick);
					zIndex = ++i;
					
					setTimeout(arguments.callee, 10);
				} else {
					FIP.loading.removeLoading(function(){
						gameStart();
					}, false);
				}
			})()
		}
	}
	
};//end createSticks(obj)


