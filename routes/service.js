/**
 * Service Routes
 */
var jixiang = require('../models/base');
var Utils = require('../models/utils');

//首页
exports.index = function(req,res){
  if(req.method == 'GET'){

    var condition = {};
    condition.query = {
      cat : 2
    }
    condition.get = {
      title : 1
    }
    condition.sort = {
      _id : -1
    }
    condition.limit = 10;
    jixiang.get(condition,'question',function(err,doc){
      if(err){
        doc = [];
      }
      res.render('./service/index',{
        title : '家政'
       ,user : req.session.user
       ,cur :　'service'
       ,agree : false
       ,doc : doc
      });
    });

  }else if(req.method == 'POST'){
    var time = new Date().getFullYear()+'-'+req.body.yuMonth+'-'+req.body.yuDay;
    var item = {
      time : new Date(time).getTime()
     ,timeB : req.body.yuTime
     ,service_cat : req.body.service_cat
     ,remark : req.body.remark
     ,reply : false
     ,username : req.session.user.username
     ,uid : req.session.user._id
    }

    jixiang.save(item,'service',function(err,doc){
      if(err){
        return res.json({flg:0,msg:err});
      }
      return res.json({flg:1,msg:'提交成功！'});
    });


  }
//结束
}
//我的家政申请
exports.service = function(req,res){
  if(req.method == 'GET'){
    var condition = {};
    condition.query = {
      uid : req.session.user._id
    };
    condition.sort = {
      _id : -1
    }
    jixiang.get(condition,'service',function(err,doc){
      if(err){
        doc = [];
      }
      var items = [];
      if(!!doc.length){

        var now = new Date().getTime()-86400000;//延迟一天
        doc.forEach(function(item,index){
          item.time = Utils.format_date(new Date(item.time));
          if(!item.reply){
            var max = item.time;
            if(!!item.agreetime){
              max = item.agreetime > max ? item.agreetime : max;
              item.agreetime = Utils.format_date(new Date(item.agreetime),true);
            }
            if(max > now){ 
              items.push(item);
            }
          }  
        });

      }
      console.log(doc)
      res.render('./service/ask',{
         title : '我的家政'
        ,user : req.session.user
        ,cur : 'service'
        ,cat : '/ask'
        ,doc : doc
      });
    });
  }else if(req.method == 'POST'){

  }
//结束
}

/*-------------
     admin
  -------------*/
exports.admin = function(req,res){
  if(req.method == 'GET'){
    var condition={};
    condition.sort = {
      _id : -1
    };
    jixiang.get(condition,'service',function(err,doc){
       if(err){
         doc=[];
       }

       if(!!doc.length){
         doc.forEach(function(item){
           item.time = Utils.format_date(new Date(item.time));
         });
       }

       res.render('./admin/service/index',{
          title : '家政服务'
         ,user : req.session.admin
         ,doc : doc
         ,cur : 'service'
       });

    });
  }else if(req.method == 'POST'){
    var id = parseInt(req.body.askid,10);
    var condition = {};
    condition.query = {
      _id : id
    };
    condition.modify = {
      '$set' : {
         'reply' : true
        ,'replycontent':req.body.reply
      }
    }
    jixiang.update(condition,'service',function(err){
      if(err){
        return res.json({flg:0,msg:err})
      }
      return res.json({flg:1,msg:req.body.reply})
    });
  }
}