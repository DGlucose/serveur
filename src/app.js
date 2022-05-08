const path = require('path');
const api = require('./api.js');
var cors = require('cors');

var Datastore = require('nedb')
db = new Datastore({filename:"nedb.db", autoload:true})

db.users = new Datastore({filename:"nedb_users.db", autoload:true})
//db.messages = new Datastore()
//db.friends = new Datastore()
db.posts = new Datastore({filename:"nedb_posts.db", autoload:true})

// Détermine le répertoire de base
const basedir = path.normalize(path.dirname(__dirname));
console.debug(`Base directory: ${basedir}`);

const express = require('express');
const app = express()
api_1 = require("./api.js");
const session = require("express-session");

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret: "technoweb rocks"
}));

app.use(cors());
app.use('/api', api.default(db));

// Démarre le serveur
app.on('close', () => {
});
exports.default = app;



