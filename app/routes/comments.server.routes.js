'use strict';

var users = require('../../app/controllers/users'),
	posts = require('../../app/controllers/posts'),
    comments = require('../../app/controllers/comments');

module.exports = function(app) {

	app.route('/comments')
		.get(comments.list)
		.post(users.requiresLogin, comments.create);

	app.route('/comments/:commentId')
		.get(comments.read)
		.put(users.requiresLogin, comments.hasAuthorization, comments.update)
		.delete(users.requiresLogin, comments.hasAuthorization, comments.delete);

    app.param('commentId', comments.commentByID);


    app.route('/api/v1/posts/:postId/comments')
        .get(comments.list)
        .post(users.requiresToken, comments.create);

    app.route('/api/v1/posts/:postId/comments/:commentId')
        .get(comments.read)
        .put(users.requiresToken, comments.hasAuthorization, comments.update)
        .delete(users.requiresToken, comments.hasAuthorization, comments.delete);

    app.param('postId', posts.postByID);
};