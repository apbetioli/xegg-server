'use strict';

var users = require('../../app/controllers/users'),
	posts = require('../../app/controllers/posts');

module.exports = function(app) {

    app.param('postId', posts.postByID);

	app.route('/posts')
		.get(posts.list)
		.post(users.requiresLogin, posts.create);

	app.route('/posts/:postId')
		.get(posts.read)
		.put(users.requiresLogin, posts.hasAuthorization, posts.update)
		.delete(users.requiresLogin, posts.hasAuthorization, posts.delete);

    //TODO adequar com novo modelo

    app.route('/api/v1/posts')
        .get(posts.list)
        .post(posts.create);

    app.route('/api/v1/posts/:postId')
        .get(posts.read)
        .put(posts.update)
        .delete(posts.delete);

};