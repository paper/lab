
/**
  订阅和发布
  Publish/Subscribe
  
  //publish 
  //subscribe 
  //unsubscribe 
*/

function PubSub(){
  this.container = {};
}

// 发布
PubSub.prototype.publish = function(key, data){
  var subscribeList = this.container[key];
   
  if( !subscribeList ) return;
  
  for(var i = 0, len = subscribeList.length; i < len; i++){
    subscribeList[i](data);
  }
};

// 订阅
PubSub.prototype.subscribe = function(key, handle){
  this.container[key] =  this.container[key] ? this.container[key] : [];
  
  this.container[key]["push"]( handle );
};

// 移除订阅
PubSub.prototype.unsubscribe = function(key){
  if( this.container[key] ){
    delete this.container[key]
  }
};




























