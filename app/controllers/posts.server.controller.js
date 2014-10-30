'use strict';

var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Post = mongoose.model('Post'),
    Tag = mongoose.model('Tag'),
    _ = require('lodash');

function saveTags(post) {

    post.tags = [];

    var regex = /(?:^|\W)#(\w+)(?!\w)/g;
    var match;

    do {
        match = regex.exec(post.title);
        if(match)
            post.tags.push(match[1]);
    } while(match);

    post.tags.forEach(function (tag) {
        var newTag = new Tag({
            tag: tag
        });
        newTag.save();
    });
}

exports.create = function (req, res) {
    var post = new Post(req.body);
    post.user = req.user;

    saveTags(post);

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

exports.delete = function (req, res) {
    var post = req.post;

    post.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(post);
        }
    });
};

exports.list = function (req, res) {

    var query = Post.find();

    //FIXME remodelar
    var tag = req.query.tag;
    if (tag)
        query.where('tag').equals(tag);

    var sort = req.query.sort;
    if (!sort)
        sort = '-created';

    query.sort(sort).exec(function (err, posts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(posts);
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

exports.hasAuthorization = function (req, res, next) {
    if (req.post.user.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};

exports.setCache = function(req, res, next) {

    res.header('Cache-Control', 'public, max-age=315360000');

    next();
};
