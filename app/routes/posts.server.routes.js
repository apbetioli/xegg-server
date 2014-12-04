'use strict';

var users = require('../../app/controllers/users'),
	posts = require('../../app/controllers/posts'),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    restify = require('express-restify-mongoose');

module.exports = function(app) {

	app.route('/posts')
		.get(posts.list)
		.post(users.requiresLogin, posts.create);

	app.route('/posts/:postId')
		.get(posts.read)
		.put(users.requiresLogin, posts.hasAuthorization, posts.update);

    app.param('postId', posts.postByID);


    /***************************************************/

    app.route('/api/v1/posts')
        .post(users.requiresToken, posts.saveTags);

    app.route('/api/v1/posts/:id')
        .put(users.requiresToken, posts.hasAuthorization)
        .delete(users.requiresToken, posts.hasAuthorization);

    restify.serve(app, Post, {version: '/v1', strict: true});
};
