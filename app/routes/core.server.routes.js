'use strict';

var mongoose = require('mongoose'),
    Result = mongoose.model('Result'),
    restify = require('express-restify-mongoose');

module.exports = function(app) {

	var core = require('../../app/controllers/core');
	
	app.route('/').get(core.index);
	
    app.route('/gitpull')
        .post(core.gitPull)
        .get(core.gitPull);
        
    app.route('/api/v1/results')
    	.get(core.mapReduce, core.log);

    restify.serve(app, Result, {version: '/v1', strict: true});
};

