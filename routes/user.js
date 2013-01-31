/**
 * 用户Routes
 */
var crypto = require('crypto');
var User = require('../models/user.js');

//社区居民
var index = function(req,res){
  User.count(function(err,count){
    if(err){
      return res.json({flg:0,msg:err});
    }
    var pages = isNaN(parseInt(req.params[0],10))?1:parseInt(req.params[0],10);
    var condition = {
       skip : (pages-1)*7
      ,limit : 7
    }
     User.people(condition,'users',function(err,people){
      if(err){
        people=[];
      }else{
        people.forEach(function(item,index){
           switch(item.sex){
            case '1' : 
              item.sex = '男';
              break;
            case '2' : 
              item.sex = '女';
              break;
            default : 
              item.sex = '其他';
          }          
        })
      }
      var pageNum = {
         max : Math.ceil(count/7)
        ,cur : pages
        ,next : pages+1
        ,prev : pages-1
      }
      if(pageNum.cur > pageNum.max){
        return;
      }
      res.render('./admin/people/index',
        {
           title : '用户列表'
          ,user : req.session.admin
          ,people : people
          ,pages : pageNum
          ,cur : 'people'
          ,pagenav : 'people'
        });
    });      
  });
}
//居民编辑&删除
var delUser = function(req,res){
  User.delByUid(parseInt(req.body.id),'users',function(err,doc){
    if(err){
      return res.json({flg:0,msg:err});
    }
    return res.json({flg:1,msg:'删除成功！'});
  });
}
exports.index = index;
exports.delUser = delUser;

/*----------
    admin
  ---------*/
var admin = function(req,res){
  var condition = {
     skip : 0
    ,limit : 0
  }
  User.people(condition,'admin',function(err,people){
    if(err){
      people=[];
    }
    people.forEach(function(item,index){
      switch(item.sex){
        case '1' : 
          item.sex = '男';
          break;
        case '2' : 
          item.sex = '女';
          break;
        default : 
          item.sex = '其他';
      }
    })
    res.render('./admin/index',
      {
       title : '管理首页'
        ,user : req.session.admin
        ,people : people
        ,cur : 'index'
      });
    });
}
exports.admin = admin;