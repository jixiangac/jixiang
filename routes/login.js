/**
 * 登入Routes
 */
var crypto = require('crypto');
var User = require('../models/user.js');

var index = function(req,res){
  if(req.method == 'GET'){
    res.render('login',
      {
         title:'吉祥社区'
        ,user : req.session.user
      });
  }else if(req.method == 'POST'){
    //生成口令散列
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    User.get(req.body.username,'users',function(err,user){
      if(!user){
        return res.json({flg:0,msg:'用户名或者密码错误！'});
      }
      if(user.password != password){
        return res.json({flg:0,msg:'用户名或者密码错误！'});
      }
      User.loginTime(user.uid,'users',function(err,doc){
        console.log("has visited");
      });
      req.session.user = user;
      res.json({flg:1,msg:'登入成功!',redirect:'/'});
    });
  }
}

exports.index = index;

/*----------
    admin
 ----------*/
var admin = function(req,res){
  if(req.method == 'GET'){
    res.render('./admin/login',
      {
        title:'吉祥社区管理后台'
         ,user : req.session.admin
      });
  }else if(req.method == 'POST'){
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    User.get(req.body.username,'admin',function(err,user){
      if(!user){
        return res.json({flg:0,msg:'用户名或者密码错误！'});
      }
      if(user.password != password){
        return res.json({flg:0,msg:'用户名或者密码错误！'});
      }
      User.loginTime(user.uid,'admin',function(err,doc){
         console.log('has visited');
      });
      req.session.admin = user;
      res.json({flg:1,msg:'登入成功!',redirect:'/admin'});
    });   
  }
}
exports.admin = admin;