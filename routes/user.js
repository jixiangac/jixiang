/**
 * 用户Routes
 */

var jixiang = require('../models/base');
var crypto = require('crypto');
var utils = require('../models/utils');
//普通用户
exports.index = function(req,res){  
  jixiang.count({cat:2},'users',function(err,count){
    if(err)console.log(err);
    var _condition = utils.pagenav(req.query.page,count,7);
     _condition.condition.query = {cat : 2};
     jixiang.get(_condition.condition,'users',function(err,people){
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
          item.regdate = utils.format_date(new Date(item.regdate),true);
          item.logindate = utils.format_date(new Date(item.logindate),true);         
        })
      }
      // var pageNum = {
      //    max : Math.ceil(count/7)
      //   ,cur : pages
      //   ,next : pages+1
      //   ,prev : pages-1
      // }
      // if(pageNum.cur > pageNum.max){
      //   return;
      // }
      res.render('./admin/people/index',
        {
           title : '用户列表'
          ,user : req.session.user
          ,people : people
          ,pages : _condition.pageNum
          ,cur : 'people'
          ,pagenav : '/people?'
        });
    });      
  });
}
//居民编辑&删除
exports.delUser = function(req,res){
  jixiang.delById(parseInt(req.query.id,10),'users',function(err){
    if(err){
      return res.json({success:false,msg:err});
    }
    return res.json({success:true,reload:true,msg:'删除成功！'});
  });
}
//管理员
exports.admin = function(req,res){
  if(req.method === 'GET'){
    jixiang.count({cat:1},'users',function(err,count){
      if(err)console.log(err);
      // var pages = isNaN(parseInt(req.params[0],10))?1:parseInt(req.params[0],10);
      // var condition = {
      //    skip : (pages-1)*7
      //   ,limit : 7
      // }
      var _condition = utils.pagenav(req.query.page,count,7);
      _condition.condition.query = {cat : 1};
      jixiang.get(_condition.condition,'users',function(err,people){
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
          item.logindate = utils.format_date(new Date(item.logindate),true);
        })
        // var pageNum = {
        //    max : Math.ceil(count/7)
        //   ,cur : pages
        //   ,next : pages+1
        //   ,prev : pages-1
        // }
        // if(pageNum.cur > pageNum.max){
        //   return;
        // }
        res.render('./admin/people/admin',
          {
             title : '管理首页'
            ,user : req.session.user
            ,people : people
            ,cur : 'people'
            ,pages : _condition.pageNum
            ,pagenav : '/admin/people/admin?'
          });
        });  
    });
  }else if(req.method === 'POST'){

  }
}
exports.person = function(req,res){
  if(req.method === 'GET'){
    jixiang.getOne({_id : +req.query.id},'users',function(err,doc){
       if(err)console.log(err);
       doc.regdate = utils.format.call(new Date(doc.regdate),'yyyy-MM-dd hh:mm:ss');
       doc.logindate = utils.format.call(new Date(doc.logindate),'yyyy-MM-dd hh:mm:ss');
       render();
       function render(){
         var renders = {
           title : '用户个人信息'
          ,doc : doc
          ,user : req.session.user
          ,cur : 'people'
         }
         res.render('./admin/people/info',renders);
       }
    });
  }else if(req.method === 'POST'){

  }
}

