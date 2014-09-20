/*
 * @Author: paper
 * @Blog: papaeragain.wordpress.com
 * @Gmail: zhang.binjue@gmail.com
 * 
 * 设置背景图片
 */

var setBgImage=(function(){
	var body=document.getElementById('body'),
		bg_images=document.getElementById('bg_images'),
		images=bg_images.getElementsByTagName('li'),
		dataImage;
	
	FIP.stopHandSelect(images);
	
	function imgLoad(src,doingCallback,endCallback){
		var img=new Image();
		doingCallback && doingCallback();
		
		if (img.complete) {
			endCallback && endCallback();
		}
		else {
			img.onload = function(){
				endCallback && endCallback();
			}
		}
		
		img.src=src;
	};
	
	for(var i=0,len=images.length;i<len;i++){
		images[i].addEventListener(global_para.eventName,function(){
			dataImage=this.getAttribute('data-image');
			sessionStorage.setItem('bgImage',dataImage);
			
			if(dataImage.indexOf('#')>-1){
				body.style.background=dataImage;
			}else{
				imgLoad(dataImage,function(){
					FIP.loading.createLoading('正在加载图片...');
				},function(){
					FIP.loading.removeLoading(function(){
						body.style.background='url('+dataImage+')';
					});
				});
			}
		},false);
	}
})();

