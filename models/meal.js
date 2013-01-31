/**
 * Models: 订餐数据模型
 */
var mongodb = require('./db');
var Ids = require('./id');

//菜品结构
function Meal(meal){
   this.id = meal.id
  ,this.name = meal.name
  ,this.cat = meal.cat
  ,this.like = meal.like//数组，存点击人的UID
  ,this.supplier = meal.supplier
  ,this.price = meal.price
  ,this.pic = meal.pic
  ,this.description = meal.description
  ,this.handpick = meal.handpick
}

module.exports = Meal;

//新菜品的添加
Meal.prototype.save = function(callback){
  var meal={
  	 name : this.name
  	,cat : this.cat
  	,like : []
  	,supplier : this.supplier
  	,price : this.price
  	,pic : this.pic
    ,description : this.description
  	,handpick : this.handpick
  }
  Ids.getId('meals',function(err,id){
    meal.id = id;
    mongodb.open(function(err,db){
    if(err){
    	mongodb.close();
    	return callback(err);
    }
    //打开meals集合
    db.collection('meals',function(err,collection){
      if(err){
      	mongodb.close();
      	return callback(err);
      }
      //添加索引
      collection.ensureIndex('id',{unique:true});
      //插入数据
      collection.insert(meal,{safe:true},function(err){
      	mongodb.close();
        if(err)callback(err)
        	else callback(null);
      });
      });
   }); 	
  });

}
//菜品的获取
Meal.get = function(condition,callback){
  mongodb.open(function(err,db){
    if(err){
      mongodb.close();
      return callback(err);
    }
    db.collection('meals',function(err,collection){
      if(err){
        mongodb.close();
        callback(err);
      }
     var query = condition.query ? condition.query : null
        ,sort = condition.sort ? condition.sort:{_id:1}
        ,skip = condition.skip ? condition.skip : 0
        ,limit = condition.limit ? condition.limit :0
        ;
      collection.find(query).sort(sort).skip(skip).limit(limit).toArray(function(err,doc){
         mongodb.close();
         if(err){
            callback(err,null);
         }
         var meals=[];
         doc.forEach(function(doc,index){
           var m = new Meal(doc);
           switch(m.cat){
             case '1':
               m.cat_name = '早餐';
               break;
             case '2':
               m.cat_name = '午餐';
               break;
             case '3' :
               m.cat_name ='下午茶';
               break;
             case '4' :
               m.cat_name ='晚餐';
               break;
             default :
               m.cat_name ='早餐';
           }
           switch(m.handpick){
             case '1':
               m.handpick = '是';
               break;
             default:
               m.handpick = '否';
           }
           meals.push(m);
         });
         callback(null,meals);
      });
    });
  });
}
//菜品的更新
Meal.prototype.modify = function(meal,callback){
  mongodb.open(function(err,db){
    if(err){
      mongodb.close();
      return callback(err);
    }
    db.collection('meals',function(err,collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      collection.update({id:meal.id},meal,function(err){
         mongodb.close();
         callback(err);
      });
    });
  });
}
//菜品的删除
Meal.del = function(id,callback){
  mongodb.open(function(err,db){
    if(err){
      mongodb.close();
      callback(err);
    }
    db.collection('meals',function(err,collection){
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
//喜欢
Meal.like = function(id,uid,callback){
  mongodb.open(function(err,db){
    if(err){
      mongodb.close();
      callback(err);
    }
    db.collection('meals',function(err,collection){
      collection.update({id:id},{$push:{like:uid}},function(err){
         mongodb.close();
         callback(err);
      });
    });
  });
}