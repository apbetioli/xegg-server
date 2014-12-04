'use strict';

var media = require('../../app/controllers/media'),
    users = require('../../app/controllers/users');

module.exports = function(app) {

    app.route('/media/:id')
        .get(media.getMediaData);

    app.route('/upload')
        .post(users.requiresToken, media.upload);

};

