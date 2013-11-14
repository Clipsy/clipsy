var MongoClient = require('mongodb').MongoClient;
var config = require('../config');
var utils = require('./utils');
var querystring = require('querystring');

exports.getclips = function(req, res) {
  	MongoClient.connect(config.MONGO_URL, function(err, db) {
		if(err) throw err;
        var usercollection = db.collection('users');
        var userid = req.query.userid;

        usercollection.findOne({userid: userid}, function(err, user) {
            if (err || user == null) {
                db.close();
                res.render('index', {title : 'no results'});
            } else {
                var clipids = user.clipids;
                if (clipids == null || clipids.length == 0) {
                    res.render('index', {title : "no clips found" });
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

var getClipImageUrl = function(clipid, clipData, callback) {
    var path = '/image';
    var params = querystring.stringify({
        url : clipData.url,
        screenwidth : clipData.screenwidth,
        top : clipData.top,
        left : clipData.left,
        width : clipData.width,
        height : clipData.height,
        output : clipid
    });
    path = path + '?' + params;
    utils.httpCurl(path, 'GET', function(body){
        if(body == null) {
            callback(null);
        } else {
            var imageFile = body.toString();
            var imageUrl = config.IMAGE_BASE_URL + "/" + imageFile;
            callback(imageUrl);
        }
    });
}

var createClipId = function(collection, clipData, callback) {
    var clipid = Math.round(Math.random() * 100000000).toString();
    clipData.clipid = clipid;
    collection.findOne({clipid: clipid}, function(clip) {
         if (clip == null) {
            collection.save(clipData, function(err, count){
                if(!err) {
                    console.log('ClipId: ' + clipid + 'saved successfully');

                    callback(clipid);
                } else {
                	callback(null);
                }
            });
         } else {
            createClipId(collection, url, coords, callback);
         }
    });
}

exports.addclip = function(req, res) {
    var userid = req.body.userid;
    var url = req.body.url;
    var screenwidth = req.body.screenwidth;
    var top = req.body.top;
    var left = req.body.left;
    var width = req.body.width;
    var height = req.body.height;
    
    var clipdata = {
        url : url,
        screenwidth : screenwidth,
        top : top,
        left : left,
        width : width,
        height : height
    };

    MongoClient.connect(config.MONGO_URL, function(err, db) {
        if (err) {
            db.close();
            throw err;
        }
        var usercollection = db.collection('users');
        usercollection.findOne({userid: userid}, function(err, user) {
            if (err || user == null) {
                // do something bro
                db.close();
                res.render('index', { title: 'User not found' });
            } else {
                var clipids = user.clipids;
                if (url != null && screenwidth != null && top != null && left != null && width != null && height != null) {
                    var clipCollection = db.collection('clips');
                    
                    createClipId(clipCollection, clipdata, function(clipid) {
                    	if (clipid == null) {
                    		db.close();
                    		res.render('index', { title: 'Clip not generated' });
                    	}
                        clipids.push(clipid);
                        usercollection.update({userid: userid}, {$set: {clipids: clipids}}, function(err, result) {
                            if (err) {
                                db.close();
                                res.render('index', { title: 'Clip not added to collection.' });
                            } else {
                                getClipImageUrl(clipid, clipdata, function(imageUrl){
                                    if (imageUrl == null) {
                                        db.close();
                                        res.render('index', { title: 'Image not generated.' });
                                    } else {
                                        clipCollection.update({clipid: clipid}, {$set: {imageurl: imageUrl}}, function(err, result) {
                                            db.close();
                                            if (err) {
                                                res.render('index', { title: 'Clip not added to collection.' });
                                            } else {
                                                res.send(clipids);    
                                            }
                                        });
                                    } 
                                });
                            }
                        });
                    });
                } else {
                    db.close();
                    res.render('index', { title: 'Invalid query params found.' });
                }
            }
        });
    });
}

exports.getclip = function(req, res) {
	MongoClient.connect(config.MONGO_URL, function(err, db) {
        if(err) throw err;
        var clipid = req.query.clipid;
        var clipCollection = db.collection('clips');
        clipCollection.findOne({clipid: clipid}, function(err, clipData){
            if(err) {
                db.close();
                res.status(400);
                res.send();
            } else {
                getClipImageUrl(clipid, clipData, function(imageUrl){
                    db.close();
                    if(imageUrl == null) {
                        res.status(400);
                        res.send();
                    } else {
                        res.send(imageUrl);
                    }
                });
            }
        });
    });
}

exports.addexistingclip = function(req, res) {
	var clipid = req.body.clipid;
	var userid = req.body.userid;

}

exports.getpopularclips = function(req, res) {
    
}

exports.getrecentclips = function(req, res) {

}
