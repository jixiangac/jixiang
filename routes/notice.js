/**
 *  公告Rotues
 */
var utils = require('../models/utils');
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
exports.admin = function(req,res){
  if(req.method === 'GET'){
    jixiang.getOne({
      status:true
    },'notice',function(err,notice){
     if(notice){
       notice.publish_date = utils.format_date(new Date(notice.publish_date));
       notice.update_date = utils.format_date(new Date(notice.update_date),true);
     }
     res.render('./admin/notice/index',
      {
         title :'发布公告'
        ,user : req.session.user
        ,notice : notice
        ,cur : 'notice'
      });

    });    
  }else if(req.method === 'POST'){//发布&&修改公告
    if(!req.body.issueContent.length > 0){
      return res.json({success:false,msg:'请输入公告内容！'});
    }
    var notice ={
         status : true
        ,publish_date : new Date(req.body.issueDate).getTime()
        ,update_date : Date.now()
        ,author : req.body.issueAuthor
        ,content : req.body.issueContent
    };
    if(!req.query.id){//新公告
      jixiang.save(notice,'notice',function(err){
        if(err){
          return res.json({success:false,msg:'发布新公告失败！'});
        }
          return res.json({success:true,reload: true,msg:'发布成功！'});
      });
    }else{//修改公告
      var condition = {};
      condition.query = {
        _id : parseInt(req.query.id,10)
       ,status : true
      };
      condition.modify = notice;
      jixiang.update(condition,'notice',function(err){
        if(err){
          return res.json({success:false,msg:'修改失败！'});
        }
        return res.json({success:true,reload: true,msg:'修改成功！'});
      });

    }  
  }

}
//历史公告页
exports.history = function(req,res){
  if(req.method === 'GET'){
    jixiang.count({status:false},'notice',function(err,count){
      if(err)consoel.log(err);
      var _condition = utils.pagenav(req.query.page,count,7);

      _condition.condition.query = { status : false };
      _condition.condition.sort = { _id : -1 };

      jixiang.get(_condition.condition,'notice',function(err,items){
        if(err){
          items=[];
        }
        if(!!items){
          items.forEach(function(item){
            item.publish_date = utils.format_date(new Date(item.publish_date));
            item.update_date = utils.format_date(new Date(item.update_date),true);
          });        
        }
        res.render('./admin/notice/history',
          {
             title : '历史公告'
            ,user : req.session.user
            ,notice : items
            ,pages : _condition.pageNum
            ,cur : 'notice'
            ,pagenav : '/admin/notice/history?'
          }); 
      });
    });
  }else if(req.method === 'POST'){//把新公告放入历史公告中
    if(req.query.id){
     jixiang.update({
        query : {
          _id : parseInt(req.query.id,10)
         ,status : true
        }
       ,modify : {
        '$set' : { 
          status : false
        }
       } 
     },'notice',function(err){
       if(err){
         return res.json({success:false,msg:'操作失败！'});
       }
       return res.json({success:true,msg:'操作成功！'});
     });
    }else{
      return res.json({success:false,msg:'操作失败！'});
    }
  }

}