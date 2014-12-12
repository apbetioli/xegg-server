'use strict';

var users = require('../../app/controllers/users'),
	tags = require('../../app/controllers/tags');

module.exports = function(app) {

	app.param('tagId', tags.tagByID);

	app.route('/api/v1/tags')
		.get(tags.list);

	app.route('/api/v1/tags/:tagId')
		.get(tags.read);

};
