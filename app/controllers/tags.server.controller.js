'use strict';

var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Tag = mongoose.model('Tag'),
    _ = require('lodash');

exports.read = function (req, res) {
    res.jsonp(req.tag);
};

exports.list = function (req, res) {
    Tag.find().sort('-created').populate('user', 'displayName').exec(function (err, tags) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(tags);
        }
    });
};

exports.tagByID = function (req, res, next, id) {
    Tag.findById(id).populate('user', 'displayName').exec(function (err, tag) {
        if (err) return next(err);
        if (!tag) return next(new Error('Failed to load tag ' + id));
        req.tag = tag;
        next();
    });
};
