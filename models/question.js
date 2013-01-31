/**
 *  Models:问题模型
 */

var mongodb = require('./db');
var Ids = require('./id');

function Question(q){
  this.id = q.id;
  this.cat = q.cat;//0为基本问题，1为建议，2为留言
  this.useful = q.useful;
  this.useless = q.useless;
  this.title = q.title;
  this.content = q.content;
}

module.exports = Question;

Question.prototype.save = function(q,callback){
   Ids.getId('question',function(err,id){
   	if(err){
    return callback(err);
   	}
   	q.id=id;
    mongodb.open(function(err,db){
      if(err){
        mongodb.close();
        callback(err);
      }
      db.collection('question',function(err,collection){
        if(err){
          mongodb.close();
          callback(err);
        }
        collection.ensureIndex('id',{unique:true});
        collection.insert(q,{safe:true},function(err){
          mongodb.close();
          callback(err);
        });
      });
    });
   });
}

Question.get = function(condition,callback){
  mongodb.open(function(err,db){
    if(err){
      mongodb.close();
      callback(err);
    }
    db.collection('question',function(err,collection){
      if(err){
        mongodb.close();
        callback(err);
      }

      var query = condition.query ? condition.query : null
         ,sort = condition.sort ? condition.sort:{_id:1}
         ,skip = condition.skip ? condition.skip : 0
         ,limit = condition.limit ? condition.limit :0

      collection.find(query).sort(sort).skip(skip).limit(limit).toArray(function(err,doc){
        mongodb.close();
        if(err){
          callback(err,null);
        }
        var answers = [];
        doc.forEach(function(doc,index){
          var q = new Question(doc);
          answers.push(q);
        });
        callback(err,answers);
      })
    });
  });
}

Question.review = function(id,condition,callback){
  mongodb.open(function(err,db){
    if(err){
      mongodb.close();
      callback(err);
    }
    db.collection('question',function(err,collection){
      if(err){
        mongodb.close();
        callback(err);
      }
      collection.findAndModify({id:id},[],{$inc:condition.update},{new:true},function(err){
        mongodb.close();
        callback(err);
      });
    });
  });
}

//删除
Question.del = function(id,callback){
   mongodb.open(function(err,db){
    if(err){
      mongodb.close();
      callback(err);
    }
    db.collection('question',function(err,collection){
      if(err){
        mongodb.close();
        callback(err);
      }
      collection.remove({id:id},function(err){
         mongodb.close();
         callback(err);
      });
    });
  }); 
}