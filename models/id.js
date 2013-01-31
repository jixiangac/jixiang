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
            mongodb.close();
            if(doc){
               callback(err,doc.id);
              }else{
              	callback(err,null);
              }
            });
        });
    });
}