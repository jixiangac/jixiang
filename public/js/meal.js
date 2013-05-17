/**
 * 订餐JS
 */
define(function(require,exports,module){
   var jixiang = require('./models/base');
   var popbox = require('./models/popbox');
   /**
    * 订餐选择
    * 
    * i标签 为数量
    * 
    */
   jixiang.addHandler(jixiang.$('meal-detail-list'),'click',function(event){
     var e = event || window.event;
     var target = e.target || e.srcElement;
     e.preventDefault();
     while(target.tagName.toLowerCase() !== 'a'){
        target = target.parentNode;
        if(target.tagName.toLowerCase() === 'body')return;
     }

     if( !jixiang.hasClass(target,'meal-selected') ){
        target.className += ' meal-selected';
     }else{
        var re = target.className.replace(/\s*meal-selected/,'');
        var i = target.getElementsByTagName('i');
        if(i.length)i[0].parentNode.removeChild(i[0]);
        target.className = re;
     }
   });
   /**
    * 生成订单
    * 
    */
   jixiang.addHandler(jixiang.$('meal-sub'),'click',function(){
     var self = this;
     this.disabled = true;
     var box = '<div class="mod-grey">'
                 +'<div class="mod-grey-hd"><h3>你的购买清单是：</h3></div>'
                 +'<div class="mod-grey-bd mod-grey-bd-pd20">';
     var meals = jixiang.getByClass('business-item');
     var len = meals.length;
     var i = 0;
     var orders = [];
     while(i < len){
       if( jixiang.hasClass(meals[i],'meal-selected') ){
          var text = meals[i].getElementsByTagName('span')[0].innerHTML;
          var num = meals[i].getElementsByTagName('i').length ? 
                        meals[i].getElementsByTagName('i')[0].innerHTML : 1;
          // orders[text] = num;
          var order = [text,num];
          orders.push(order);
          box += '<p>'+ text +'&nbsp;<span>数量：'+num+'</span></p>';
       }
       i++;
     }

     box += '<button id="order-ok" class="btn btn-info">确认选购</button><button id="cancel" class="btn">我再想想</button></div></div>'
     
     new popbox.init(box);
     /**
      * 确认选购
      */
     jixiang.addHandler(jixiang.$('order-ok'),'click',function(){
        var options = {
          url : window.location.href
         ,type : 'post'
         ,data : jixiang.serializeData({orders:JSON.stringify(orders)})
         ,callback : function(res){
            alert(res.msg)
         }
        }
        jixiang.ajax(options);
     });
     /**
      * 取消选购
      */
     jixiang.addHandler(jixiang.$('cancel'),'click',function(){
        var pop = jixiang.getByClass('popbox')[0];
        var overlay = jixiang.getByClass('overlay')[0];
        pop.parentNode.removeChild(pop);
        overlay.parentNode.removeChild(overlay);
        self.disabled = false;
     });
   });


   
})
//  //喜欢
//  var like = jixiang.getByClass('like-gray');
//  for(var i=0,len=like.length;i<len;i++){
//     like[i].index=i;
//     like[i].onclick = function(event){
//       var e = event || window.event;
//       e.preventDefault();
//       var self = this;
//       var href= self.getAttribute('href');
//       var url=href.replace(/\/[\d]+/,'');
//       var data={
//         id : parseInt(href.split('/')[3],10)
//       }
//       var result = function(res){
//          if(res.flg==1){
//            self.className='like-red';
//            var next=self.nextSibling;
//            while(next.nodeType!==1){
//              next=next.nextSibling;
//            }
//            next.innerHTML=(parseInt(next.innerHTML,10)+1);
//            self.onclick=function(){return false;};
//          }
//       }
//       ajax(url,'post',serializeData(data),result);
//     }
//  }
// //我的订单
// var orderlist =jixiang.$('orderlist');
// if(!!orderlist){//获取订单
//   // var callback = function(res){
//   //    orderlist.innerHTML=res;
//      var script = document.createElement('script');
//      script.type='text/javascript';
//      script.src='/js/orderlist.js';
//      document.body.appendChild(script);
//   // }
//   // ajax('/meal/orderlist','get',null,callback);
// }
// //点击收菜，完成订单交易
// var orderDone = jixiang.getByClass('orderdone');
// if(!!orderDone){
//   var handler = function(event){
//     var e = event || window.event;
//     var self = e.target || e.srcElement;
//     if(!jixiang.hasClass(self,'orderdone'))return;
//     if(!confirm('确定收菜吗？')){
//        return false;
//     }
//     var mealid = parseInt(self.getAttribute('name'));
//     var url = '/meal/order/done';
//     var data = {
//       mealid : mealid
//     }
//     var result = function(res){
//       if(res.flg==1){
//          var td = self.parentNode;
//          td.innerHTML='<a class="common-btn grey-btn">已完成</a>';
//       }
//     }
//     ajax(url,'post',serializeData(data),result);
//   }
//   var wrap =jixiang.$('pjax-container');
//   Utils.addHandler(wrap,'click',handler);
// }

// /*------------
//   --- TAB ---
//  -----------*/
// if(!!jixiang.$('tab')){
//   var tab = jixiang.$('tab');
//   var handler = function(event){
//     var pself = this;
//     var e = event || window.event;
//     defaultEvent(e);
//     var self = e.target || e.srcElement;
//     while(self.tagName.toLowerCase() !== 'a'){
//       self = self.parentNode;
//     }
//     if(jixiang.hasClass(self,'tab-title'))return;
//     if(jixiang.hasClass(self,'pjax')){
//        pjax(self,self.getAttribute('href'),'pjax-container');
//     }
//     for(var i=0,alis=pself.getElementsByTagName('a'),len=alis.length;i<len;i++){
//        alis[i].className = 'pjax';
//     }
//     self.className = 'cur';
//   }
//   Utils.addHandler(tab,'click',handler)
// }