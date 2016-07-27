var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var app = express();
var PORT = 8080; 

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

var server = app.listen(PORT, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});