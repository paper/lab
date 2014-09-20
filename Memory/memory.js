/*
 * @Author : paper
 * @Blog : paperagain.wordpress.com
 * @Email: zhang.binjue@gmail.com
 * 
 * 简单的记忆游戏 :)
 */

(function(window,undefined){

  
	var Memory=window.Memory=function(canvasId){
			var canvas=document.getElementById(canvasId);
			
			this.canvas=canvas;
			this.canvasWidth=canvas.width;
			this.canvasHeight=canvas.height;
			this.context2d = canvas.getContext("2d");
		},
	
		imagesName=['Add.png','Android.png','Book.png','Calendar.png','Find.png',
			'Folder.png','Led.png','Messages.png','Misc.png','Notepad.png'],
		
		imagesNameLength=imagesName.length,
		
		imagesSrc="./images/",
		
		Math_floor=Math.floor,
		Math_random=Math.random,
	
		eventClick=FIP.isTouch ? 'touchstart' : 'click',
	
	 	time=new FIP.GetTime("gameTimeMin","gameTimeSec"),
	
	 	showMsg=$Id("showMsg"),
		lastMissionBt=$Id("lastMissionBt"),
		gameHelp=$Id("gameHelp"),
	 	yourTime=$Id("yourTime"),
		stopClick=$Id("stopClick"),
	 	restart=$Id("restart"),
		gameTime=$Id("gameTime"),
	
		//初始化，记录每个box左上角的坐标x，y，宽度(w)，高度(h)
		boxes = [],
		//初始化，生成的图片对象，加载一次就不加载了，通过imagesObjectKey判断
		imagesObject=[],
		//一开始没有加载
	 	imagesObjectKey=false,
		//图片的下标集合
		imagesObjectIndex,
			
		//存起移除掉box的下标，这样下次就不能再点击
		remove_cache=[],
	
		//画布的点击函数，点击restart的时候，就不必重复加载了。
	 	canvas_click;
	
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(s){
			for (var i = 0, len = this.length; i < len; i++) {
				if (s === this[i]) return i;
			}
			
			return -1;
		};
	}
	
	function $Id(idName){
		return typeof idName==="string" ? document.getElementById(idName) : idName;
	};
	
	function show(elem){
		$Id(elem).style.display="block";
	};
	
	function hide(elem){
		$Id(elem).style.display="none";
	};
	
	function isFunction(func){
		return typeof func==="function";
	};
	
	//允许canvas点击
	function stopClick(){
		stopClick.style.display="block";
	};
	//不允许canvas点击
	function allowClick(){
		stopClick.style.display="none";
	};
	
	//不允许Restart点击
	function stopRestart(){
		restart.setAttribute("disabled","disabled");
	};
	//允许Restart点击
	function allowRestart(){
		restart.removeAttribute("disabled");
	};
	
	//显示成绩
	function showResult( isLastMission ){
		hide(gameHelp);
		time.stopTime();
    
    var t = gameTime.textContent;
    
		yourTime.innerHTML = t;
		show(showMsg);
    
    
    if( isLastMission ){
      //chang title
      var titleMsg = "我竟然只使用了" + t + "就完成了！太厉害了吧！";
      document.title = titleMsg;
    }
    
	};
	
	//得到鼠标(或手指)在canvas点击时的坐标
	//canvas 必须设置position为relative 或 absulote (for Firefox)
	//通过条件判断，函数内部从新改写主函数，这是提高性能的一个技巧，这样以后运行时不必每次都进行条件判断！
    function getMouse(e){
        if (FIP.isTouch) {
			getMouse = function(e){
				return {
					x: e.targetTouches[0].pageX,
					y: e.targetTouches[0].pageY
				}
			};
		}
		else {
			getMouse = function(e){
				if (e.offsetX) { return {
					x: e.offsetX,
					y: e.offsetY
				}} 
				else if (e.layerX) { return {
					x: e.layerX,
					y: e.layerY
				}}
			};
		}
		
		return getMouse(e);
	};
	
	//得到0 ~ max-1 里面的随机数
	function getRandomNumber(max){
		return Math_floor(Math_random()*max);
	};
	
	//得到指定个数的图片对象数组
	//假如数组的长度是4，说明里面有2个图片对象，而且随机分布在数组中
	//@param num 肯定是偶数
	function getImagesIndex(num){
		var n = num / 2;
		
		//从0,1,2,3,...,imagesNameLength 里面 取n个随机不相同的数字
		//返回这些数字集合(array)
		function getRandomArray(n){
			var r = [],
				t;
			
			while (r.length<n) {
				t = getRandomNumber(imagesNameLength);
				
				if (r.indexOf(t) == -1) {
					r.push(t);
				}
			}
			
			return r;
		};
		
		//把传进来的r里面的数据，打乱
		function makeArrayDisorder(r){
			var len = r.length;
			if (len == 0) return;
			if (len == 1) return r;
			
			var result = r.concat(),
				t1, t2,
				temp;
			
			for (var i = 0; i < len; i++) {
				t1 = getRandomNumber(len);
				t2 = getRandomNumber(len);
				
				//随机的交换数据
				if(t1!=t2){
					temp = result[t2];
					result[t2] = result[t1];
					result[t1] = temp;
				}
			}
			
			return result;
		};
		
		//根据数组里面r的值，然后随机生成双倍的数据，而且每个r里面的元素都有两个。
		function getRandomArrayDouble(r){
			//先加倍，再打乱
			return makeArrayDisorder(r.concat(r));
		};
		
		//得到图片的随机下标
		return getRandomArrayDouble(getRandomArray(n));
		
	};//end getImagesIndex
	
	//画矩形
	function drawBox(ctx2d,x,y,w,h,fillstyle){
		fillstyle=fillstyle || "#333043";
		
		ctx2d.fillStyle = fillstyle;
		ctx2d.fillRect(x, y, w, h);
	};
	
  Memory.prototype.isLastMission = false;
  
	//画游戏界面
	//row 行数;row_len 每行的个数;w,h box 的宽度，高度;dx 间距
	Memory.prototype.drawGameInterface = function(row,row_len,w,h,dx){		
		//先初始化
		this.init();
		
		var i, j;
		
		//生成游戏界面
		for (i = 0; i < row; i++) {
			for (j = 0; j < row_len; j++) {
				drawBox(this.context2d, j * (w + dx) + dx, i * (h + dx) + dx , w , h);
				boxes.push([j * (w + dx) + dx, i * (h + dx) + dx, w, h]);
			}
		}
		
		//游戏可以开始玩了
		this.play(row,row_len);
	};
	
	//相同的话。去除相同的图片
	Memory.prototype.removeBox_sameImage = function(ctx2d,box1,box2,callback){

		setTimeout(function(){
			ctx2d.clearRect(box1[0],box1[1], box1[2], box1[3]);
			ctx2d.clearRect(box2[0],box2[1], box2[2], box2[3]);
			
			isFunction(callback) && callback();
		}, 300);
	};
	
	//不同的话，就填充回原来的色块
	Memory.prototype.goBack_differentImage = function(ctx2d,box1, box2, callback){
		
		setTimeout(function(){
			drawBox(ctx2d, box1[0], box1[1], box1[2], box1[3]);
			drawBox(ctx2d, box2[0], box2[1], box2[2], box2[3]);
			
			isFunction(callback) && callback();
		}, 300);
	};
	
	//游戏操作
	Memory.prototype.play = function(row,row_len){
		var that=this;

		//图片识别的缓存
		var cache=null;
		
		//存储点击盒子的坐标
		var box_cache=[];
		
		//得到图片下标的随机集合
		imagesObjectIndex=getImagesIndex(row*row_len);
		
		if (!canvas_click) {
			canvas_click=function(e){
				var ctx2d = that.context2d,

					mouse = getMouse(e),
					mx = mouse.x,
				 	my = mouse.y;
				
				//判断mx和my的值，知道是哪一个块被点击到
				for (var i = 0,boxes_len=boxes.length; i < boxes_len; i++) {
				
					var box = boxes[i],
						imagesObjectIndexI = imagesObjectIndex[i];
					
					if (mx > box[0] && mx < (box[0] + box[2]) && my > box[1] && my < (box[1] + box[3])) {
					
						//那个i位置的色块已经移除了
						if (remove_cache.indexOf(i) !== -1) return;
						
						//先压进去，如果不同的话，会弹出来的。
						remove_cache.push(i);
						
						//移除方块
						ctx2d.clearRect(box[0], box[1], box[2], box[3]);
						//贴上图片
						ctx2d.drawImage(imagesObject[imagesObjectIndexI], box[0], box[1], box[2], box[3]);
						
						//需要比较的两个方块对象
						if (box_cache.length == 2) {
							box_cache = [];
						}
						box_cache.push(box);
						
						//判断图片是否一样。
						//如果不一样就，0.3秒后，又填充块色。相同就去除。
						if (cache === null) {
							cache = imagesObjectIndexI;
						}
						else {
							//图片相同
							if (cache == imagesObjectIndexI) {
								that.removeBox_sameImage(ctx2d,box_cache[0],box_cache[1],function(){
									that.gameOver();
								});
							}
							//图片不同
							else {
								//原先压进去的两个方块，立马释放
								remove_cache.splice(-2);
								
								that.goBack_differentImage(ctx2d,box_cache[0],box_cache[1]);
							}
							
							cache = null;
						}
						
						return;
					}
				}//for
			};//end canvas_click
		}
	
		//先取消绑定，以防每次点击restart重复绑定canvas_click事件
		this.canvas.removeEventListener(eventClick,canvas_click,false);
		this.canvas.addEventListener(eventClick,canvas_click,false);
	};//end play
	
	//游戏初始化
	Memory.prototype.init=function(){
		//先清空画布
		this.clearCanvas();
	
		//重置计时	
		time.resetTime();
		
		//重置boxes容器，因为换了mission，box的个数是变的。
		boxes=[];
		
		//存储 移除过的方块 容器
		remove_cache=[];
		
		//禁止restart按钮
		stopRestart();
		
		//隐藏成绩
		hide("showMsg");
	};
		
	//判断游戏是否结束
	Memory.prototype.gameOver=function(){
		if(remove_cache.length == boxes.length){
			showResult(this.isLastMission);
		}
	};
	
	//初始化，先加载图片，免得点击的时候有延迟 
	Memory.prototype.loadImages=function(callback){
		//如果第一次加载了图片，以后就不加载了。
		if (!imagesObjectKey) {
			
			function loadOneImage(src, callback){
				var image = new Image();
				image.onload = function(){
					isFunction(callback) && callback(image);
				};
				
				image.src = src;
			};
			
			var loadAllImage=(function(){
				var i=0;
				
				function load(callback){
					loadOneImage(imagesSrc + imagesName[i], function(imgObject){

						imagesObject.push(imgObject);

						if (++i < imagesNameLength) {
							return load(callback);
						}
						else {
							imagesObjectKey = true;
							
							isFunction(callback) && callback();

							return;
						}
					});
				}
				
				return load;
			})();
			
			loadAllImage(callback);
		}else{
			isFunction(callback) && callback();
		}
	};
	
	Memory.prototype.clearCanvas=function(){
		this.context2d.clearRect(0,0,this.canvasWidth,this.canvasHeight);
	};
	
	Memory.prototype.gameContinue=function(){
		time.continueTime();
	};
	
	Memory.prototype.gamePause=function(){
		time.stopTime();
	};
	
	//画第1关的游戏界面
	Memory.prototype.mission1=function(callback){
		var that=this;
		
		FIP.loading.createLoading('Loading...');
		
		this.loadImages(function(){
			FIP.loading.removeLoading(function(){
				that.drawGameInterface(2,2,60,60,16);
				
				isFunction(callback) && callback();
			});
		});
	};
	
	//画第2关的游戏界面
	Memory.prototype.mission2=function(callback){
		var that=this;
		
		FIP.loading.createLoading('Loading...');
		
		this.loadImages(function(){
			FIP.loading.removeLoading(function(){
				that.drawGameInterface(5,4,60,60,16);
				
				allowRestart();
				
				lastMissionBt.innerHTML="再来一次?";

				isFunction(callback) && callback();
			});
		});
	};
	
})(window,undefined);


