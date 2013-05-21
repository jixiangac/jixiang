/**
 *  订餐 Routes
 */
var config = require('../config');
var jixiang = require('../models/base');
var utils = require('../models/utils');

//订餐首页
exports.index = function(req,res){
   var data = {};//要发送的数据
   if(req.method === 'GET'){
     var n = 1;
     //查看当前用户是否有订单
     jixiang.get({
       query : {
          user : req.session.user.username
         ,isDone : false
       }
     },'orders',function(err,doc){
        if(err)doc=[];
        data.order = JSON.stringify(doc);
        --n || render();
     });

     function render(){
      var renders = {
        title : config.name + '订餐'
       ,user : req.session.user
       ,cur : 'meal'
       ,data : data
       ,pjax : false
       ,jsflg : 'meal'          
      }
      res.render('./meal/index',renders)
     }
   }else if(req.method === 'POST'){

   }
     // var condition = {
     //  query: {
     //    handpick: '1'
     //  },
     //  sort: {
     //    _id: -1
     //  },
     //  limit: 4
     // }

     // jixiang.get(condition,'meals',function(err, meals) {
     //  if(err) {
     //    meals = [];
     //  }
     //  jixiang.count({sendstatus:false,donestatus:false},'orders',function(err,subLen){
     //    jixiang.count({sendstatus:true,donestatus:false},'orders',function(err,sendLen){
     //      res.render('./meal/index', {
     //        title: '订餐',
     //        user: req.session.user,
     //        meals: meals,
     //        subLen : subLen,
     //        sendLen : sendLen,
     //        cur: 'meal',
     //        cat: '',
     //        pjax : false,
     //        jsflg : 'meal'
     //      });
     //    })
     //  });
     // });
}
//商家菜单
exports.shop = function(req,res){
  if(req.method === 'GET'){
     render();
     function render(){
        var renders = {
          title : config.name + '订餐'
         ,user : req.session.user
         ,cur : 'meal'
         ,pjax : false
         ,jsflg : 'meal'
        }
        res.render('./meal/shop',renders);
     }
  }else if(req.method === 'POST'){
     var order = {
        user : req.session.user.username
       ,list : JSON.parse( req.body.orders )
       ,total : +req.body.total
       ,ordertime : new Date()*1
       ,isDone : false
       ,isSend : false
     }
     jixiang.save(order,'orders',function(err,doc){
        if(err)return res.json({success:false,msg:'出现了一点小问题，订购没有成功！'});
        return res.json({success:true,msg:'订购成功！'});
     });
  }
}

//菜品的喜欢按钮
exports.like = function(req,res){
  var condition = {};
  condition.query = {
    _id : parseInt(req.body.id,10)
  };
  condition.modify={
    '$push' : {
      'like' : req.session.user._id
    }
  };
  jixiang.update(condition,'meals',function(err){
    if(err){
      return res.json({flg:0,msg:err});
    }
    return res.json({flg:1,msg:'喜欢成功！'});
  });
}
//历史订单 1:已提交的订单
exports.subed = function(req,res){
   var pjax = !!req.query.pjax;
   var result = {};
   jixiang.get({
     query : {
        user : req.session.user.username
       ,isDone : false
       ,isSend : false
     }
    ,sort : {
      ordertime : -1
    }
   },'orders',function(err,doc){
     if(err)doc=[];
     if(doc.length){
       doc.forEach(function(item){
         item.ordertime = utils.format_date(new Date(item.ordertime),true);
         // item.list = JSON.parse(item.list);
       });
     }

     result.orders = doc;
     render();

   });
   function render(){
     var renders = {
       title :'等待配送的订单'
      ,user : req.session.user
      ,result : result
      ,cur : 'meal'
      ,orderCur : 'sub'
      ,pjax : pjax
      ,jsflg : 'meal'
     }
     res.render('./meal/order',renders);
   }
}
//历史订单 2:已经配送的订单
exports.sended = function(req,res){
   var pjax = !!req.query.pjax;
   var result = {};

   jixiang.get({
    query : {
      user : req.session.user.username
     ,isSend : true
     ,isDone : false
    }
    ,sort : {
      ordertime : -1
    }
   },'orders',function(err,doc){
     if(err)doc = [];

     if(doc.length){
       doc.forEach(function(item){
         item.ordertime = utils.format_date(new Date(item.ordertime),true);
       });
     }
     result.orders = doc;
     render();
   });

   function render(){
     var renders = {
       title :'已配送的订单'
      ,user : req.session.user
      ,result : result
      ,cur : 'meal'
      ,orderCur : 'send'
      ,pjax : pjax
      ,jsflg : 'meal'  
     }
     res.render('./meal/order',renders);
   }
}
//历史订单 3：已经完成的订单
exports.done = function(req,res){
   var pjax = !!req.query.pjax;
   var result = {};

   jixiang.get({
     query : {
       user : req.session.user.username
      ,isDone : true
     }
    ,sort : {
      ordertime : -1
    }
   },'orders',function(err,doc){
     if(err)doc = [];
     if(doc.length){
       doc.forEach(function(item){
         item.ordertime = utils.format_date(new Date(item.ordertime),true);
       });
     }
     result.orders = doc;
     render();
   });
   function render(){
     var renders = {
       title :'已完成的订单'
      ,user : req.session.user
      ,result : result
      ,cur : 'meal'
      ,orderCur : 'done'
      ,pjax : pjax
      ,jsflg : 'meal' 
     }
     res.render('./meal/order',renders);
   }
}
//确认收菜，交易完成
exports.doneconfirm = function(req,res){
   var id = parseInt(req.body.mealid);
   var condition={};
   condition.query = {
     _id : id
   }
   condition.modify = {
    '$set' : {
      donetime : Date.now()
     ,donestatus : true      
    }
   };
   jixiang.update(condition,'orders',function(err){
      if(err){
        return res.json({flg:0,msg:err});
      }
      return res.json({flg:1,msg:'交易完成！'});
   });
}

/*-------------
      admin
 -------------*/
var fs = require('fs');
//订单管理
exports.admin = function(req,res){
  var query = {};
  var cat = parseInt(req.query.cat,10) || 0;
  var result = {cur:cat};
  if(cat){
    switch(cat){
      case 1 :
        query.isSend = false;
        break;
      case 2 :
        query.isSend = true;
        break;
      case 3 :
        query.isDone = true;
    }
  }
  jixiang.get({
    query : query
   ,sort : {
     ordertime : -1
   }
  },'orders',function(err,orders){
    if(err){
      orders=[];
    }
    if(orders.length){
     orders.forEach(function(item){
       item.ordertime = utils.format_date(new Date(item.ordertime),true);
       // item.list = JSON.parse(item.orderlist);
     });
    }
    result.orders = orders;
    render();
  });
  
  function render(){
    var renders = {
       title : '订餐管理-订单管理'
      ,user : req.session.user
      ,result : result
      ,cur : 'meal'
    }
    res.render('./admin/meal/index',renders);
  }
}
//订单删除
exports.delOrderlist = function(req,res){
  var id = parseInt(req.body.id);
  jixiang.delById(id,'orders',function(err){
    if(err){
      return res.json({flg:0,msg:err});
    }
    return res.json({flg:1,msg:'删除成功！'});
  });
}
//订单的发单
exports.sendStatus = function(req,res){
  var id = parseInt(req.body.id);
  var condition = {};
  condition.query={
    _id : id
  };
  condition.modify={
    '$set' : {
      'sendstatus' : true
    }
  }
  jixiang.update(condition,'orders',function(err){
    if(err){
      return res.json({flg:0,msg:err});
    }
    return res.json({flg:1,msg:'发单成功！'});
  });
}
//菜品管理
exports.mealManager = function(req,res){
  jixiang.count({},'meals',function(err,count){
    if(err){
      return res.json({flg:0,msg:err});
    }

    var pages = isNaN(parseInt(req.params[0],10))? 1:parseInt(req.params[0],10);
    if(pages<=0){pages=1;}

    if(count > 0){
      var pageNum ={
         max : Math.ceil(count / 7)
        ,cur : pages
        ,next : pages+1
        ,prev : pages-1
      }
      if(pageNum.cur > pageNum.max){
        return;
      }
    }

    var condition = { 
       skip : (pages-1)*7
      ,limit : 7
    };

    jixiang.get(condition,'meals',function(err,meals){
      if(err){
        meals=[];
      }
      if(!!meals){
         meals.forEach(function(item){
           switch(item.cat){
             case '1':
               item.cat_name = '早餐';
               break;
             case '2':
               item.cat_name = '午餐';
               break;
             case '3' :
               item.cat_name ='下午茶';
               break;
             case '4' :
               item.cat_name ='晚餐';
               break;
             default :
               item.cat_name ='早餐';
           }
           switch(item.handpick){
             case '1':
               item.handpick = '是';
               break;
             default:
               item.handpick = '否';
           }
         });
      }

      res.render('./admin/meal/control',{
         title : '订餐管理-菜品管理'
        ,user : req.session.user
        ,meals : meals
        ,cur : 'meal'
        ,pages : pageNum
        ,pagenav : 'meal/control'
      });
    });
  });

}
//添加新菜品
exports.addMeal = function(req,res){
  if(req.method == 'GET'){
    res.render('./admin/meal/add',{
       title : '订餐管理-添加新菜品'
      ,user : req.session.user
      ,cur : 'meal'
    });    
  }else if(req.method == 'POST'){
    var pic = req.files.upload;
    var meal = {
       name : req.body.meal_name
      ,cat : req.body.meal_cat
      ,like : []
      ,supplier : req.body.meal_supplier
      ,price : req.body.meal_price
      ,description : req.body.meal_description
      ,pic : pic.name
      ,handpick : req.body.meal_handpick
    };
    var tempPath = pic.path;
    var targetPath='public/images/meal/'+pic.name;

    jixiang.save(meal,'meals',function(err){
      if(err){
        return res.json({flg:0,msg:err});
      }
      //存储图片
      fs.rename(tempPath,targetPath,function(err){
         if(err){
           res.json({flg:0,msg:err});
         }
      }); 
      res.redirect('/admin/meal/control');
     });    
  }
}
//删除菜品
exports.delMeal = function(req,res){
  jixiang.delById(parseInt(req.body.id,10),'meals',function(err){
    if(err){
      return res.json({flg:0,msg:err});       
    }
    return res.json({flg:1,msg:'删除成功！'});
 });
}
//修改菜品
exports.modifyMeal = function(req,res){
  if(req.method == 'GET'){
    var condition = {
      query :{
        _id: parseInt(req.params[0],10)
      }
      ,limit : 1
    }
    jixiang.get(condition,'meals',function(err,meals){
      if(err){
        meals=[];
      }
      res.render('./admin/meal/edit',{
         title : '菜品修改'
        ,user : req.session.user
        ,meals : meals[0]
        ,cur : 'meal'
      });
    });    
  }else if(req.method == 'POST'){
     var like =req.body.meal_like.split(',');
     var picUpload = !!req.files.upload.size;
     if(picUpload){
        var pic = req.files.upload;
        var tempPath = pic.path;
        var targetPath = 'public/images/meal/'+pic.name;
     }else{
        var pic ={
          name : req.body.originpic
        }
     }
     var meal = {
        id : parseInt(req.body.id,10)
       ,name : req.body.meal_name
       ,cat : req.body.meal_cat
       ,like : like
       ,supplier : req.body.meal_supplier
       ,price : req.body.meal_price
       ,pic : pic.name
       ,description : req.body.meal_description
       ,handpick : req.body.meal_handpick
     };

     var condition = {};
     condition.query = {
       _id : meal.id
     };
     condition.modify = meal;

     jixiang.update(condition,'meals',function(err){
       if(err){
        return res.json({flg:0,msg:err});
       }
       if(picUpload){
         fs.rename(tempPath,targetPath,function(err){
           if(err){
            return res.json({flg:0,msg:err});
           }
         });        
       }
       res.redirect('/admin/meal/control');
     });    
   }
}
/**
 * 订餐的商家管理
 */
exports.adminShop = function(req,res){
  var result = {};
  if(req.method === 'GET'){
    result.shoplist = [];
    render();

    function render(){
      var renders = {
        title : config.name + '商家管理'
       ,user : req.session.user
       ,jsflg: 'admin'
       ,result : result
       ,cur : 'meal'
      }
      res.render('./admin/meal/shop',renders);
    }

  }else if(req.method === 'POST'){

  }
}
exports.addShop = function(req,res){
  var result = {};
  if(req.method === 'GET'){
     render();
    function render(){
      var renders = {
        title : config.name + '添加商家'
       ,user : req.session.user
       ,jsflg: 'admin'
       ,result : result
       ,cur : 'meal'
      }
      res.render('./admin/meal/addshop',renders);
    }
  }else if(req.method === 'POST'){

  }
}
