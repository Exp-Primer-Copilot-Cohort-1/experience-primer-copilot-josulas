// create web server
var express = require('express');
var app = express();

// import modules
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// connect to mongodb
mongoose.connect('mongodb://localhost/comments');

// create schema for comments
var commentSchema = new mongoose.Schema({
    name: String,
    comment: String
});

// create model
var Comment = mongoose.model('Comment', commentSchema);

// set up body parser
app.use(bodyParser.urlencoded({ extended: true }));

// set up static files
app.use(express.static('public'));

// set up view engine
app.set('view engine', 'ejs');

// get request
app.get('/', function(req, res) {
    Comment.find({}, function(err, comments) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', { comments: comments });
        }
    });
});

// post request
app.post('/', function(req, res) {
    Comment.create(req.body.comment, function(err, newComment) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

// listen to port
app.listen(3000, function() {
    console.log('Server is running on port 3000');
});