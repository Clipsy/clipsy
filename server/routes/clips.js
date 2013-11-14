var MongoClient = require('mongodb').MongoClient

/*
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
}*/

exports.getclips = function(req, res) {
  	MongoClient.connect('mongodb://127.0.0.1:27017/clipsy', function(err, db) {
		if(err) throw err;
        var usercollection = db.collection('users');
		
        var userid = req.body.userid

        user.collection.findOne({userid: userid}, function(err, user) {
            if (user == null) {
                db.close();
            } else {
                var clipIds = user.clips;
                if (clipIds == null || clipIds.length == 0) {
                    res.render('index', {title : "00" });
                }
                var count = 0;
                var results = [];
                for (var i = 0; i < clipIds.length; i++) {
                    var clipscollection = db.collection('clips');
                    clipscollection.findOne({clipid: clipIds[i]}, function(clipContent) {
                        count ++;
                        results.push(clipContent);
                        if (count == clipIds.length) {
                            db.close();
                            res.render('index', {title : results});
                        };
                    });
                }
            }
        });
	});
};

exports.getclipdata = function(req, res) {
    
}

