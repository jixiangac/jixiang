/**
 *Models: 社区用户模型
 */
var mongodb = require('./db');
var Ids = require('./id');
var Utils = require('./utils');

function User(user){
  this.uid =user.uid;
  this.username = user.username;
  this.password = user.password;
  this.sex = user.sex;
  this.birthday = user.birthday;
  this.regdate = user.regdate;
  this.logindate = user.logindate;
}

module.exports = User;
//用户的存储
User.prototype.save = function(table,callback){
  var user = {
    username : this.username
   ,password : this.password
   ,sex : this.sex
   ,birthday : this.birthday
   ,regdate : this.regdate
   ,logindate : this.logindate
  };
  //colname自增id集合
  Ids.getId(table,function(err,id){//自增uid标识
    if(err){
       return callback(err);
    }
    user.uid = id;
    //存入
    mongodb.open(function(err,db){
     if(err){
       mongodb.close();
       return callback(err);
      }
     //读取users集合
      db.collection(table,function(err,collection){
        if(err){
          mongodb.close();
          return callback(err);
        }
        //为username添加索引
        collection.ensureIndex('uid',{unique:true});
        //写入user文档
        collection.insert(user,{safe:true},function(err,user){
          mongodb.close();
          callback(err,user);
        });
      });
     });
   });  
}
//用户数
User.count = function(callback){
  mongodb.open(function(err,db){
    if(err){
      mongodb.close();
      callback(err);
    }
    //读取users集合
    db.collection('users',function(err,collection){
      if(err){
        mongodb.close();
        callback(err);
      }
      //读取用户数
      collection.count({},function(err,count){
        mongodb.close();
        if(err){callback(err);}
          else{callback(null,count);}
      });
    });
    
  });
}
//列举所有用户
User.people =  function(condition,table,callback){
  mongodb.open(function(err,db){
    if(err){
      mongodb.close();
      return callback(err);
    }
    //读取users集合
    db.collection(table,function(err,collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //查找user属性为username的文档，如果username为null则匹配全部
      var query ={};
      if(condition.username){
        query.username = condition.username;
      }
      collection.find(query).sort({_id:1}).skip(condition.skip).limit(condition.limit).toArray(function(err,doc){
        mongodb.close();
        if(err){
          callback(err,null);
        }
        var users=[];
        doc.forEach(function(doc,index){
           var u = new User(doc);
           u.regdate = Utils.format_date(new Date(u.regdate),true);
           u.logindate = Utils.format_date(new Date(u.logindate),true);
           users.push(u);
        });
        callback(null,users);
      });
    });
  });
}
//读取用户
User.get = function(username,table,callback){
  mongodb.open(function(err,db){
    if(err){
    	mongodb.close();
    	return callback(err);
    }
    //读取table集合
    db.collection(table,function(err,collection){
      if(err){
      	mongodb.close();
    	  return callback(err);
      }
      //查找username为username的文档
      collection.findOne({username:username},function(err,doc){
        mongodb.close();
        if(doc){
          //封装为user对象
          var user = new User(doc);
          callback(err,user);	
        }else{
          callback(err,null);
        }
      });
    });
  });
};
//最近登入时间的更新
User.loginTime=function(uid,table,callback){
  mongodb.open(function(err,db){
    if(err){
      mongodb.close();
      return callback(err);
    }
    //获取table为table的集合
    db.collection(table,function(err,collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //获取username为username的文档
      collection.update({uid:uid},{$set:{'logindate':Date.now()}},{safe:true},function(err,doc){
          mongodb.close();
          callback(err,null);
      });
    });
  });
}
//删除用户
User.delByUid = function(uid,table,callback){
  mongodb.open(function(err,db){
    if(err){
      mongodb.close();
      return callback(err);
    }
    //获取table集合
    db.collection(table,function(err,collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //删除uid=uid的用户
      collection.remove({uid:uid},function(err,doc){
        mongodb.close();
        callback(err,null);
      });
    });
  });
}