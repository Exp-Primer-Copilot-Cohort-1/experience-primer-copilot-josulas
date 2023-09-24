// create web server
var express = require('express');
var router = express.Router();
// import model
var Comment = require('../models/comment');
var Post = require('../models/post');
// import middleware
var middleware = require('../middleware');
// ==============================
// COMMENTS ROUTES
// ==============================

// NEW COMMENT
router.get('/posts/:id/comments/new', middleware.isLoggedIn, function(req, res){
    // find post by id
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {post: post});
        }
    });
});

// CREATE COMMENT
router.post('/posts/:id/comments', middleware.isLoggedIn, function(req, res){
    // lookup post using ID
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
            res.redirect('/posts');
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash('error', 'Something went wrong');
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // connect new comment to post
                    post.comments.push(comment);
                    post.save();
                    // redirect to show page
                    req.flash('success', 'Successfully added comment');
                    res.redirect('/posts/' + post._id);
                }
            });
        }
    });
});

// EDIT COMMENT
router.get('/posts/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect('back');
       } else {
           res.render('comments/edit', {post_id: req.params.id, comment: foundComment});
       }
    });
});

// UPDATE COMMENT
router.put('/posts/:id/comments/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect('back');
       } else {
           res.redirect('/posts/' + req.params.id);
       }
    });
});

// DESTROY COMMENT
router.delete('/posts/:id/comments/:comment_id', middleware.checkCommentOwnership, function(req, res){
    //