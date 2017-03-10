var MongoClient = require('mongodb').MongoClient, assert = require('assert');

var url = 'mongodb://localhost:27017/db';

var aUser = {
  username: 'Jong',
  password: '123'
};

var insertUser = function (url, user) { 
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log('Connected successfully to server');

    var username = user.username;

    clearDocument(db, 'users');

    findDocuments(db, 'users', {username: username}, function (results) {
      if (results.length < 1) {
        insertItem(db, 'users', user, function() {
          findDocuments(db, 'users', {}, function(results) {
            console.log(results);
            db.close();
          });
        });
      } else {
        console.log('User already exists');
        db.close();
      }
    });
  });
};

var insertItem = function (db, table, item, callback) {
  var collection = db.collection(table);
  collection.insertOne(item, function (err, result) {
    assert.equal(err, null);
    console.log('Inserted', item, 'in', table);
    callback(result);
  })
}

var findDocuments = function (db, table, query, callback) {
  var collection = db.collection(table);
  collection.find(query).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

var updateDocument = function(db, table, firstTarget, update, callback) {
  var collection = db.collection(table);
  collection.updateOne(firstTarget, { $set: update}, function (err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log('Updated the document with the field a equal to 2');
    callback(result);
  })
}

var removeDocument = function(db, table, target, callback) {
  var collection = db.collection(table);
  collection.deleteOne(target, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log('Removed', target, 'from', table);
    callback(result);
  })
}

var clearDocument = function(db, table, callback) {
  var collection = db.collection(table);
  collection.deleteMany({}, function(err, result) {
    assert.equal(err, null);
    console.log('Cleared', table);
    if (callback) {
      callback(result);
    }
  })
}

insertUser(url, aUser);