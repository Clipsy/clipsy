var MongoClient = require('mongodb').MongoClient
var config = require('../config')

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
  	MongoClient.connect('config.MONGO_URL', function(err, db) {
		if(err) throw err;
        var usercollection = db.collection('users');
		
        var userid = req.body.userid

        usercollection.collection.findOne({userid: userid}, function(err, user) {
            if (err || user == null) {
                // do something bro
                db.close();
            } else {
                var clipids = user.clips;
                if (clipids == null || clipids.length == 0) {
                    res.render('index', {title : "00" });
                }
                var count = 0;
                var results = [];
                for (var i = 0; i < clipids.length; i++) {
                    var clipscollection = db.collection('clips');
                    clipscollection.findOne({clipid: clipids[i]}, function(clipContent) {
                        count ++;
                        results.push(clipContent);
                        if (count == clipids.length) {
                            db.close();
                            res.render('index', {title : results});
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
}

