'use strict';

var users = require('../../app/controllers/users'),
    posts = require('../../app/controllers/posts'),
    core = require('../../app/controllers/core'),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    restify = require('express-restify-mongoose');

module.exports = function(app) {

    app.route('/api/v1/posts')
    	.get(core.log, posts.likes)
        .post(core.log, users.requiresToken, posts.saveTags, posts.create);

    app.route('/api/v1/posts/:id')
    	.get(core.log)
        .put(core.log, users.requiresToken, posts.isOwner)
        .delete(core.log, users.requiresToken, posts.isOwner);

    app.route('/api/v1/posts/:id/like')
        .get(core.log, users.requiresToken, posts.like);

    restify.serve(app, Post, {version: '/v1', strict: true});

};
