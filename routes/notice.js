/**
 *  公告Rotues
 */
var Notice = require('../models/notice.js');

var index = function(req,res){
  Notice.get({status:true},function(err,item){
    if(err){
      item=[];
    }
    res.render('people', 
      {
         title: '吉祥社区——'+req.params.username
        ,user : req.session.user
        ,notice : item
        ,cur : 'people'
      });
    });
}

exports.index = index;

/*-------------
     admin     
 -------------*/
var admin = function(req,res){
  Notice.get({status:true},function(err,items){
   if(err){
    items=[];
   }
   res.render('./admin/notice/index',
    {
       title :'发布公告'
      ,user : req.session.admin
      ,notice : items
      ,cur : 'notice'
    });

  });
}
//发布&&修改公告
var issue = function(req,res){
  if(!req.body.issueContent.length > 0){
    return res.json({flg:0,msg:'请输入公告内容！'});
  }
  var item = new Notice({
       status : true
      ,publish_date : new Date(req.body.issueDate).getTime()
      ,update_date : Date.now()
      ,author : req.body.issueAuthor
      ,content : req.body.issueContent
  });
  if(!Boolean(req.body.notice_id)){//新公告
    item.save(function(err){
      if(err){
        return res.json({flg:0,msg:'发布新公告失败！'});
      }
        return res.json({flg:1,msg:'发布成功！'});
    });
  }else{//修改公告
    item.id=parseInt(req.body.notice_id,10);
    item.update(item,function(err){
      if(err){
        return res.json({flg:0,msg:'修改失败！'});
      }
      return res.json({flg:1,msg:'修改成功！'});
    });

  }
}
//历史公告页
var history = function(req,res){
  Notice.count(false,function(err,count){
  if(err){
    return res.json({flg:0,msg:err});
  }
  console.log(req.params[0])
  var pages = isNaN(parseInt(req.params[0],10))? 1:parseInt(req.params[0],10);
  if(pages<=0){pages=1;}
  var condition = {
     status : false
    ,skip : (pages-1)*6
    ,limit : 6
  }
  var pageNum ={
     max : Math.ceil(count / 6)
    ,cur : pages
    ,next : pages+1
    ,prev : pages-1
  }
  if(pageNum.cur > pageNum.max){
    return;
  }
  Notice.get(condition,function(err,items){
  if(err){
    items=[];
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
   Notice.history(parseInt(req.body.notice_id,10),function(err){
     if(err){
       return res.json({flg:0,msg:'操作失败！'});
     }
     return res.json({flg:1,msg:'操作成功！'});
     // res.redirect('/admin/notice');
   });
  }else{
  return res.json({flg:0,msg:'操作失败！'});
  }
}
exports.admin = admin;
exports.issue = issue;
exports.history = history;
exports.layside = layside;