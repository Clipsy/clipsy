var MongoClient = require('mongodb').MongoClient;
var config = require('../config');


exports.getclips = function(req, res) {
  	MongoClient.connect(config.MONGO_URL, function(err, db) {
		if(err) throw err;
        var usercollection = db.collection('users');
		
        var userid = req.query.userid;
        console.log(userid);

        usercollection.findOne({userid: userid}, function(err, user) {
            if (user == null) {
                db.close();
                res.render('index', {title : 'no results'});
            } else {
                var clipids = user.clipids;
                if (clipids == null || clipids.length == 0) {
                    res.render('index', {title : "00" });
                }
                var count = 0;
                var results = [];
                for (var i = 0; i < clipids.length; i++) {
                    var clipscollection = db.collection('clips');
                    var clipid = clipids[i].toString();
                    clipscollection.findOne({clipid: clipid}, function(err, clipContent) {
                        count++;
                        results.push(clipContent);
                        if (count == clipids.length) {
                            db.close();
                            //res.render('index', {title : results});
                            res.send(results);
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
