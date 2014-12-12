'use strict';

var mongoose = require('mongoose'),
    LogSchema = require('../../app/models/log').LogSchema,
    Result = mongoose.model('Result'),
    restify = require('express-restify-mongoose');

module.exports = function(app) {

	var dashboard = require('../../app/controllers/dashboard');

    app.route('/dashboard')
        .get(dashboard.dashboard);

    app.route('/api/v1/results')
    	.get(dashboard.mapReduce);

    restify.serve(app, Result, {version: '/v1', strict: true});

    var server = require('http').Server(app);
    var io = require('socket.io')(server);
    server.listen(dashboard.port());
    io.on('connection', function (socket) {
        socket.emit('handshake', { hello: 'world' });
        socket.on('query', function (query) {

            dashboard.mapReduce(function(){}, function(){}, function(){

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

