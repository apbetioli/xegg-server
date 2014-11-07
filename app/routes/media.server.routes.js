'use strict';

var media = require('../../app/controllers/media'),
    users = require('../../app/controllers/users');

module.exports = function(app) {

    app.route('/media/:id')
        .get(media.getMediaData);

    app.route('/upload')
        .get(media.uploadForm)
        .post(media.upload);

    app.route('/api/v2/upload')
        .post(users.requiresToken, media.upload);

};

