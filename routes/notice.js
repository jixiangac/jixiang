/**
 *  公告Rotues
 */
var Utils = require('../models/utils');
var jixiang = require('../models/base');

var index = function(req,res){
  jixiang.getOne({status:true},'notice',function(err,notice){
    res.render('people', 
      {
         title: '吉祥社区——'+req.params.username
        ,user : req.session.user
        ,notice : notice
        ,cur : 'people'
      });
    });
}

exports.index = index;

/*-------------
     admin     
 -------------*/
var admin = function(req,res){
  jixiang.getOne({status:true},'notice',function(err,notice){
   if(notice){
     notice.publish_date = Utils.format_date(new Date(notice.publish_date));
     notice.update_date = Utils.format_date(new Date(notice.update_date),true);
   }
   res.render('./admin/notice/index',
    {
       title :'发布公告'
      ,user : req.session.admin
      ,notice : notice
      ,cur : 'notice'
    });

  });
}
//发布&&修改公告
var issue = function(req,res){
  if(!req.body.issueContent.length > 0){
    return res.json({flg:0,msg:'请输入公告内容！'});
  }
  var notice ={
       status : true
      ,publish_date : new Date(req.body.issueDate).getTime()
      ,update_date : Date.now()
      ,author : req.body.issueAuthor
      ,content : req.body.issueContent
  };
  if(!Boolean(req.body.notice_id)){//新公告
    jixiang.save(notice,'notice',function(err){
      if(err){
        return res.json({flg:0,msg:'发布新公告失败！'});
      }
        return res.json({flg:1,msg:'发布成功！'});
    });
  }else{//修改公告
    var condition = {};
    condition.query = {
      _id : parseInt(req.body.notice_id,10)
     ,status : true
    };
    condition.modify = notice;
    jixiang.update(condition,'notice',function(err){
      if(err){
        return res.json({flg:0,msg:'修改失败！'});
      }
      return res.json({flg:1,msg:'修改成功！'});
    });

  }
}
//历史公告页
var history = function(req,res){
  jixiang.count({status:false},'notice',function(err,count){
    if(err){
      return res.json({flg:0,msg:err});
    }

    var pages = isNaN(parseInt(req.params[0],10))? 1:parseInt(req.params[0],10);
    if(pages<=0){pages=1;}
    var pageNum ={
       max : Math.ceil(count / 6)
      ,cur : pages
      ,next : pages+1
      ,prev : pages-1
    }
    if(pageNum.cur > pageNum.max){
      return;
    }
    var condition = {
       query :{
         status : false
       } 
      ,sort : {
        _id : -1
      }
      ,skip : (pages-1)*6
      ,limit : 6
    };
    jixiang.get(condition,'notice',function(err,items){
      if(err){
        items=[];
      }
      if(!!items){
        items.forEach(function(item){
          item.publish_date = Utils.format_date(new Date(item.publish_date));
          item.update_date = Utils.format_date(new Date(item.update_date),true);
        });        
      }
      res.render('./admin/notice/history',
        {
           title : '历史公告'
          ,user : req.session.admin
          ,notice : items
          ,pages : pageNum
          ,cur : 'notice'
          ,pagenav : 'notice/history'
        }); 
    });
});
}
//把新公告放入历史公告中
var layside = function(req,res){
  if(Boolean(req.body.notice_id)){
   var condition = {};
   condition.query = {
     _id : parseInt(req.body.notice_id,10)
    ,status : true
   }
   condition.modify={};
   condition.modify['$set']={
     status : false
   }
   jixiang.update(condition,'notice',function(err){
     if(err){
       return res.json({flg:0,msg:'操作失败！'});
     }
     return res.json({flg:1,msg:'操作成功！'});
   });
  }else{
    return res.json({flg:0,msg:'操作失败！'});
  }
}
exports.admin = admin;
exports.issue = issue;
exports.history = history;
exports.layside = layside;