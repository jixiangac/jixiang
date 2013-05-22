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
   if(document.getElementById('meal-detail-list')){
     jixiang.addHandler(jixiang.$('meal-detail-list'),'click',function(event){
       var e = event || window.event;
       var target = e.target || e.srcElement;
    
       while(target.tagName.toLowerCase() !== 'a'){
          if(target.id === 'meal-detail-list')return;
          target = target.parentNode;
       }

       e.preventDefault();

       if( !jixiang.hasClass(target,'meal-selected') ){
          target.className += ' meal-selected';
       }else{
          var re = target.className.replace(/\s*meal-selected/,'');
          var i = target.getElementsByTagName('i');
          if(i.length)i[0].parentNode.removeChild(i[0]);
          target.className = re;
       }
     });
   }
   /**
    * 生成订单
    * 
    */
   if(document.getElementById('meal-sub')){
     jixiang.addHandler(jixiang.$('meal-sub'),'click',function(){
       var self = this;
       this.disabled = true;
       var box = '<div class="mod-grey">'
                   +'<div class="mod-grey-hd"><h3>你的购买清单是：</h3></div>'
                   +'<div class="mod-grey-bd mod-grey-bd-pd20">'
                      +'<table class="order">'
                         +'<thead><tr><th>名称</th><th>数量</th><th>单价</th></tr></thead>'
                         +'<tbody>';
       var meals = jixiang.getByClass('business-item');
       var len = meals.length;
       var i = 0;
       var orders = [];
       var total = 0;
       while(i < len){
         if( jixiang.hasClass(meals[i],'meal-selected') ){
            var name = meals[i].getElementsByTagName('span')[0].innerHTML;
            var num = meals[i].getElementsByTagName('i').length ? 
                          parseInt(meals[i].getElementsByTagName('i')[0].innerHTML,10) : 1;
            var price = meals[i].getElementsByTagName('em').length ?
                          parseInt(meals[i].getElementsByTagName('em')[0].innerHTML,10) : 0;
            total += price*num;
            var order = {
                name : name
              , num : num
              , price : price
            } 
            orders.push(order);
            box += '<tr><td>'+ name +'</td><td>'+ num +'</td><td>'+price*num+'&nbsp;元</td></tr>';
         }
         i++;
       }

       box += '<tr><td colspan="3">总价：'+total+'&nbsp;元</td></tr>'
              +'</tbody></table></div>'
              +'<div class="mod-grey-ft">'
               +'<button id="order-ok" class="btn btn-info ml10">确认选购</button>'
               +'<button id="cancel" class="btn ml10">我再想想</button>'
              +'</div>'
           +'</div>';
       
       new popbox.init(box);
       //确认选购
       jixiang.addHandler(jixiang.$('order-ok'),'click',function(){
          var options = {
            url : window.location.href
           ,type : 'post'
           ,data : jixiang.serializeData({orders:JSON.stringify(orders),total:total})
           ,callback : function(res){
              alert(res.msg)
           }
          }
          jixiang.ajax(options);
       });
       //消选购
       jixiang.addHandler(jixiang.$('cancel'),'click',function(){
          var pop = jixiang.getByClass('popbox')[0];
          var overlay = jixiang.getByClass('overlay')[0];
          pop.parentNode.removeChild(pop);
          overlay.parentNode.removeChild(overlay);
          self.disabled = false;
       });
     });    
   }
   if(typeof order !== 'undefined' && order.length){
       var box = '<div class="mod-grey">'
                   +'<div class="mod-grey-hd"><h3>你有 '+order.length+' 个正在配送的订单：</h3></div>'
                   +'<div class="mod-grey-bd mod-grey-bd-pd20">'
                      +'<table class="order">'
                         +'<thead><tr><th>名称</th><th>数量</th><th>单价</th></tr></thead>'
                         +'<tbody>';
       console.log(order)
       var len = order.length;
       var i = 0;
       while( i < len){
         var o = order[i].list;
         for(var key in o){
           box += '<tr><td>'+ o[key].name +'</td><td>'+o[key].num+'</td><td>'+o[key].price+'&nbsp;元</td></tr>';
         }
         box += '<tr><td colspan="3">总价：'+order[i].total+'&nbsp;元</td></tr>'
         i++;
       }
       box += '</tbody></table></div>'
              +'<div class="mod-grey-ft">'
               +'<button id="cancel" class="btn btn-info ml10">我知道了</button>'
              +'</div>'
           +'</div>';
       new popbox.init(box);
       //关闭
       jixiang.addHandler(jixiang.$('cancel'),'click',function(){
          var pop = jixiang.getByClass('popbox')[0];
          var overlay = jixiang.getByClass('overlay')[0];
          pop.parentNode.removeChild(pop);
          overlay.parentNode.removeChild(overlay);
       });
   }
   
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