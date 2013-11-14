var MongoClient = require('mongodb').MongoClient;
var config = require('../config');


exports.getclips = function(req, res) {
  	MongoClient.connect(config.MONGO_URL, function(err, db) {
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

exports.getclip = function(req, res) {
	MongoClient.connect(config.MONGO_URL, function(err, db) {
		if(err)	throw err;
		var clipid = req.query.clipid;
		/*
			Get image from Nikhil's api.
			Assume that the images are saved as <random_id>.png
		*/
		var imageFile = "12311133.png";
		db.close();
		res.send({clipid: clipid, url : config.IMAGE_BASE_URL + "/" + imageFile});
	});
}
