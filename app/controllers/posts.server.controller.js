'use strict';

var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Post = mongoose.model('Post'),
    Tag = mongoose.model('Tag'),
    _ = require('lodash');

var saveTags = function (req, res, next) {

    var post = new Post(req.body);
    post.tags = [];

    var regex = /(?:^|\W)#(\w+)(?!\w)/g;
    var match;

    do {
        match = regex.exec(post.title);
        if (match)
            post.tags.push(match[1]);
    } while (match);

    post.tags.forEach(function (tag) {
        var newTag = new Tag({
            tag: tag
        });
        newTag.save();
    });

    req.body = post;

    next();
};

exports.saveTags = saveTags;

var create = function (req, res) {
    var post = new Post(req.body);

    post.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(post);
        }
    });
};

exports.create = create;

exports.read = function (req, res) {
    res.jsonp(req.post);
};

exports.update = function (req, res) {
    var post = req.post;

    post = _.extend(post, req.body);

    post.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(post);
        }
    });
};

exports.postByID = function (req, res, next, id) {
    Post.findById(id).exec(function (err, post) {
        if (err) return next(err);
        if (!post) return next(new Error('Failed to load post ' + id));
        req.post = post;
        next();
    });
};

exports.isOwner = function (req, res, next) {
    if (req.post.user.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};

exports.like = function (req, res, next) {

    Post.findByIdAndUpdate(req.body._id, {
            $push: {
                likes: req.user._id
            }
        },
        {},
        function (err, obj) {
            if (err) {
                next(err);
            } else {
                res.status(200).json(obj);
            }
        });

};

exports.setLikes = function (req, res, next) {

    next();
    /*
    res.body.forEach( function(post, i, list) {

        if (post.likes && post.likes.indexOf(req.user._id) > -1) {
            post.like = true;
        } else {
            post.like = false;
        }

    });
    */
};
