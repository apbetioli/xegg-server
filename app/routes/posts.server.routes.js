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
		.put(users.requiresLogin, posts.hasAuthorization, posts.update)
		.delete(users.requiresLogin, posts.hasAuthorization, posts.delete);

    app.param('postId', posts.postByID);

    app.route('/api/v2/posts')
        .get(posts.list)
        .post(users.requiresToken, posts.create);

    app.route('/api/v2/posts/:postId')
        .get(posts.read)
        .put(users.requiresToken, posts.hasAuthorization, posts.update)
        .delete(users.requiresToken, posts.hasAuthorization, posts.delete);


    //app.route('/api/v1/posts')
    //    .get(posts.setCache);

    restify.serve(app, Post);

};
