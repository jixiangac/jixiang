/**
 * 订单清单事件
 */
var orderForm = jixiang.$('my-meal-order');
if(!!orderForm){//我的订单开始
//订单事件
var orderUl = orderForm.getElementsByTagName('ul')[0];
var liMouserOver = function(){//鼠标经过
     this.className='show';  
}
var liMouserOut = function(){//鼠标离开
    this.className='';  
}
var liClick =function(){//删除点击
  var self = this;
  if(confirm('确定删除吗？')){ 
     var url = '/meal/delete';
     var meals = this.name.split(';');
     var data = {
        mealid : parseInt(jixiang.$('mealId').value)
       ,meal_name : meals[0]
       ,meal_price : meals[1]
     };
       var result = function(res){
         if(res.flg==1){
           var list = self.parentNode;
           list.parentNode.removeChild(list);
           calculatePrice(meals[1],true);     
         }
       }
     ajax(url,'post',serializeData(data),result);
  } 
}
//计算价格,有flag表示减法
var calculatePrice = function(money,flag){
   var orderLi=orderUl.getElementsByTagName('li');
   var nowPrice = jixiang.getByClass('label-text',jixiang.$('order-all'))[0];
   var price=parseInt(nowPrice.innerHTML,10);
   if(!flag){
    price+=parseInt(money,10);    
   }else{
    price-=parseInt(money,10);
   }
   if(price==0){
     jixiang.$('order-all').style.display='none';
     jixiang.$('sub-meal').style.display='none';
   }
   nowPrice.innerHTML=price+'&nbsp;元';
}
var addMeal = function(){ //添加新订单
  var meals = this.name.split(';');
  //var url = !!orderUl.getElementsByTagName('li').length ? '/meal/add':'/meal/addnew';
  var url = '/meal/add';
  //AJAX提交
  var result = function(res){
    if(res.flg==1){
        var newMeal=document.createElement('li');
        newMeal.innerHTML='<span class="label">'
                           +meals[1]
                           +'</span>'
                           +'<span class="label">￥：</span>'
                           +'<span class="label-text">'
                           +meals[2]
                           +'&nbsp;元</span>';
        var btn = document.createElement('a');
            btn.className='meal-del-btn';
            btn.appendChild(document.createTextNode('删除'));
            btn.setAttribute('name',meals[1]+';'+meals[2]);
        newMeal.appendChild(btn);
        if(!orderUl.getElementsByTagName('li').length){
           jixiang.$('order-all').style.display='block';
           jixiang.$('sub-meal').style.display='block';
           if(!!jixiang.$('no-order')){
             jixiang.$('no-order').style.display='none';
            }
           jixiang.$('mealId').value=res.meal;
        }
        orderUl.appendChild(newMeal);
        calculatePrice(meals[2]);
        Utils.addHandler(newMeal,'mouseover',liMouserOver);
        Utils.addHandler(newMeal,'mouseout',liMouserOut);
        Utils.addHandler(btn,'click',liClick);

    }
  }
  var data = {
     mealid : parseInt(jixiang.$('mealId').value)
    ,meal_name : meals[1]
    ,meal_price : meals[2]
  }
  ajax(url,'post',serializeData(data),result);
}
//加入订单
var addOrder=jixiang.getByClass('meal-add-order');
if(!!addOrder){
  for(var i=0,len=addOrder.length;i<len;i++){
    addOrder[i].index=i;
    Utils.addHandler(addOrder[i],'click',addMeal);
  }
}
//订单删除
var orderLi = orderUl.getElementsByTagName('li');
for(var i=0,len=orderLi.length;i<len;i++){
   orderLi[i].index=i;
   Utils.addHandler(orderLi[i],'mouseover',liMouserOver);
   Utils.addHandler(orderLi[i],'mouseout',liMouserOut);
   Utils.addHandler(orderLi[i].getElementsByTagName('a')[0],'click',liClick);
}
//提交订单
var subOrder = function(){
  var self = this;
  var url = '/meal/suborder';
  var mealid = parseInt(jixiang.$('mealId').value,10);
  var data = {
    mealid : mealid
  }
  var result = function(res){
    if(res.flg==1){
      orderUl.innerHTML='';
      var tips = document.createElement('div');
      tips.className='action';
      tips.appendChild(document.createTextNode('订单已提交！'));
      orderForm.appendChild(tips);
      jixiang.$('mealId').value='0';
      jixiang.$('order-all').style.display='none';
      jixiang.$('sub-meal').style.display='none';
    }
  }
  ajax(url,'post',serializeData(data),result);
}
Utils.addHandler(jixiang.$('sub-meal-order'),'click',subOrder);
}//我的订单结束