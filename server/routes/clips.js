var MongoClient = require('mongodb').MongoClient;
var config = require('../config');


exports.getclips = function(req, res) {
  	MongoClient.connect(config.MONGO_URL, function(err, db) {
		if(err) throw err;
        var usercollection = db.collection('users');
		
        var userid = req.query.userid;
        console.log(userid);

        usercollection.findOne({userid: userid}, function(err, user) {
            if (err || user == null) {
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

var createClipId = function(collection, url, coords, callback) {
    var clipid = Math.round(Math.random() * 100000000);
    collection.findOne({clipid: clipid}, function(clip) {
         if (user == null) {
            collection.save({clipid: userid, url: url, coords : coords}, function(err, count){
                if(!err) {
                    console.log('ClipId: ' + clipid + 'saved successfully');
                    callback(clipid);
                } else {
                    // do something
                }
            });
         } else {
            createId(collection, url, coords, callback);
         }
    });
}

exports.addClip = function(req, res) {
    var userid = req.body.userid;
    var url = req.body.url;
    var coords = req.body.coords;
    MongoClient.connect(config.MONGO_URL, function(err, db) {
        if (err) {
            db.close();
            throw err;
        }
        var usercollection = db.collection('users');
        usercollection.collection.findOne({userid: userid}, function(err, user) {
            if (err || user == null) {
                // do something bro
                db.close();
            } else {
                var clipids = user.clipids;
                if (url != null && url != undefined && url != "" && coords != undefined && coords != null) {
                    var found = true;
                    var clipCollection = db.collection('clips');
                    createClipId(clipCollection, url, coords, function(clipid) {
                        clipids.push(clipid);
                        usercollection.update({userid: userid}, {$set: {clipids: clipids}}, function(err, result) {
                            if (err) {
                                db.close();
                                // do something
                            } else {
                                db.close();
                                res.render('index', { title: userid });
                            }
                        });
                        
                    });
                } else {
                    db.close();
                }
            }
        });
    });

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
