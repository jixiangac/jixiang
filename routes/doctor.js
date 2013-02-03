/**
 *  就医 Routes
 */
var jixiang = require('../models/base');

var index = function(req,res){
  res.render('./doctor/index', {
    title: '就医',
    user: req.session.user,
    cur: 'doctor'
  });
}

exports.index = index;