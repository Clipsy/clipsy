var MongoClient = require('mongodb').MongoClient
var config = require('../config')

var createId = function(collection, callback){
	var userid = Math.round(Math.random() * 100000000);
	collection.findOne({userid: userid}, function(user) {
         if (user == null) {
         	collection.save({userid: userid}, function(err, count){
         		if(!err) {
         			console.log('Userid: ' + userid + 'saved successfully');
         			callback(userid);
         		}
         	});
         } else {
         	createId(collection, callback);
         }
	});
}

exports.adduser = function(req, res){
  	MongoClient.connect(config.MONGO_URL, function(err, db) {
		if(err) throw err;
		var collection = db.collection('users');
        var found = true;
        createId(collection, function(userid){
        	db.close();
        	res.render('index', { title: userid });
        });
	});
};

