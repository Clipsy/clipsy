var http = require('http');
var config = require('../config');

exports.httpCurl = function(path, method, callback) {
  var options = {
    host: config.PYQT_SERVER.HOST,
    port: config.PYQT_SERVER.PORT,
    path: path,
    method: method
  };

  var req = http.request(options, function(res){
    res.on('data', function (bodyData) {
      if(res.statusCode == 200) {
        callback(bodyData);  
      }
      else callback(null);
    });
  });
  
  req.on('error', function(e) {
    console.log('Problem with request: ' + e.message);
  });
  
  req.end();
}
