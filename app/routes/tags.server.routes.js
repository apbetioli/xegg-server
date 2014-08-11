'use strict';

var users = require('../../app/controllers/users'),
	tags = require('../../app/controllers/tags');

module.exports = function(app) {
	app.route('/tags')
		.get(tags.list)
		.post(users.requiresLogin, tags.create);

	app.route('/tags/:tagId')
		.get(tags.read)
		.put(users.requiresLogin, tags.hasAuthorization, tags.update)
		.delete(users.requiresLogin, tags.hasAuthorization, tags.delete);

	app.param('tagId', tags.tagByID);

    app.route('/api/v1/tags')
        .get(tags.list)
        .post(tags.create);

    app.route('/tags/:tagId')
        .get(tags.read)
        .put(tags.update)
        .delete(tags.delete);
};