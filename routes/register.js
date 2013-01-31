/**
 * 注册Routes
 */
var crypto = require('crypto');
var User = require('../models/user.js');

var index = function(req,res){
  if(req.method == 'GET'){
    res.render('reg',
      {
        title : '吉祥社区'
       ,user :  req.session.user
      });
  }else if(req.method == 'POST'){
    if(req.body['re-password'] != req.body['password']){
      return res.json({flg:0,pwderror:1,msg:'密码不一致'});
    }
    //生成口令散列
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var newUser = new User({
       username : req.body.username
      ,password : password
      ,sex : req.body.sex
      ,birthday : req.body.birthYear+'-'+req.body.birthMonth+'-'+req.body.birthDay
      ,regdate : Date.now()
      ,logindate : Date.now()
    });
    User.get(newUser.username,'users',function(err,user){
      if(user){
        err = '用户名已经存在!';
      }
      if(err){
        return res.json({flg:0,msg:err});
      }
      newUser.save('users',function(err,users){
        if(err){
          return res.json({flg:0,msg:err});
        }
        req.session.user = users[0];
        res.json({flg:1,msg:'注册成功！',redirect:'/'});
        //return res.redirect('/');
      });
      
    });
  }
}
exports.index = index;