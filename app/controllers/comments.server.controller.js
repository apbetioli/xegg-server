'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
    Post = mongoose.model('Post'),
    Comment = mongoose.model('Comment'),
	_ = require('lodash');

exports.create = function(req, res) {
	var comment = new Comment(req.body);
	comment.user = req.user;
    comment.post = req.post;

	comment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comment);
		}
	});
};

exports.read = function(req, res) {
	res.jsonp(req.comment);
};

exports.update = function(req, res) {
	var comment = req.comment;

	comment = _.extend(comment, req.body);

	comment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comment);
		}
	});
};

exports.delete = function(req, res) {
	var comment = req.comment;

	comment.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comment);
		}
	});
};

exports.list = function(req, res) {

    var query = Comment.find();

    var post = req.post;
    if(post)
        query.where('post').equals(post);

    var sort = req.query.sort;
    if(!sort)
        sort = '-created';

    query.sort(sort).exec(function(err, comments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(comments);
		}
	});
};

exports.commentByID = function(req, res, next, id) {
	Comment.findById(id).exec(function(err, comment) {
		if (err) return next(err);
		if (!comment) return next(new Error('Failed to load comment ' + id));
		req.comment = comment;
		next();
	});
};

exports.hasAuthorization = function(req, res, next) {
	if (req.comment.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};