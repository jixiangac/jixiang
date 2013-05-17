/**
 *  订餐 Routes
 */
var config = require('../config');
var jixiang = require('../models/base');
var utils = require('../models/utils');

//订餐首页
var index = function(req,res){
     var condition = {
      query: {
        handpick: '1'
      },
      sort: {
        _id: -1
      },
      limit: 4
     }

     jixiang.get(condition,'meals',function(err, meals) {
      if(err) {
        meals = [];
      }
      jixiang.count({sendstatus:false,donestatus:false},'orders',function(err,subLen){
        jixiang.count({sendstatus:true,donestatus:false},'orders',function(err,sendLen){
          res.render('./meal/index', {
            title: '订餐',
            user: req.session.user,
            meals: meals,
            subLen : subLen,
            sendLen : sendLen,
            cur: 'meal',
            cat: '',
            pjax : false,
            jsflg : 'meal'
          });
        })
      });
     });
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

  }
}
//菜品详情
// var detail = function(req,res){
//     var condition = {};
//     condition.query = {
//       _id: parseInt(req.params[0], 10)
//     };
//     jixiang.getOne(condition,'meals',function(err, meal) {
//        switch(meal.cat){
//          case '1':
//            meal.cat_name = '早餐';
//            break;
//          case '2':
//            meal.cat_name = '午餐';
//            break;
//          case '3' :
//            meal.cat_name ='下午茶';
//            break;
//          case '4' :
//            meal.cat_name ='晚餐';
//            break;
//          default :
//            meal.cat_name ='早餐';
//        }
//       jixiang.count({sendstatus:false,donestatus:false},'orders',function(err,subLen){
//         jixiang.count({sendstatus:true,donestatus:false},'orders',function(err,sendLen){
//           res.render('./meal/detail', {
//             title: meal.name + '的详情',
//             user: req.session.user,
//             meals: meal,
//             subLen : subLen,
//             sendLen : sendLen,
//             cur: 'meal',
//             cat:'',
//             pjax : false
//           });
//         })
//       })

//     });
// }

// //菜品分类
// var category = function(req,res){
//      var condition={};
//      var cat_title;
//      if(req.params[0]){
//        condition.query={
//          cat : req.params[0]
//        };
//      }else{
//        condition.sort={
//          like : -1
//        };
//        condition.limit=12;
//      }
//      switch(req.params[0]){
//         case '1':
//           cat_title="早餐";
//           break;
//         case '2':
//           cat_title="午餐";
//           break;
//         case '3':
//           cat_title="下午茶";
//           break;
//         case '4':
//           cat_title="晚餐";
//           break;
//         default:
//           cat_title="热门";
//      }
//      jixiang.get(condition,'meals',function(err,meals){
//       if(err){
//         meals=[];
//       }
//       jixiang.count({sendstatus:false,donestatus:false},'orders',function(err,subLen){
//         jixiang.count({sendstatus:true,donestatus:false},'orders',function(err,sendLen){
//          res.render('./meal/category',{
//              title : '菜品分类'
//             ,user : req.session.user
//             ,cat : cat_title
//             ,meals : meals
//             ,subLen : subLen
//             ,sendLen : sendLen
//             ,cur : 'meal'
//             ,pjax : false
//          });
//        });
//       });

//      });
// }
//增加新订单
var newlist = function(req,res){

   var order = {
      uid : req.session.user._id
     ,username : req.session.user.username
     ,subtime : Date.now()
     ,donetime : 0
     ,donestatus : false
     ,sendstatus : false
     ,orderlist :req.body.list
   };

   jixiang.save(order,'orders',function(err,doc){
     if(err){
       return res.json({flg:0,msg:err});
     }
     return res.json({flg:1,msg:'加入成功！'});
   }); 

}
//菜品的喜欢按钮
var like = function(req,res){
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
var subed = function(req,res){
   var pjax = false;
   if(!!req.query.pjax){
     pjax = true;
   }
   var uid = parseInt(req.session.user._id,10);
   var condition={};
   condition.query={
      uid : uid
     ,sendstatus : false
   };
   condition.sort={
     subtime:-1
   };
   jixiang.get(condition,'orders',function(err,orders){
     if(err){
       orders=[];
     }
     if(!!orders.length){
       orders.forEach(function(item){
         item.subtime = utils.format_date(new Date(item.subtime),true);
         item.orderlist = JSON.parse(item.orderlist);
       });
     }
     res.render('./meal/order',{
       title :'等待配送的订单'
      ,user : req.session.user
      ,orders : orders
      ,cur : 'meal'
      ,orderCur : 'sub'
      ,pjax : pjax
     });
   });
}
//历史订单 2:已经配送的订单
var sended = function(req,res){
   var pjax = false;
   if(!!req.query.pjax){
     pjax = true;
   }
   var uid = parseInt(req.session.user._id,10);
   var condition={};
   condition.query={
      uid : uid
     ,sendstatus : true
     ,donestatus : false
   };
   condition.sort={
     subtime:-1
   };
   jixiang.get(condition,'orders',function(err,orders){
     if(err){
       orders=[];
     }
     if(!!orders.length){
       orders.forEach(function(item){
         item.subtime = utils.format_date(new Date(item.subtime),true);
         item.orderlist = JSON.parse(item.orderlist);
       });
     }
     res.render('./meal/order',{
       title :'已配送的订单'
      ,user : req.session.user
      ,orders : orders
      ,cur : 'meal'
      ,orderCur : 'send'
      ,pjax : pjax
     });
   });
}
//历史订单 3：已经完成的订单
var done = function(req,res){
   var pjax = false;
   if(!!req.query.pjax){
     pjax = true;
   }
   var uid = parseInt(req.session.user._id,10);
   var condition={};
   condition.query={
      uid : uid
     ,sendstatus : true
     ,donestatus : true
   };
   condition.sort={
     subtime:-1
   };
   jixiang.get(condition,'orders',function(err,orders){
     if(err){
       orders=[];
     }
     if(!!orders.length){
       orders.forEach(function(item){
         item.subtime = utils.format_date(new Date(item.subtime),true);
         item.orderlist = JSON.parse(item.orderlist);
       });
     }
     res.render('./meal/order',{
       title :'已完成的订单'
      ,user : req.session.user
      ,orders : orders
      ,cur : 'meal'
      ,orderCur : 'done'
      ,pjax : pjax
     });
   });
}
//确认收菜，交易完成
var doneconfirm = function(req,res){
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
//对外接口
exports.index = index;
// exports.detail = detail;
// exports.category = category;
exports.newlist = newlist;
exports.like = like;
exports.subed = subed;
exports.sended = sended;
exports.done = done;
exports.doneconfirm = doneconfirm;

/*-------------
      admin
 -------------*/
var fs = require('fs');
//订单管理
var admin = function(req,res){
  var condition = {};
  condition.query = {//未完成状态的订单
     donestatus : false
  };
  condition.sort = {//按提交时间逆序
    subtime : -1
  }
  jixiang.get(condition,'orders',function(err,orders){
    if(err){
      orders=[];
    }
    if(!!orders.length){
     orders.forEach(function(item){
       item.subtime = utils.format_date(new Date(item.subtime),true);
       item.orderlist = JSON.parse(item.orderlist);
     });
    }
    res.render('./admin/meal/index',{
       title : '订餐管理-订单管理'
      ,user : req.session.admin
      ,orders : orders
      ,cur : 'meal'
    });
  });
}
//订单删除
var delOrderlist = function(req,res){
  var id = parseInt(req.body.id);
  jixiang.delById(id,'orders',function(err){
    if(err){
      return res.json({flg:0,msg:err});
    }
    return res.json({flg:1,msg:'删除成功！'});
  });
}

//订单的发单
var sendStatus = function(req,res){
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
var mealManager = function(req,res){
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
        ,user : req.session.admin
        ,meals : meals
        ,cur : 'meal'
        ,pages : pageNum
        ,pagenav : 'meal/control'
      });
    });
  });

}
//添加新菜品
var addMeal = function(req,res){
  if(req.method == 'GET'){
    res.render('./admin/meal/add',{
       title : '订餐管理-添加新菜品'
      ,user : req.session.admin
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
var delMeal = function(req,res){
  jixiang.delById(parseInt(req.body.id,10),'meals',function(err){
    if(err){
      return res.json({flg:0,msg:err});       
    }
    return res.json({flg:1,msg:'删除成功！'});
 });
}
//修改菜品
var modifyMeal = function(req,res){
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
        ,user : req.session.admin
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
//对外接口
exports.admin = admin;
exports.delOrderlist = delOrderlist;
exports.sendStatus = sendStatus;
exports.mealManager = mealManager;
exports.addMeal = addMeal;
exports.delMeal = delMeal;
exports.modifyMeal = modifyMeal;
