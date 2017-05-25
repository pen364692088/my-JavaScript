var mongoClient=require('mongodb').MongoClient;
var url='mongodb://127.0.0.1/myDB';

function insert(assemble,data,next){
    mongoClient.connect(url,function(err,db){
        if(err){
            console.log(err);
        }else{
                db.collection(assemble).insert(data,function(err){
                next();
                db.close();
            });        
        }        
    })
}
function find(assemble,data,next){
    mongoClient.connect(url,function(err,db){
        if(err){
            console.log(err);
        }else{
            db.collection(assemble).find(data).toArray(function(err,docs){
                next(docs);
                db.close();
            })
        }


    });
}
function update(assemble,data,changeData,next){
     mongoClient.connect(url,function(err,db){
        if(err){
            console.log(err);
        }else{
            db.collection(assemble).update(data,{$set:update},true,true,function(err,docs){
                next(docs);
                db.close();
            });
        }


    });
}
function remove(assemble,data,next){
    mongoClient.connect(url,function(err,db){
        if(err){
            console.log(err);
        }else{
            db.collection(assemble).remove(data,function(err,docs){
                next(docs);
                db.close();
            })
        }


    });
}
module.exports={
    insert:insert,
    update:update,
    find:find,
    remove:remove

}