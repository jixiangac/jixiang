/**
 * Service Routes
 */
var jixiang = require('../models/base');
var utils = require('../models/utils');


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
  var pjax = !!req.query.pjax;
  
  if(req.method == 'GET'){
    var condition = {};
    //家政申请
    if(cat == 1){
      var query = {
        uid : req.session.user._id
       ,time : {
         '$gte' : new Date()*1 -86400000//提前一天
       }
      }
      jixiang.getOne(query,'service',function(err,doc){
        if(!!doc){
          doc.time = utils.format_date(new Date(doc.time));
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
            title : '养老政策-'+doc.title
           ,user : req.session.user
           ,cat : cat
           ,cur : 'question'
           ,doc : doc
           ,detail : true
           ,pjax : pjax
           ,jsflg : 'question'
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
          title : '养老政策'
         ,user : req.session.user
         ,cat : cat
         ,cur :'question'
         ,doc : doc
         ,detail : false
         ,pjax : pjax
         ,jsflg : 'question'
        });
      });
      return;
    }
    if(cat == 3){
      res.render('./service/index',{
         title : '问题咨询-政策咨询'
        ,user : req.session.user
        ,cat : cat
        ,cur : 'question'
        ,pjax : pjax
        ,jsflg : 'question'
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
        return res.json({success:false,msg:err});
      }
      return res.json({success:true,reload:true,msg:'提交成功！'});
    });


  }
//结束
}
//我的家政申请
exports.service = function(req,res){
  var cat = parseInt(req.query.cat,10) || 1;
  var pjax = !!req.query.pjax;
  var result = { cur : cat}

  if(req.method == 'GET'){

    jixiang.get({
      query : {
        uid : req.session.user._id
       ,reply : cat === 2 
      }
     ,sort : {
       _id : -1
     }
    },'service',function(err,doc){
      if(err){
        doc = [];
      }

      if(doc.length){
        doc.forEach(function(item,index){
          item.time = utils.format_date(new Date(item.time));
          if(!item.reply){
            if(!!item.agreetime){
              item.agreetime = utils.format_date(new Date(item.agreetime),true);
            }
          }  
        });

      }
      result.doc = doc;
      render();
    });

    function render(){
      var renders = {
         title : '我的家政'
        ,user : req.session.user
        ,cur : 'service'
        ,cat : '/ask'
        ,result : result
        ,pjax : pjax
        ,jsflg : 'service'
      }
      res.render('./service/ask',renders);
    }
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
           item.time = utils.format_date(new Date(item.time));
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