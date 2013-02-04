/**
 * 路由控制
 */

var meal = require('./routes/meal')
   ,question = require('./routes/question')
   ,notice = require('./routes/notice')
   ,login = require('./routes/login')
   ,register = require('./routes/register')
   ,user = require('./routes/user')
   ,doctor = require('./routes/doctor')
   
module.exports = function(app){
 /************************
  *      前台路由        *
  ************************/
  /*--------
      首页
   --------*/
  app.get('/',function(req,res){
    if(!req.session.user){
      return res.redirect('/login');
    }
      res.render('index',
        {
          title :'吉祥社区'
         ,user : req.session.user
         ,cur : 'index'
        });
  });
  app.get('/people/:username',notice.index);

  /*----------
     登入模块
   ----------*/
  app.get('/login',login.index);
  app.post('/login',login.index);
  /*----------
     注册模块
   ----------*/
   app.get('/reg',register.index);
   app.post('/reg',register.index);
  /*-------------
       订餐
   -------------*/
   //订餐首页
   app.get('/meal',meal.index);
   //菜品的详情页
   app.get(/^\/meal\/detail\/?(\d+)$/,meal.detail);
   //菜品分类
   app.get(/^\/meal\/category\/?(\d*)$/,meal.category);
   //菜品的喜欢
   app.post('/meal/like',meal.like);
   //订单清单
   //app.get('/meal/orderlist',meal.orderlist);
   //增加新订单
   app.post('/meal/add',meal.newlist);
   //删除订单的某条记录
   //app.post('/meal/delete',meal.deleteOne);
   //提交订单，更改成提交状态
   //app.post('/meal/suborder',meal.suborder);
   //历史订单 1:已提交的订单
   app.get('/meal/order/sub',meal.subed);
   //历史订单 2:已经配送的订单
   app.get('/meal/order/send',meal.sended);
   //历史订单 3：已经完成的订单
   app.get('/meal/order/done',meal.done);
   //确认收菜，交易完成
   app.post('/meal/order/done',meal.doneconfirm);
   /*--------
      问医
     --------*/
   app.get('/doctor',doctor.index);
   app.post('/doctor',doctor.index);
   app.get('/doctor/ask',doctor.ask);
   app.get('/doctor/medicine',doctor.medicine)
   /*--------
    问题咨询
    --------*/
   app.get('/question',question.index);
   app.post('/question',question.answer);
   app.post('/question/review',question.review);
  /*-------
     退出
    -------*/
  app.get('/logout',function(req,res){
    req.session.user = null;
    res.redirect('/login');
  });

 /******************
  *    后台路由    *
  ******************/
  /*----------
    后台登入
   ----------*/
  app.get('/admin/login',checkNotLogin);
  app.get('/admin/login',login.admin);
  app.post('/admin/login',login.admin);
  /*-----------
     管理首页
  ------------*/
  //管理员列表
  app.get('/admin',checkLogin);
  app.get('/admin',user.admin);
  /*-----------
     社区居民
   -----------*/
  //用户列表
  app.get(/^\/admin\/people\/?(\d)*$/,user.index);
  //用户编辑&删除
  app.post('/admin/people/delete',user.delUser);
  /*-----------
     发布公告
    ----------*/
  //获取公告
  app.get('/admin/notice',notice.admin);
  //发布&&修改公告
  app.post('/admin/notice',notice.issue);
  //历史公告页
  app.get(/^\/admin\/notice\/history\/?(\d*)$/,notice.history);
  //把新公告放入历史公告中
  app.post('/admin/notice/history',notice.layside);
  /*-----------
     订餐管理
    ----------*/
  //订单管理
  app.get('/admin/meal',meal.admin);
  //订单删除
  app.post('/admin/order/delete',meal.delOrderlist);
  //订单的已发单状态
  app.post('/admin/order/send',meal.sendStatus);
  //菜品管理
  app.get(/^\/admin\/meal\/control\/?(\d*)$/,meal.mealManager);
  //添加新菜品
  app.get('/admin/meal/add',meal.addMeal);
  app.post('/admin/meal/add',meal.addMeal);
  //删除菜品
  app.post('/admin/meal/delete',meal.delMeal);
  //修改菜品
  app.get(/^\/admin\/meal\/edit\/?(\d+)$/,meal.modifyMeal);
  app.post('/admin/meal/edit',meal.modifyMeal);
  /*-----------
     问医管理
   -----------*/
   app.get('/admin/doctor',doctor.admin);
   app.post('/admin/doctor',doctor.admin);
  /*-----------
     问题管理
   ----------*/
   app.get('/admin/question',question.admin);
   app.get('/admin/question/add',question.newQ);
   app.post('/admin/question/add',question.newQ);
   app.post('/admin/question/delete',question.del);
  /*-----------
     后台登出
   -----------*/
  app.get('/admin/logout',function(req,res){
    req.session.admin = null;
    return res.redirect('/admin/login');
  });
};
/*----------------------
  检查是否登入的路由控制
------------------------*/
function checkLogin(req,res,next){
  if(!req.session.admin){
     return res.redirect('/admin/login');
  }
  next();
}

function checkNotLogin(req,res,next){
  if(req.session.admin){
    return res.redirect('/admin');
  }
  next();
}