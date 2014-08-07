var restify = require('express-restify-mongoose');

var Tag = require('./tag').Tag;
var Post = require('./post').Post;
var Stats = require('./stats').Stats;

exports.Stats = Stats;
exports.Post = Post;
exports.Tag = Tag;

var createApi = function(app) {

    var restOptions = {
        strict: true
    };

    restify.serve(app, Post, restOptions);
    restify.serve(app, Tag, restOptions);
    restify.serve(app, Stats, restOptions);
};

exports.createApi = createApi;