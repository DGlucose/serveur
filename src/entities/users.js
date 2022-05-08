class Users {
  constructor(db) {
    this.db = db
    // suite plus tard avec la BD
  }

  
  createUser(login, password, lastname, firstname) {
    return new Promise((resolve, reject) => {
      let newuser={login:login,password: password, lastname:lastname, firstname: firstname, contacts:[]}
      this.db.insert(newuser)
      var userid;
      this.db.find({login:login, password:password,lastname:lastname, firstname:firstname },{_id:1}, function(err,docs){
        if(err){console.log(err);}
        if (docs===[]){
          reject();
        }else{
          userid=docs[0]._id
          resolve(userid);
        }
      })
      
    });
  }

  getUser(userid) {
    return new Promise((resolve, reject) => {
      const user = this.db.find({_id: userid})
      //console.log(user)
      if(err) {
        //erreur
        reject();
      } else {
        resolve(user);
      }
    });
  }
  
  getAlluser(){
    return new Promise((resolve,reject)=>
    
    this.db.find({},{}, function(err,docs){
        if (err){
            console.log(err);
            reject();
        }

        else{resolve(docs);}
    })
    );
}

  async exists(login) {
    return new Promise((resolve) => {
        this.db.find({login:login},{login:1} ,function(err,docs){
          if (docs===[]){
           reject()
          }else{
            resolve(true)
          }
       })
    });
  }

  async existsuser(id) {
    return new Promise((resolve) => {
        this.db.findOne({_id:id} ,function(err,docs){
          if (docs===[]){
           reject()
          }else{
            resolve(docs)
          }
       })
    });
  }
  async updatefriend(id,login){

     this.db.update({_id:id} ,{ $addToSet :{contacts: login} },function(){
      })
  }


  checkpassword(login, password) {
    return new Promise((resolve, reject) => {
    
     this.db.find({login:login, password:password},{_id:1} ,function(err,docs){
        if (err){console.log(err)}
        if (docs===[]){
            reject();
        }else{
          resolve(docs[0]);
        }
      });
    });
  }

}

exports.default = Users;



