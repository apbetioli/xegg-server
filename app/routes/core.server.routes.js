'use strict';

var mongoose = require('mongoose'),
    LogSchema = require('../../app/models/log').LogSchema,
    Result = mongoose.model('Result'),
    restify = require('express-restify-mongoose');

module.exports = function(app) {

	var core = require('../../app/controllers/core');

	app.route('/').get(core.index);
	
    app.route('/gitpull')
        .post(core.gitPull)
        .get(core.gitPull);

    app.route('/dashboard')
        .get(core.dashboard);

    app.route('/api/v1/results')
    	.get(core.mapReduce);

    restify.serve(app, Result, {version: '/v1', strict: true});

    var server = require('http').Server(app);
    var io = require('socket.io')(server);
    server.listen(4000);
    io.on('connection', function (socket) {
        socket.emit('handshake', { hello: 'world' });
        socket.on('query', function (query) {

            core.mapReduce(function(){}, function(){}, function(){

                Result.find(query).exec(function(err, results){

                    if(err)
                        console.log(err);
                    else
                        socket.emit('results', results);
                });

            });

        });

        LogSchema.post('save', function (log) {
            socket.emit('handshake', { log: log });
        });

    });

};

