var express = require('express');
var router = express.Router();
var models = require('../models');
var authService = require('../services/auth');

router.get('/createPost', function (req, res, next) {
    res.render('posts', { title: 'Create A Post'});
});

router.post('/createPost', function (req, res, next) {
    let token = req.cookies.jwt;
    models.users
    authService.verifyUser(token).then(user => {
        if (user) {
            models.posts
                .findOrCreate({
                    where: {
                        UserId: user.UserId,
                        PostDate: req.body.postDate,
                        PostTitle: req.body.postTitle,
                        PostBody: req.body.postBody
                    }
                })
                .spread(function (result, created) {
                    if (created) {
                        res.redirect('/users/profile');
                    } else {
                        res.send('Post failed.');
                    }
                })
        }
    });
});

router.get("/editPost/:id", function (req, res, next) {
    let postID = parseInt(req.params.id);
    let token = req.cookies.jwt;
    models.users
    if (token) {
        authService.verifyUser(token).then(user => {
            if (user) {
                models.posts
                    .findByPk(postID)
                    .then(post => res.render('editPost', { post }));
            } else {
                res.send("Sorry, there was a problem editing this post.");
            }
        });
    }
});

router.post("/editPost/:id", function (req, res, next) {
    let postID = parseInt(req.params.id);
    let token = req.cookies.jwt;
    if (token) {
        authService.verifyUser(token).then(user => {
            if (user) {
                models.posts
                    .update(
                        { PostTitle: req.body.postTitle, PostBody: req.body.postBody },
                        { where: { PostId: postID } })
                    .then(user => res.redirect('/users/profile'));
            } else {
                res.send("Sorry, there was a problem editing this post.");
            }
        });
    }
});

router.post("/admin/deletePost/:id", function (req, res, next) {
    let postID = parseInt(req.params.id);
    let token = req.cookies.jwt;
    if (token) {
        authService.verifyUser(token)
            .then(user => {
                if (user.Admin) {
                    models.posts
                        .update({ Deleted: true }, { where: { PostId: postID } })
                        .then(user => res.redirect('/users/admin'));
                } else {
                    res.send("You are not logged in as Admin. Unable to delete post.");
                }
            });
    }
});

router.post("/deletePost/:id", function (req, res, next) {
    let postID = parseInt(req.params.id);
    let token = req.cookies.jwt;
    if (token) {
        authService.verifyUser(token)
            .then(user => {
                if (user) {
                    models.posts
                        .update({ Deleted: true }, { where: { PostId: postID } })
                        .then(user => res.redirect('/users/profile'));
                } else {
                    res.send("Unable to Delete");
                }
            });
    }
});

module.exports = router;