'use strict';

var users = require('../../app/controllers/users');

module.exports = function(app) {

	var media = require('../../app/controllers/media');

    app.route('/upload').post(users.requiresToken, media.upload);
    app.route('/upload').get(media.uploadForm);
    app.route('/media/:id').get(media.getMediaData);

};

