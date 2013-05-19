/**
 * Service Routes
 */
var jixiang = require('../models/base');
var Utils = require('../models/utils');


exports.indexs = function(req,res){
  if(req.method === 'GET'){

    render();

    function render(){
      var renders = {
        title : '服务'
       ,user : req.session.user
       ,cur : 'service'
       ,pjax : false
       ,jsflg : 'service'        
      }
      res.render('./service',renders);
    }

  }else if(req.method === 'POST'){

  }
}
//首页
exports.index = function(req,res){
  var cat = parseInt(req.query.cat,10) || 1;
  var pjax = !!req.query.pjax ? true : false;
  if(req.method == 'GET'){
    var condition = {};
    //家政申请
    if(cat == 1){
      var query = {
        uid : req.session.user._id
       ,time : {
         '$gte' : new Date()*1 -86400000
       }
      }
      jixiang.getOne(query,'service',function(err,doc){
        if(!!doc){
          doc.time = Utils.format_date(new Date(doc.time));
        }
        res.render('./service/index',{
          title : '家政'
         ,user : req.session.user
         ,cat : cat
         ,cur : 'service'
         ,doc : doc
         ,pjax : pjax
         ,jsflg : 'service'
        })
      })
      return;
    }
    //cat=2时取养老政策的数据
    if(cat == 2){
      //详细页
      if(!!req.query.detail){
        var id =parseInt(req.query.detail,10);
        var query = {
          cat : 2
         ,_id : id
        }
        jixiang.getOne(query,'question',function(err,doc){
          res.render('./service/index',{
            title : '家政'
           ,user : req.session.user
           ,cat : cat
           ,cur : 'service'
           ,doc : doc
           ,detail : true
           ,pjax : pjax
           ,jsflg : 'service'
          });
        })
        return;
      }
      //
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
        console.log(doc)
        res.render('./service/index',{
          title : '家政'
         ,user : req.session.user
         ,cat : cat
         ,cur :'service'
         ,doc : doc
         ,detail : false
         ,pjax : pjax
         ,jsflg : 'service'
        });
      });
      return;
    }
    if(cat == 3){
      res.render('./service/index',{
         title : '家政'
        ,user : req.session.user
        ,cat : cat
        ,cur : 'service'
        ,pjax : pjax
        ,jsflg : 'service'
      })
      return;
    }

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
  var cat = parseInt(req.query.cat,10) || 1;
  var pjax = !!req.query.pjax ? true : false;

  if(req.method == 'GET'){
    var condition = {};
    condition.query = {
      uid : req.session.user._id
     ,reply : (cat==1)?false:true
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

        //var now = new Date().getTime()-86400000;//延迟一天
        doc.forEach(function(item,index){
          item.time = Utils.format_date(new Date(item.time));
          if(!item.reply){
            //var max = item.time;
            if(!!item.agreetime){
             // max = item.agreetime > max ? item.agreetime : max;
              item.agreetime = Utils.format_date(new Date(item.agreetime),true);
            }
            // if(max > now){ 
            //   items.push(item);
            // }
          }  
        });

      }
      res.render('./service/ask',{
         title : '我的家政'
        ,user : req.session.user
        ,cur : 'service'
        ,cat : '/ask'
        ,doc : doc
        ,pjax : pjax
        ,jsflg : 'service'
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
         ,user : req.session.user
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