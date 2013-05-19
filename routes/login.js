
var config = require('../config')
   ,crypto = require('crypto')
   ,utils = require('../models/utils')
   ,jixiang = require('../models/base');


/**
 * 
 *   登入
 *   用户类型cat：1为管理员，2为普通用户
 *   成功返回'/'
 * 
 */
exports.index = function(req,res){
  if(req.method == 'GET'){
    res.render('login',
      {
         title:'吉祥社区'
        ,user : req.session.user
        ,pjax : false
        ,jsflg : 'sign'
      });
  }else if(req.method == 'POST'){
    //生成口令散列
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var user_cat = req.body.admin ? 1 : 2;

    jixiang.getOne({username:req.body.username,cat : user_cat},'users',function(err,user){
      if(!user || user.password != password){
        return res.json({success:false,msg:'用户名或者密码错误！'});
      }
      var condition = {};
      condition.query = {
        _id : user._id
      }
      condition.modify={
        '$set' : {
          'logindate' : Date.now()
        }
      };
      jixiang.update(condition,'users',function(err){
        console.log("had logined!");
      });
      req.session.user = user;
      var redirect = (user_cat === 1) ? '/admin' : '/';
      res.json({success:true,msg:'登入成功!',redirect: redirect});
    });
  }
}

/**
 * 注册
 * 
 * userdata = {
 *   username : string
 *   password : string
 *   sex  : number (1男2女3其他)
 *   birthday : string
 *   regdate : number
 *   logindate : number
 *   }
 * 
 */
exports.reg = function(req,res){
  if(req.method == 'GET'){
    res.render('reg',
      {
        title : '吉祥社区'
       ,user :  req.session.user
       ,pjax : false
       ,jsflg : 'sign'
      });
  }else if(req.method == 'POST'){
    if(req.body['repassword'] !== req.body['password']){
      return res.json({success:false,pwderror:1,msg:'密码不一致'});
    }
    //生成口令散列
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var userdata = {
       username : req.body.username
      ,email : req.body.email
      ,password : password
      ,sex : req.body.sex
      ,birthday : req.body.birthYear+'-'+req.body.birthMonth+'-'+req.body.birthDay
      ,regdate : Date.now()
      ,logindate : Date.now()
      ,cat : 2
    };
    jixiang.getOne({
      '$or' : [
         { username : userdata.username }
        ,{ email : userdata.email }
       ]
    },'users',function(err,doc){
      if(doc){
        err = '用户名或者邮箱已经存在!';
      }
      if(err){
        return res.json({success:false,msg:err});
      }
      jixiang.save(userdata,'users',function(err,doc){
        if(err){
          return res.json({success:false,msg:err});
        }
        req.session.user = doc[0];
        res.json({success:true,msg:'注册成功！',redirect:'/'});
      });
      
    });
  }
}
/**
 *   忘记密码
 *
 *   签名比对为 
 *   
 *   base64(key) && 当前时间 < retrieve_time
 * 
 */
exports.forgot = function(req,res){
  if(req.method == 'GET'){
    res.render('forgot',
    {
        title : config.name + '-忘记密码'
       ,user :  req.session.user
       ,pjax : false
       ,jsflg : 'sign'
       ,template : 1
    });
  }else if(req.method == 'POST'){
     var email = req.body.email;
     jixiang.getOne({email:email},'users',function(err,doc){
        if(err || !doc)return res.json({flg:0,msg:'没有这个邮箱！'});
        var md5 = crypto.createHash('md5');
        var date = new Date().getTime();
        var key = md5.update(''+date).digest('base64');
        jixiang.update({
          query:{
            _id :doc._id
          },
          modify:{
            '$set':{
               retrieve_key : key
              ,retrieve_time : date
            }
          }
        },'users',function(err){
           var html = '<p><a href="'+config.base+'setpass?key='+key+'&email='+email+'">请点击这里进行密码重置</a></p><p>请在24个小时内点击有效</p>';
           utils.email(email,'程序问答密码重置','请在24个小时内点击有效',html);
           return res.json({flg:2,cover:1,msg:'请在24个小时内前往邮箱收取重置密码的邮件，点击链接进行重置密码！'});
        });
     })
  }
}

exports.setpass = function(req,res){
  var key = req.query.key;
  var email = req.query.email;
  if(req.method == 'GET'){
    var setpass = '';
    jixiang.getOne({email:email,retrieve_key:key},'users',function(err,doc){
      if(err)console.log(err);
      console.log(doc)
      if(!doc || !doc.retrieve_time || (doc.retrieve_time - new Date().getTime() > 3600*24*1000) ){
         setpass = '信息有误或者链接已经失效！请重新申请！';
      }
      render();
    })
    function render(){
      var renderData = {
        title : config.name + '密码重置'
       ,user :  req.session.user
       ,pjax : false
       ,jsflg : 'sign'
       ,template : 2
       ,setpass : setpass
       ,options : {key:key,email:email}
      }
      res.render('forgot',renderData);
    }
  }else if(req.method == 'POST'){
    jixiang.getOne({email:email,retrieve_key:key},'users',function(err,doc){
      if(err)console.log(err);
      if(!doc || !doc.retrieve_time || (doc.retrieve_time - new Date().getTime() > 3600*24*1000)){
        return res.redirect('/setpass?key='+key+'&email='+email);
      }
      if(req.body['repassword'] != req.body['password']){
          return res.json({flg:0,pwderror:1,msg:'密码不一致'});
      } 
      var password = crypto.createHash('md5').update(req.body.password).digest('base64');
      jixiang.update({
        query : {
          _id : doc._id
        }
       ,modify : {
         '$set' : {
            password : password
           ,retrieve_key : null
           ,retrieve_time : null
         }
       }
      },'users',function(err){
         return res.json({flg:1,msg:'密码重置成功！',redirect:'/'});
      });
    });
 
  }
}


/*----------
//     admin
//  ----------*/
// var admin = function(req,res){
//   if(req.method == 'GET'){
//     res.render('./admin/login',
//       {
//         title:'吉祥社区管理后台'
//        ,user : req.session.user
//        ,jsflg : 'sign'
//       });
//   }else if(req.method == 'POST'){
//     var md5 = crypto.createHash('md5');
//     var password = md5.update(req.body.password).digest('base64');
//     jixiang.getOne({username:req.body.username},'admin',function(err,user){
//       if(!user){
//         return res.json({flg:0,msg:'用户名或者密码错误！'});
//       }
//       if(user.password != password){
//         return res.json({flg:0,msg:'用户名或者密码错误！'});
//       }
//       var condition = {};
//       condition.query = {
//         _id : user._id
//       };
//       condition.modify = {
//         '$set' : {
//           'logindate' : Date.now()
//         }
//       }
//       jixiang.update(condition,'admin',function(err){
//          console.log('had logined');
//       });
//       req.session.user = user;
//       res.json({flg:1,msg:'登入成功!',redirect:'/admin'});
//     });   
//   }
// }
// exports.admin = admin;