/**
 * 自增Id标识
 */
var mongodb = require('./db');

function Ids(colname, id) {
    this.id = id;
    this.colname = colname;
}
module.exports = Ids;
Ids.getId = function (colname, callback) {
    mongodb.open(function (err, db) {
    db.collection('ids', function (err, collection) {
        collection.findAndModify({colname:colname}, [], {$inc:{id:1}}, {new:true}, function (err, doc) {
            //mongodb.close();
            console.log(!!doc)
            if(!doc){
               collection.insert({colname:colname,_id:0},function(err,doc){
                 if(err)callback(err)
                 else{
                  callback(null,doc._id)
                 }
               })
            }else{
              callback(null,doc.id)
            }
            //mongodb.close();
            });
        });
    });
}