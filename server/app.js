/**
 * Module dependencies.
 */

var express = require('express');
var users = require('./routes/users');
var clips = require('./routes/clips');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/getclips', clips.getclips);
app.get('/getclip', clips.getclip);
app.get('/getcachedclip', clips.getcachedclip);
app.post('/addexistingclip', clips.addexistingclip);
app.post('/addclip', clips.addclip);
app.post('/adduser', users.adduser);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
