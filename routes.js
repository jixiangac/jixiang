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
   ,service = require('./routes/service')
   
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
         ,pjax : false
         ,jsflg : 'index'
        });
  });
  app.get('/people/:username',notice.index);

  /**
   *
   *   登入 & 注册 & 忘记密码
   *
   * 
   */
  app.get('/login',login.index);
  app.post('/login',login.index);

  app.post('/reg',login.reg);
  
  app.get('/forgot',login.forgot);
  app.post('/forgot',login.forgot);
  
  app.get('/setpass',login.setpass);
  app.post('/setpass',login.setpass);

  /*-------------
       订餐
   -------------*/
   //订餐首页
   app.get('/meal',meal.index);

   app.get('/meal/shop',meal.shop)
   app.post('/meal/shop',meal.shop)

   //菜品的详情页
   // app.get(/^\/meal\/detail\/?(\d+)$/,meal.detail);
   //菜品分类
   // app.get(/^\/meal\/category\/?(\d*)$/,meal.category);
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
   
   /**
    *   我的订餐
    *     + 订餐
    *        +  考虑商家入住的形式
    *        (比如沙县小吃，列举全部沙县小吃的类目)
    *     ```
    *       行为流程：  
    *       商家类目发布 -->  用户订餐 -->  订餐配送         
    *     ```
    *    +  购物清单
    *       +  生成订单，未提交
    *       +  生成订单，提交，未配送
    *       +  生成订单，已配送，等待确认
    *       +  完成订单，配送确认 
    */
   app.get('/meal/order/sub',meal.subed);//已提交的订单
   app.get('/meal/order/send',meal.sended);//已经配送的订单
   app.get('/meal/order/done',meal.done);//已经完成的订单
   app.post('/meal/order/done',meal.doneconfirm);//交易完成


   /**
    *  服务首页
    *  包括（线上问诊、问诊预约、药品购买、家政服务）
    * 
    */
   app.get('/services',service.indexs);
   /*--------
      问医
     --------*/
   app.get('/doctor',doctor.index);
   app.post('/doctor',doctor.index);
   app.get('/doctor/ask',doctor.ask);
   app.get('/doctor/medicine',doctor.medicine);
   // app.get('/doctor/question',doctor.myQ);
   /*--------
      家政
    --------*/
    app.get('/service',service.index);
    app.post('/service',service.index);
    app.get('/service/ask',service.service)
   /*--------
    问题咨询
    --------*/
   app.get('/question',question.index);
   app.get('/question/answer',question.qlist);
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
  // app.get('/admin/login',checkNotLogin);
  // app.get('/admin/login',login.admin);
  // app.post('/admin/login',login.admin);
  /*-----------
     管理首页
  ------------*/
  /*-----------
     人员管理
   -----------*/
  //用户列表
  app.get('/admin/people',user.index);
  app.get('/admin/people/admin',user.admin);
  //用户编辑&删除
  app.get('/admin/people/delete',user.delUser);
  //用户个人信息
  app.get('/admin/people/info',user.person);
  app.post('/admin/people/info',user.person);
  /*-----------
     发布公告
    ----------*/
  //获取公告
  app.get('/admin/notice',notice.admin);
  //发布&&修改公告
  app.post('/admin/notice',notice.admin);
  //历史公告页
  app.get('/admin/notice/history',notice.history);
  //把新公告放入历史公告中
  app.post('/admin/notice/history',notice.history);
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
  //商家入驻
  app.get('/admin/meal/shop',meal.adminShop);
  app.get('/admin/meal/shop',meal.adminShop);
  app.get('/admin/meal/addshop',meal.addShop);
  app.post('/admin/meal/addshop',meal.addShop);
  /*-----------
     问医管理
   -----------*/
   app.get('/admin/doctor',doctor.admin);
   app.post('/admin/doctor',doctor.admin);
   app.get('/admin/doctor/medicine',doctor.reMedicine)
   app.post('/admin/doctor/medicine',doctor.reMedicine);
  /*-----------
     问题管理
   ----------*/
   app.get('/admin/question',question.admin);
   app.get('/admin/question/noreply',question.noreply);
   app.get('/admin/question/add',question.newQ);
   app.post('/admin/question/add',question.newQ);
   app.get('/admin/question/edit',question.editQ);
   app.post('/admin/question/edit',question.editQ);
   app.get('/admin/question/reply',question.reply);
   app.post('/admin/question/reply',question.reply);
   app.post('/admin/question/delete',question.del);
  /*-----------
      服务管理
    -----------*/
   app.get('/admin/service',service.admin);
   app.post('/admin/service',service.admin);
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