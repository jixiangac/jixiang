/**
 * 订餐JS
 */
 //喜欢
 var like = jixiang.getByClass('like-gray');
 for(var i=0,len=like.length;i<len;i++){
    like[i].index=i;
    like[i].onclick = function(event){
      var e = event || window.event;
      e.preventDefault();
      var self = this;
      var href= self.getAttribute('href');
      var url=href.replace(/\/[\d]+/,'');
      var data={
        id : parseInt(href.split('/')[3],10)
      }
      var result = function(res){
         if(res.flg==1){
           self.className='like-red';
           var next=self.nextSibling;
           while(next.nodeType!==1){
             next=next.nextSibling;
           }
           next.innerHTML=(parseInt(next.innerHTML,10)+1);
           self.onclick=function(){return false;};
         }
      }
      ajax(url,'post',serializeData(data),result);
    }
 }
//我的订单
var orderlist =jixiang.$('orderlist');
if(!!orderlist){//获取订单
  // var callback = function(res){
  //    orderlist.innerHTML=res;
     var script = document.createElement('script');
     script.type='text/javascript';
     script.src='/js/orderlist.js';
     document.body.appendChild(script);
  // }
  // ajax('/meal/orderlist','get',null,callback);
}
//点击收菜，完成订单交易
var orderDone = jixiang.getByClass('orderdone');
if(!!orderDone){
  var handler = function(event){
    var e = event || window.event;
    var self = e.target || e.srcElement;
    if(!jixiang.hasClass(self,'orderdone'))return;
    if(!confirm('确定收菜吗？')){
       return false;
    }
    var mealid = parseInt(self.getAttribute('name'));
    var url = '/meal/order/done';
    var data = {
      mealid : mealid
    }
    var result = function(res){
      if(res.flg==1){
         var td = self.parentNode;
         td.innerHTML='<a class="common-btn grey-btn">已完成</a>';
      }
    }
    ajax(url,'post',serializeData(data),result);
  }
  var wrap =jixiang.$('pjax-container');
  Utils.addHandler(wrap,'click',handler);
}

/*------------
  --- TAB ---
 -----------*/
if(!!jixiang.$('tab')){
  var tab = jixiang.$('tab');
  var handler = function(event){
    var pself = this;
    var e = event || window.event;
    defaultEvent(e);
    var self = e.target || e.srcElement;
    while(self.tagName.toLowerCase() !== 'a'){
      self = self.parentNode;
    }
    if(jixiang.hasClass(self,'tab-title'))return;
    if(jixiang.hasClass(self,'pjax')){
       pjax(self,self.getAttribute('href'),'pjax-container');
    }
    for(var i=0,alis=pself.getElementsByTagName('a'),len=alis.length;i<len;i++){
       alis[i].className = 'pjax';
    }
    self.className = 'cur';
  }
  Utils.addHandler(tab,'click',handler)
}