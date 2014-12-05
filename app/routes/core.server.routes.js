'use strict';

module.exports = function(app) {

	var core = require('../../app/controllers/core');
	app.route('/').get(core.index);
    app.route('/gitpull')
        .post(core.gitPull)
        .get(core.gitPull);
        
        app.route('/dashboard').get(core.dashboard);

};

