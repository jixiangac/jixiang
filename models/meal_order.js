/**
 *  Models: 订餐订单模型
 */
var mongodb = require('./db');
var Ids = require('./id');
var Utils = require('./utils');

function Order(order){
  this.id = order.id;	
  this.uid = order.uid;
  this.username = order.username;
  this.subtime = order.subtime;
  this.donetime = order.donetime;
  this.substatus = order.substatus;//是否提交了订单
  this.donestatus = order.donestatus;//是否交易完成
  this.sendstatus = order.sendstatus;//单子是否发送
  this.orderlist = order.orderlist;//订单记录，数组
}

module.exports = Order;

//保存订单
Order.prototype.save = function(callback){
  var order = {
  	 uid : this.uid
  	,username : this.username
  	,subtime : this.subtime
  	,donetime : this.donetime
  	,substatus : this.substatus
  	,donestatus : this.donestatus
    ,sendstatus : this.sendstatus
  	,orderlist : this.orderlist
  }
  Ids.getId('orders',function(err,id){
    if(err){
      callback(err);
    }
    order.id = id;
     mongodb.open(function(err,db){
       if(err){
       	mongodb.close();
       	callback(err);
       }
       db.collection('order',function(err,collection){
         if(err){
         	mongodb.close();
         	callback(err);
         }
         collection.ensureIndex('id',{unique:true});
         collection.insert(order,{safe:true},function(err){
            mongodb.close();
            callback(err,id);
         });
      });
     });
  })
}

//同个订单增加{$push:{orderlist:orderlist}}/删除$pull一条记录
//更新提交状态{$set:{'subtime':Date.now(),'substatus':xx}}
//更新交易状态{$set:{'donetime':Date.now(),'donestatus':xx}}
//更新已发单状体{$set:{'sendstatus':boolean}}
Order.update = function(id,condition,callback){
	mongodb.open(function(err,db){
      if(err){
      	mongodb.close();
      	callback(err);
      }
      db.collection('order',function(err,collection){
        if(err){
        	mongodb.close();
        	callback(err);
        }
        var modify = {};
        switch(condition.handle){
           case '1' ://增加
           modify['$push'] = condition.update;
           break;
           case '2' ://删除
           modify['$pull'] = condition.update;
           break;
           default ://提交|交易状态
           modify['$set'] = condition.update;
        }
        collection.update({id:id},modify,function(err){
           mongodb.close();
           callback(err);
        });
      })
	});
}
//订单的获取
//query={id:id,uid:uid,donestatus:false}获取id:id,uid:uid交易未完成的数据
Order.get = function(condition,callback){ 
  mongodb.open(function(err,db){
      if(err){
      	mongodb.close();
      	callback(err);
      }
      db.collection('order',function(err,collection){
        if(err){
        	mongodb.close();
        	callback(err);
        }
     var query = !!condition.query ? condition.query : null
        ,sort = !!condition.sort ? condition.sort:{_id:1}
        ,skip = !!condition.skip ? condition.skip : 0
        ,limit = !!condition.limit ? condition.limit :0
        ;
        collection.find(query).sort(sort).skip(skip).limit(limit).toArray(function(err,doc){
          mongodb.close();
          if(err){
          	callback(err,null);
          }
          var orders=[];
          doc.forEach(function(doc,index){
             var o = new Order(doc);
             o.subtime = Utils.format_date(new Date(o.subtime),true);
             o.donetime = Utils.format_date(new Date(o.donetime),true);
             orders.push(o);
          });
          callback(err,orders);
        });
      })
  });
}
//订单的删除
Order.del = function(id,callback){
  mongodb.open(function(err,db){
     if(err){
     	mongodb.close();
     	callback(err);
     }
     db.collection('order',function(err,collection){
       if(err){
       	mongodb.close();
       	callback(err);
       }
       collection.remove({id:id},function(err){
         mongodb.close();
         callback(err);
       });
     })
  });
}