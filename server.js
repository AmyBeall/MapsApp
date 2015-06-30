var express = require('express');
var app 	= express();
var bodyParser = require('body-parser');
var morgan  = require('morgan');

var path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(8080);
console.log('Magic happens on port ' + 8080);