const express = require("express");
const Users = require("./entities/users.js");
const Posts = require("./entities/posts.js");

function init(db) {
    const router = express.Router();
    // On utilise JSON
    router.use(express.json());
    // simple logger for this router's requests
    // all requests to this router will first hit this middleware
    router.use((req, res, next) => {
        console.log('API: method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        next();
    });


    //passage en parametres des bd
    const users = new Users.default(db.users);
    const posts = new Posts.default(db.posts);

    router.post("/user/login", async (req, res) => {
        console.log(req.body)
        try {
            const { login, password } = req.body;
            // Erreur sur la requête HTTP
            if (!login || !password) {
                res.status(400).send({
                    status: 400,
                    "message": "Requête invalide : login et password nécessaires"
                });
                return;
            }
            if(! await users.exists(login)) {
                res.status(401).json({
                    status: 401,
                    message: "Utilisateur inconnu"
                });
                return;
            }
            let userid = await users.checkpassword(login, password);
            if (userid) {
                // Avec middleware express-session
                req.session.regenerate(function (err) {
                    if (err) {
                        res.status(500).json({
                            status: 500,
                            message: "Erreur interne"
                        });
                    }
                    else {
                        // C'est bon, nouvelle session créée
                        req.session.userid = userid;
                        res.status(200).json({
                            status: 200,
                            message: "Login et mot de passe accepté",
                            _id: userid._id
                        });
                    }
                });
                return;
            }
            // Faux login : destruction de la session et erreur
            req.session.destroy((err) => { });
            res.status(403).json({
                status: 403,
                message: "login et/ou le mot de passe invalide(s)"
            });
            return;
        }
        catch (e) {
            // Toute autre erreur
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }
    });

    router
        .route("/user/:user_id(\\d+)")
        .get(async (req, res) => {
        try {
            const user = await users.get(req.params.user_id);
            if (!user)
                res.sendStatus(404);
            else
                res.send(user);
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
        .delete((req, res, next) => res.send(`delete user ${req.params.user_id}`));



    router.put("/user", (req, res) => {
        const { login, password, lastname, firstname } = req.body;
        if (!login || !password || !lastname || !firstname) {
            res.status(400).send("Missing fields");
        } else {
            users.createUser(login, password, lastname, firstname)
                .then((user_id) => res.status(201).send({ id: user_id }))
                .catch((err) => res.status(500).send(err));
        }
    });

    router.get("/user/allusers",(req,res)=>{
        users.getAlluser()
            .then((listeuser)=>res.status(201).send(listeuser))
            .catch((err)=>res.status(500).send(err))
    });

    router.put("/user/follow/:id", async (req, res) => {

        if (req.body._id !== req.params.id) {
            console.log(req.body)
          try {

            const user = await users.existsuser(req.params.id);
            const currentUser = await users.existsuser(req.body._id);
            
            if (!user.contacts.includes(currentUser.login)) {
              await users.updatefriend(user._id,req.body.login);
              await users.updatefriend(currentUser._id,user.login);
              res.status(200).json("user has been followed");
            } else {
              res.status(403).json("you allready follow this user");
            }
          } catch (err) {
            res.status(500).json(err);
          }
        } else {
          res.status(403).json("you cant follow yourself");
        }
      });




//apiposts
    router.put("/post",(req,res)=>{
        const {newpost,date,userid}=req.body;
        if (newpost==='' || date==='' || userid===''){
            res.status(400).send("Missing field");
        }else{
            posts.createPost(newpost,date,userid)
                .then((post_id) => res.status(201).send({ id: post_id }))
                .catch((err)=>res.status(500).send(err));
        }
    });


    router.get("/post/allposts",(req,res)=>{
        posts.getAll()
            .then((listeposts)=>res.status(201).send(listeposts))
            .catch((err)=>res.status(500).send(err))


    });

    

    return router;
}
exports.default = init;

