/**
 *  问医 Routes
 */
var jixiang = require('../models/base');
var Utils = require('../models/utils');
//首页
var index = function(req,res){
  if(req.method == 'GET'){
    var condition = {};
    condition.query = {
       uid : req.session.user._id
      ,docCat : 1
      ,agreetime : {
        '$gte' : new Date().getTime()-86400000
      } 
    }
    jixiang.getOne(condition,'doctors',function(err,doc){
      if(!!doc){
        doc.time = Utils.format_date(new Date(doc.time));
        switch(doc.timeB){
         case '1' : 
           doc.timeB = '上午';
           break;
         case '2' :
           doc.timeB = '下午';
           break;
         default : 
           doc.timeB = '晚上';
        }
        doc.agreereply = '约在 '+Utils.format_date(new Date(doc.agreetime),true) +' 就诊。';           
      }
      var condition = {};
      condition.query = {
         uid : req.session.user._id
        ,docCat : 2
        ,done : false
      }
      jixiang.getOne(condition,'doctors',function(err,medicine){
        if(!!medicine){
          medicine.time = Utils.format_date(new Date(medicine.time),true);
          medicine.medlist = JSON.parse(medicine.medlist);
        }
        // console.log(medicine)
        res.render('./doctor/index', {
          title: '问医',
          user: req.session.user,
          cur: 'doctor',
          cat:'/',
          agree: doc,
          med : medicine
        }); 
      })
    });
  }else if(req.method == 'POST'){
    var doctorType = parseInt(req.body.docType,10);

    var item = {};
    if(doctorType == 1){//问诊
      var time = new Date().getFullYear()+'-'+req.body.yuMonth+'-'+req.body.yuDay;
      item = {
        docCat: 1
       ,time : new Date(time).getTime()
       ,timeB : req.body.yuTime
       ,doctor : req.body.doctors
       ,patient : req.body.patient
      }
    }else if(doctorType == 2){//问药
      item = {
        docCat : 2
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
        return res.json({flg:0,msg:err});
      }
      return res.json({flg:1,msg:'提交成功！'});
    });

  }

}
//我的问诊
var ask = function(req,res){
  var condition = {};
  condition.query = {
    docCat : 1
   ,uid : req.session.user._id
  };
  condition.sort = {
    _id : -1
  }
  jixiang.get(condition,'doctors',function(err,doc){
    if(err){
      doc = [];
    }
    var items = [];
    if(!!doc.length){
      var now = new Date().getTime()-86400000;//延迟一天
      doc.forEach(function(item,index){
        item.time = Utils.format_date(new Date(item.time));
        switch(item.timeB){
         case '1' : 
           item.timeB = '上午';
           break;
         case '2' :
           item.timeB = '下午';
           break;
         default : 
           item.timeB = '晚上';
        }

        if(!item.disagree){
          var max = item.time;
          if(!!item.agreetime){
            max = item.agreetime > max ? item.agreetime : max;
            item.agreetime = Utils.format_date(new Date(item.agreetime),true);
            item.agreereply = '约在 '+Utils.format_date(new Date(item.agreetime),true) +' 就诊。';
          }
          if(max > now){ 
            items.push(item);
            //doc.splice(index,1);
          }
        }  

      });
    }
    res.render('./doctor/ask',{
       title : '我的问诊'
      ,user : req.session.user
      ,cur : 'doctor'
      ,cat : '/ask'
      ,doc : doc
      ,appointment : items
    });
  });

}
//我的药品
var medicine = function(req,res){
  if(req.method == 'GET'){
    var condition = {};
    condition.query = {
      docCat : 2
     ,uid : req.session.user._id
    }
    condition.sort = {
      _id : -1
    }

    jixiang.get(condition,'doctors',function(err,doc){
      if(err){
        doc =[];
      }
      if(!!doc.length){
        doc.forEach(function(item){
          item.time = Utils.format_date(new Date(item.time),true);
          item.medlist = JSON.parse(item.medlist);
        })
      }
      res.render('./doctor/medicine',{
         title : '我的药品'
        ,user : req.session.user
        ,cur : 'doctor'
        ,cat : '/medicine'
        ,doc : doc
      });
    });

  }
}
//我的问题
var myQ = function(req,res){
  var condition = {};
  condition.query = {
    subcat : 1
   ,uid : req.session.user._id
  };
  condition.sort = {
    _id : -1
  };
  jixiang.get(condition,'question',function(err,doc){
    if(err){
      doc=[];
    }
    console.log(doc)
    res.render('./doctor/question',{
      title : '我的问题'
     ,user : req.session.user
     ,cur : 'doctor'
     ,cat : '/question'
     ,doc : doc
    });
  });
}
exports.index = index;
exports.ask = ask;
exports.medicine = medicine;
exports.myQ = myQ;

/*----------------
      admin
  ----------------*/
var admin = function(req,res){
  if(req.method == 'GET'){
    var condition={};
    condition.query = {
       docCat : 1
    };
    condition.sort = {
      _id : -1
    };
    jixiang.get(condition,'doctors',function(err,doc){
       if(err){
         doc=[];
       }

       if(!!doc.length){
         doc.forEach(function(item){
           item.time = Utils.format_date(new Date(item.time));
           switch(item.timeB){
             case '1' : 
               item.timeB = '上午';
               break;
             case '2' :
               item.timeB = '下午';
               break;
             default : 
               item.timeB = '晚上';
           }

           if(!!item.agreetime){
              item.agreereply = '约在 '+Utils.format_date(new Date(item.agreetime),true) +' 就诊。';     
           }

         });
       }

       res.render('./admin/doctor/index',{
          title : '问诊预约'
         ,user : req.session.admin
         ,doc : doc
         ,cur : 'doctor'
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
    var msg;
    if(!req.body.disagree){
      var reply = new Date().getFullYear()+'-'+req.body.yuMonth+'-'+req.body.yuDay+' '+req.body.yuHour+':00:00';
      condition.modify['$set'].agreetime = new Date(reply).getTime();
      msg = '约在 '+reply+' 时间就诊。';
      if(!!req.body.reply.length){
        msg+='<br />备注：'+req.body.reply;
      }
    }else{
      condition.modify['$set'].disagree = true;
      msg = '回绝了该预约';
    }

    jixiang.update(condition,'doctors',function(err){
      if(err){
        return res.json({flg:0,msg:err})
      }
      return res.json({flg:1,msg:msg})
    });
  }
}
//管理托购申请
var reMedicine = function(req,res){
  if(req.method == 'GET'){
     var condition = {};
     condition.query = {
       docCat : 2
      ,done : false
     }
     condition.sort = {
       _id : -1
     }
     jixiang.get(condition,'doctors',function(err,doc){
       if(err){
         doc = [];
       }
       console.log(doc)
       if(!!doc.length){
         doc.forEach(function(item){
           item.time = Utils.format_date(new Date(item.time),true);
           item.medlist = JSON.parse(item.medlist); 
         });
       }
       res.render('./admin/doctor/medicine',{
          title : '药品托购'
         ,user : req.session.admin
         ,cur : 'doctor'
         ,doc : doc
       });
     });
  }else if(req.method == 'POST'){
     var id = parseInt(req.body.askid,10);

     if(!!req.body.done){
       var condition = {};
       condition.query = {
         _id : id
       }
       condition.modify = {
         '$set' : {
            done : true
         }
       }
       jixiang.update(condition,'doctors',function(err){
         if(err){
           return res.json({flg:0,msg:err});
          }
          return res.json({flg:1,msg:'【完成】'});    
       });
       return;
     }


     var condition = {};
     condition.query = {
       docCat :2
      ,_id : id
     };
     condition.modify = {
       '$set' : {
          'reply' : true
         ,'replycontent':req.body.reply
       }
     }
     jixiang.update(condition,'doctors',function(err){
       if(err){
         return res.json({flg:0,msg:err});
       }
       return res.json({flg:1,docCat:2,msg:req.body.reply});
     });

  }

}
exports.admin = admin;
exports.reMedicine = reMedicine;