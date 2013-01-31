/**
 * Models:发布公告数据模型
 */
var mongodb = require('./db');
var Ids = require('./id');
var Utils = require('./utils');

//公告模型
function Notice(item){
  this.id = item.id;//公告唯一标识id
  this.status = item.status; //标记是否为新公告，false为历史公告
  this.publish_date = item.publish_date;//公告发布日期
  this.update_date = item.update_date;//公告修改的最后日期
  this.author = item.author;//公告发布者
  this.content = item.content;//公告内容
}

module.exports = Notice;

//公告的储存
Notice.prototype.save = function(callback){
  var item = {
     status : this.status
  	,publish_date : this.publish_date
  	,update_date : this.update_date
  	,author : this.author
  	,content : this.content
  };
  //自增公告的序号作为主键标识
  Ids.getId('notice',function(err,id){
    if(err){
    	return callback(err);
    }
    item.id = id;
    //存入新公告
    mongodb.open(function(err,db){
      if(err){
      	mongodb.close();
      	return callback(err);
      }
      //读取notice集合
      db.collection('notice',function(err,collection){
        if(err){
        	mongodb.close();
        	return callback(err);
        }
        //为新notice增加索引
        collection.ensureIndex('uid',{unique:true});
        //插入新公告
        collection.insert(item,{safe:true},function(err,doc){
           mongodb.close();
           callback(err);            
        });
      });
    });
  });
}
//公告的修改
Notice.prototype.update = function(item,callback){
  mongodb.open(function(err,db){
    if(err){
    	mongodb.close();
    	return callback(err);
    }
    //读取notice
    db.collection('notice',function(err,collection){
      if(err){
      	mongodb.close();
      	return callback(err);
      }
      //更新id=id的公告
      collection.update({id:item.id,status:true},item,function(err,doc){
        mongodb.close();
        callback(err);
      });
    });
  });
}
//置入历史公告
Notice.history = function(id,callback){
  mongodb.open(function(err,db){
    if(err){
      mongodb.close();
      return callback(err);
    }
    //读取notice集合
    db.collection('notice',function(err,collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      var query={};
      query.id=id;
      query.status=true;
      //把id=id放入历史记录去,也就是把status状态改为false
      collection.update(query,{$set:{status:false}},{safe:true},function(err,doc){
        mongodb.close();
        callback(err);
      });
    });
  });
}
//获取公告的Count数
Notice.count = function(status,callback){
  mongodb.open(function(err,db){
    if(err){
      mongodb.close();
      callback(err);
    }
    //读取notice集合
    db.collection('notice',function(err,collection){
      if(err){
        mongodb.close();
        callback(err);
      }
      var query={};
      if(status!==null){
        query.status = status;
      }
      //读取记录
      collection.count(query,function(err,count){
        mongodb.close();
        if(err){
          callback(err);
        }else{
          callback(null,count);
        }
      });
    });
  });
}
//公告的获取
Notice.get = function(condition,callback){
  mongodb.open(function(err,db){
    if(err){
    	mongodb.close();
    	callback(err);
    }
    //读取notice集合
    db.collection('notice',function(err,collection){
      if(err){
      	mongodb.close();
      	callback(err);
      }
      var query={};
      if(condition.status!==null){
        query.status = condition.status;
      }
      //获取id=id公告集合
      collection.find(query).sort({_id:-1}).skip(condition.skip).limit(condition.limit).toArray(function(err,doc){
        mongodb.close();
        var items = [];
        if(doc){
          doc.forEach(function(doc,index){
            var item = new Notice(doc);
            item.publish_date = Utils.format_date(new Date(item.publish_date));
            item.update_date = Utils.format_date(new Date(item.update_date),true);
            items.push(item);
          });
        }
        callback(err,items); 
      });
    });
  });
}