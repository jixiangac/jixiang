/**
 *  就医 Routes
 */
var jixiang = require('../models/base');

var index = function(req,res){
  if(req.method == 'GET'){
    res.render('./doctor/index', {
      title: '就医',
      user: req.session.user,
      cur: 'doctor'
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
    }else if(doctorType == 2){
      item = {
        docCat : 2
       ,time : Date.now()
       ,medname : req.body.medicine
       ,mednum : parseInt(req.body.medNum,10)
       ,medmark : req.body.medRemark
      }
    }

    jixiang.save(item,'doctors',function(err,doc){
      if(err){
        return res.json({flg:0,msg:err});
      }
      return res.json({flg:1,msg:'提交成功！'});
    });

  }

}

exports.index = index;