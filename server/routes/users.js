var MongoClient = require('mongodb').MongoClient

var createId = function(collection, callback){
	var userid = Math.round(Math.random() * 100000000);
	collection.find({userid: userid}, function(err, results) {
         if (!err && results.length == 0) {
         	collection.save({userid: userid}, function(err, count){
         		if(!err) {
         			console.log('Userid: ' + userid + 'saved successfully');
         			callback(userid);
         		}
         	});
         } else {
         	console.log(results.length);
         	createId(collection, callback);
         }
                
	});
}

exports.adduser = function(req, res){
  	MongoClient.connect('mongodb://127.0.0.1:27017/clipsy', function(err, db) {
		if(err) throw err;
		var collection = db.collection('users');
        var found = true;
        createId(collection, function(userid){
        	res.render('index', { title: userid });
        });
	});
};
