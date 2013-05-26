/**
 *  问医 Routes
 */
var jixiang = require('../models/base');
var utils = require('../models/utils');
//首页
exports.index = function(req,res){
  var cat = parseInt(req.query.cat,10) || 1;
  var pjax = !!req.query.pjax ? true : false;
  if(req.method == 'GET'){
    var condition = {};
    //问诊预约
    if(cat == 1){
        var query = {
           uid : req.session.user._id
          ,cat : 1 
          ,'$or' : [
            {time : {'$gte':new Date()*1-86400000}}
           ,{agreetime : {'$gte':new Date()*1-86400000}}
          ]
        }
        jixiang.getOne(query,'doctors',function(err,doc){
          console.log(doc)
          if(!!doc){
            doc.time = utils.format_date(new Date(doc.time));
            doc.agreereply = '约在 '+utils.format_date(new Date(doc.agreetime),true) +' 就诊。';           
          }
          res.render('./doctor/index',{
             title : '问医'
            ,user : req.session.user
            ,cur :　'service'
            ,doc : doc
            ,pjax : pjax
            ,cat : cat
            ,jsflg : 'service'
          })
        });
        return;
    }
    //医药托购
    if(cat == 2){
      condition.query = {
         uid : req.session.user._id
        ,cat : 2
        ,done : false
      }
      jixiang.getOne(condition,'doctors',function(err,doc){
        if(!!doc){
          doc.time = utils.format_date(new Date(doc.time),true);
          doc.medlist = JSON.parse(doc.medlist);
        }
        res.render('./doctor/index',{
          title : '问医'
         ,user : req.session.user
         ,cur : 'service'
         ,cat : cat
         ,pjax : pjax
         ,med : doc
         ,jsflg : 'service'
        })
      }) 
      return;
    }
    if(cat == 3){
      res.render('./doctor/index',{
        title : '政策咨询-医学咨询'
       ,user : req.session.user
       ,cur : 'question'
       ,cat : cat
       ,pjax : pjax
       ,jsflg : 'question'
      });
      return;
    }
 
  }else if(req.method == 'POST'){
    var item = {};
    if(cat == 1){//问诊
      var time = new Date().getFullYear()+'-'+req.body.yuMonth+'-'+req.body.yuDay;
      item = {
        cat : 1
       ,time : new Date(time).getTime()
       ,time_b : req.body.yuTime
       ,doctor : req.body.doctors
       ,patient : req.body.patient
      }
    }else if(cat == 2){//问药
      item = {
        cat : 2
       ,time : Date.now()
       ,medlist : req.body.list
       ,done : false
      }
    }
    item.reply = false;
    item.username = req.session.user.username;
    item.uid = req.session.user._id;

    jixiang.save(item,'doctors',function(err,doc){
      if(err){
        return res.json({success:false,msg:err});
      }
      return res.json({success:true,reload:true,msg:'提交成功！'});
    });

  }

}
//我的问诊
exports.ask = function(req,res){

  var pjax = !!req.query.pjax;
  var cat = +req.query.cat || 1;
  var result = { cur:cat };

  jixiang.get({
    query : {
      cat : 1
     ,uid : req.session.user._id
     ,reply : cat === 2
    }
   ,sort : {
     _id : -1
   }
  },'doctors',function(err,doc){
    if(err){
      doc = [];
    }
    if(!!doc.length){
      doc.forEach(function(item,index){
        item.time = utils.format_date(new Date(item.time));
        if(!item.disagree){
          var max = item.time;
          if(!!item.agreetime){
            item.agreetime = utils.format_date(new Date(item.agreetime),true);
            item.agreereply = '约在 '+utils.format_date(new Date(item.agreetime),true) +' 就诊。';
          }
        }  

      });
    }

    result.doc = doc;
    render();
  });
  
  function render(){
    var renders = {
       title : '我的问诊'
      ,user : req.session.user
      ,cur : 'doctor'
      ,cat : '/ask'
      ,result : result
      ,pjax : pjax
      ,jsflg : 'doctor'      
    }
    res.render('./doctor/ask',renders);
  }
}
//我的药品
exports.medicine = function(req,res){

  function render(){
   var renders = {
       title : '我的药品'
     , user : req.session.user
     , cur : 'doctor'
     , cat : '/medicine'
     , result : result
     , pjax : pjax
     , jsflg : 'doctor' 
     };
   res.render('./doctor/medicine', renders);
  }

  var pjax = !!req.query.pjax;
  var cat = + req.query.cat || 1;
  var result = {cur : cat};

  if (req.method === 'GET') {
    jixiang.get({
      query : {
         cat : 2
       , uid : req.session.user._id
       , reply : cat === 2
       }
     , sort : {
        _id : -1
      }
    }, 'doctors', function (err,doc) {
      if (err) {
        doc =[];
      }
      if (doc.length) {
        doc.forEach(function (item) {
          item.time = utils.format_date(new Date(item.time), true);
          item.medlist = JSON.parse(item.medlist);
        });
      }
      result.doc = doc;
      render();
    });
  } else if (req.method === 'POST') {
  }
}
//我的问题
// exports.myQ = function(req,res){
//   var pjax = !!req.query.pjax ? true : false;
//   var condition = {};
//   condition.query = {
//     subcat : 1
//    ,uid : req.session.user._id
//   };
//   condition.sort = {
//     _id : -1
//   };
//   jixiang.get(condition,'question',function(err,doc){
//     if(err){
//       doc=[];
//     }
//     res.render('./doctor/question',{
//       title : '我的问题'
//      ,user : req.session.user
//      ,cur : 'doctor'
//      ,cat : '/question'
//      ,doc : doc
//      ,pjax : pjax
//     });
//   });
// }

/*----------------
      admin
  ----------------*/
exports.admin = function (req, res) {
  function render() {
    var renders = {
        title : '问诊预约'
      , user : req.session.user
      , result : result
      , cur : 'doctor'  
      };
    res.render('./admin/doctor/index', renders);
  }
  var result = {};
  if (req.method === 'GET') {
    jixiang.get({
      query : {
        cat : 1
        }
    , sort : {
        _id : -1
      }
    }, 'doctors', function (err,doc) {
       if (err) {
         doc=[];
       }

       if (doc.length) {
         doc.forEach(function (item) {
           item.time = utils.format_date(new Date(item.time));
           if(!!item.agreetime){
              item.agreereply = '约在 ' + utils.format_date(new Date(item.agreetime), true) + ' 就诊。';     
           }
         });
       }
       result.doc = doc;
       render();
    });
  } else if (req.method ==='POST') {
    var id = + req.query.id;
    var condition = {};
    condition.query = {
      _id : id
    };
    condition.modify = {
      '$set' : {
         'reply' : true
        ,'replycontent':req.body.replycontent
      }
    }
    var msg;
    if (!req.query.disagree) {
      var reply = new Date().getFullYear() + '-' + req.body.yuMonth + '-' + req.body.yuDay + ' ' + req.body.yuHour + ':00:00';
      condition.modify['$set'].agreetime = new Date(reply).getTime();
      msg = '约在 ' + reply + ' 时间就诊。';
      if (req.body.replycontent.length) {
        msg += '<br />备注：' + req.body.replycontent;
      }
    } else {
      condition.modify['$set'].disagree = true;
      msg = '【回绝了该预约】' + req.body.replycontent;
    }

    jixiang.update(condition, 'doctors', function (err) {
      if(err){
        return res.json({success: false, msg:err})
      }
      return res.json({success: true,msg: msg})
    });
  }
}
//管理托购申请
exports.reMedicine = function (req, res) {
  function render () {
    var renders = {
        title : '药品托购'
      , user : req.session.user
      , cur : 'doctor'
      , result : result
      };
    res.render('./admin/doctor/medicine', renders);
  }
  var result = {};
  if(req.method == 'GET'){
     jixiang.get({
       query : {
         cat : 2
       , done : false 
       }
     , sort : {
         _id : -1
       }
     }, 'doctors', function (err, doc) {
       if (err) {
         doc = [];
       }
       if (doc.length) {
         doc.forEach(function(item){
           item.time = utils.format_date(new Date(item.time),true);
           item.medlist = JSON.parse(item.medlist); 
         });
       }
       result.doc = doc;
       render();
     });
  }else if(req.method == 'POST'){

     if(!!req.query.done){
       var condition = {};
       condition.query = {
         _id : + req.query.id
       }
       condition.modify = {
         '$set' : {
            done : true
         }
       }
       jixiang.update(condition, 'doctors', function (err) {
         if(err){
           return res.json({success: false,msg: err});
          }
          return res.json({success: true,msg: '【完成】'});    
       });
       return;
     }


     var condition = {};
     condition.query = {
        cat :2
      , _id : + req.query.id
     };
     condition.modify = {
       '$set' : {
          'reply' : true
         ,'replycontent': req.body.reply
       }
     }
     jixiang.update(condition, 'doctors', function (err) {
       if (err) {
         return res.json({success: false, msg: err});
       }
       return res.json({success: true,docCat:2, msg: req.body.reply});
     });

  }

}