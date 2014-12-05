'use strict';

var users = require('../../app/controllers/users'),
    posts = require('../../app/controllers/posts'),
    core = require('../../app/controllers/core'),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    restify = require('express-restify-mongoose');

module.exports = function(app) {

    /*
	app.route('/posts')
		.get(posts.list)
		.post(users.requiresLogin, posts.create);

	app.route('/posts/:postId')
		.get(posts.read)
		.put(users.requiresLogin, posts.hasAuthorization, posts.update);

    app.param('postId', posts.postByID);
    */

    /***************************************************/

    app.route('/api/v1/posts')
    	.get(core.log)
        .post(core.log, users.requiresToken, posts.saveTags, posts.create);

    app.route('/api/v1/posts/:id')
    	.get(core.log)
        .put(core.log, users.requiresToken, posts.hasAuthorization)
        .delete(core.log, users.requiresToken, posts.hasAuthorization);

    restify.serve(app, Post, {version: '/v1', strict: true});
};
