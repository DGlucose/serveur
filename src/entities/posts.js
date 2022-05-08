const Datastore = require("nedb");

class Posts{
    constructor(db) {
    this.db = db
    // suite plus tard avec la BD
    }

    createPost(newpost,date){
        return new Promise((resolve, reject) => {
            let post={date:date,newpost:newpost}
            this.db.insert(post)  
            var postid;
            this.db.find({date:date,newpost:newpost},{_id:1}, function(err,docs){
                if(err){console.log(err);}
                if (docs===[]){
                    reject();
                }else{
                    postid=docs[0]._id
                    resolve(postid);
                }
            }
            )  
        })
    }


    getAll(){
        return new Promise((resolve,reject)=>
        
        this.db.find({},{newpost:1}, function(err,docs){
            if (err){
                console.log(err);
                reject();
            }
    
            else{resolve(docs);}
        })
        );
    }




}






exports.default = Posts