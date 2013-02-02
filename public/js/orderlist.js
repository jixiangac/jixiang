/**
 * 订单清单事件
 */
var orderForm = jixiang.$('my-meal-order');
if(!!orderForm){//我的订单开始
//订单事件
var orderUl = orderForm.getElementsByTagName('ul')[0];
var orderLi = orderUl.getElementsByTagName('li');

var displayControl = function(flag){
  var mealControl=jixiang.getByClass('meal-control',orderForm);
  if(!flag){
    jixiang.$('no-order').style.display = 'none';
  }else{
    jixiang.$('no-order').style.display = 'block';
  }
  for(var i=0,len=mealControl.length;i<len;i++){
    if(!flag){
      mealControl[i].style.display = 'block';
    }else{
      mealControl[i].style.display = 'none';
      storage.removeItem('orders');
    }
  }
}

var createLi = function(meals){
  var newMeal='<li id="'+meals.id+'">';
  newMeal +='<span class="label name">'
           +meals.name
           +'</span>'
           +'<span class="label num">'
           +meals.num
           +'</span>'
           +'<span class="label price">'
           +meals.price
           +'&nbsp;元</span>';
  var btn = '<a name="'+meals.id+';'+meals.price+'" title="删除" class="meal-del-btn">X</a>';
  newMeal += btn;
  newMeal += '</li>';
  return newMeal;
}

//本地存储的订单信息
var storage = window.localStorage;
var orders = [];
if(storage.getItem('orders') !== null){
  displayControl();
  orders = JSON.parse(storage.getItem('orders'));
  var total = 0;
  var html = '';
  for(var i in orders){
    html += createLi(orders[i])
    total+= parseInt(orders[i].num,10)*parseInt(orders[i].price);
  }
  orderUl.innerHTML = html;
  jixiang.getByClass('label-text',jixiang.$('order-all'))[0].innerHTML = total+'&nbsp;元';
}
var liMouserOver = function(){//鼠标经过
     this.className='show';  
}
var liMouserOut = function(){//鼠标离开
    this.className='';  
}
var liClick =function(){//删除点击
  var self = this;
  if(confirm('确定删除吗？')){ 
     var meals = this.name.split(';');
     for(var i in orders){
       if(orders[i].id == parseInt(meals[0],10)){
          orders.splice(i,1);
          storage.setItem('orders',JSON.stringify(orders));
       }
     }
     var list = self.parentNode;
     var num = parseInt(jixiang.getByClass('num',list)[0].innerHTML,10);
     list.parentNode.removeChild(list);
     calculatePrice(meals[1]*num,true);     
  } 
}
//计算价格,有flag表示减法
var calculatePrice = function(money,flag){
   var nowPrice = jixiang.getByClass('label-text',jixiang.$('order-all'))[0];
   var price=parseInt(nowPrice.innerHTML,10);
   if(!flag){
    price+=parseInt(money,10);    
   }else{
    price-=parseInt(money,10);
   }
   if(price==0){
    displayControl(true);
   }else{
    displayControl();
   }
   nowPrice.innerHTML=price+'&nbsp;元';
}

//改变存储的份数
var changeNum = function(id,flag){//flag为true为减
  for(var i in orders){
    if(orders[i].id == parseInt(id,10)){
      if(!flag){
        orders[i].num = parseInt(orders[i].num,10)+1;
      }else{
        orders[i].num = parseInt(orders[i].num,10)-1;
      }
      storage.setItem('orders',JSON.stringify(orders));
    }
  }
}
//加入订单
var addMeal = function(){ 
  var meals = this.name.split(';');
  for(var i=0,len=orderLi.length;i<len;i++){//已存在就只加份数
     if(parseInt(orderLi[i].id,10) == parseInt(meals[0],10) ){
        var num=jixiang.getByClass('num',orderLi[i])[0];
        num.innerHTML = parseInt(num.innerHTML,10)+1;
        changeNum(meals[0]);//份数+1
        calculatePrice(meals[2]);
        return;
     }
  }
  //不存在新建立一条
  var newOrder = {
     id : meals[0]
    ,name : meals[1] 
    ,num : 1
    ,price : meals[2]
  }
  orders.push(newOrder);
  storage.setItem('orders',JSON.stringify(orders));

  var newMeal=document.createElement('li');
  newMeal.id = meals[0];
  newMeal.innerHTML='<span class="label name">'
                     +meals[1]
                     +'</span>'
                     +'<span class="label num">1</span>'
                     +'<span class="label price">'
                     +meals[2]
                     +'&nbsp;元</span>';
  var btn = document.createElement('a');
      btn.className='meal-del-btn';
      btn.appendChild(document.createTextNode('X'));
      btn.setAttribute('name',meals[0]+';'+meals[2]);
  newMeal.appendChild(btn);
  orderUl.appendChild(newMeal);

  calculatePrice(meals[2]);
  Utils.addHandler(newMeal,'mouseover',liMouserOver);
  Utils.addHandler(newMeal,'mouseout',liMouserOut);
  Utils.addHandler(btn,'click',liClick);
}
//加入订单按钮的绑定
var addOrder=jixiang.getByClass('meal-add-order');
if(!!addOrder){
  for(var i=0,len=addOrder.length;i<len;i++){
    addOrder[i].index=i;
    Utils.addHandler(addOrder[i],'click',addMeal);
  }
}
//订单删除按钮的绑定
for(var i=0,len=orderLi.length;i<len;i++){
   orderLi[i].index=i;
   Utils.addHandler(orderLi[i],'mouseover',liMouserOver);
   Utils.addHandler(orderLi[i],'mouseout',liMouserOut);
   Utils.addHandler(orderLi[i].getElementsByTagName('a')[0],'click',liClick);
}
//提交订单
var subOrder = function(){
  var self = this;
  var url = '/meal/add';
  var result = function(res){
    if(res.flg==1){
      orderUl.innerHTML='';
      var tips = document.createElement('div');
      tips.className='action';
      tips.appendChild(document.createTextNode('订单已提交！'));
      orderForm.appendChild(tips);
      displayControl(true);
    }
  }
  ajax(url,'post',serializeData({list:JSON.stringify(orders)}),result);
}
Utils.addHandler(jixiang.$('sub-meal-order'),'click',subOrder);
}//我的订单结束