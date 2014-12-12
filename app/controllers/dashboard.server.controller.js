'use strict';

var mongoose = require('mongoose'),
    Log = mongoose.model('Log'),
    httpPort = process.env.PORT || 3000;

var emit = function () {
    /* Somente para não dar erro no mapreduce */
};

exports.mapReduce = function (req, res, next) {

    var mr = {};

    mr.map = function () {
        var day = Date.UTC(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
        emit({url: this.url, date: new Date(day)}, {count: 1});
    };

    mr.reduce = function (key, values) {
        var count = 0;

        for (var v in values) {
            count += values[v].count;
        }

        return {count: count};
    };

    mr.out = {replace: 'results'};

    var two_weeks_ago = new Date(Date.now() - 60 * 60 * 24 * 14 * 1000);
    mr.query = {date: {'$gt': two_weeks_ago}};

    mr.verbose = true;

    Log.mapReduce(mr, function (err, model, stats) {
        if (err) {
            res.end('Erro');
            return;
        }

        next();
    });

};

var port = function() {
    var port = parseInt(httpPort) + 1;
    console.log('ws port ' + port);
    return port;
};

exports.port = port;

exports.dashboard = function (req, res) {

    var query = req.query.query;
    if (!query)
        query = '/api/v1/posts';

    var wsUrl = 'ws://' + req.headers.host.replace(':' + httpPort, '') + ':' + port();
    console.log(wsUrl);

    res.render('templates/dashboard', {
        wsUrl: wsUrl,
        query: query
    });
};
