const data = require('./data');
const express = require('express');
const mustacheExpress = require('mustache-express');
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use('/static', express.static('public'));

var url = 'mongodb://localhost:27017/bots';

// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
//   var userbots = db.collection('userbots');
//   data.users.forEach(function(user) {
//     // console.log("User: " + JSON.stringify(user));
//     userbots.insertOne(user);
//   })
//   db.close();
// });

app.get('/', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to db server");
    var userbots = db.collection('userbots');
    var users = userbots.find().toArray(function(err, docs) {
      res.render('index', {users: docs})
    });
    db.close();
  });
});

app.get('/user/:id/:username', function(req, res) {
  console.log("trying to find id: " + req.params.id);
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to db server");
    var userbots = db.collection('userbots');
    userbots.findOne({username: req.params.username}).then(function(doc) {
      console.log(doc);
      res.render('user', {user: doc})
    });
    db.close();
  });
});

app.get('/available', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to db server");
    var userbots = db.collection('userbots');
    userbots.find({job: null}).toArray(function(err, docs) {
      res.render('index', {users: docs})
    });
    db.close();
  });
});

app.get('/employed', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to db server");
    var userbots = db.collection('userbots');
    userbots.find({job: {$ne: null}}).toArray(function(err, docs) {
      res.render('index', {users: docs})
    });
    db.close();
  });
});
app.listen(3000, () => console.log("Rollin' on 3000"));
