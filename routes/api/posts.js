var express = require('express');
var router = express.Router();
var db = require('../../db');
var Post = db.Post;

router.get('/', function (req, res, next) {

    Post.find(function (err, posts) {
        if (err) {
            console.error(err);

            next(err);
            return;
        }

        res.send(posts);
    });

});

router.post('/', function (req, res, next) {

    var post = new Post(req.body);
    post.created = new Date();

    post.save(function (err) {
        if (err) {
            next(err);
            return;
        }

        res.send(201);
    });

});
/*
router.get('/:id', function (req, res, next) {

    Post.find(function (err, posts) {
        if (err) {
            console.error(err);

            next(err);
            return;
        }

        res.send(posts);
    });

});
*/
module.exports = router;
