'use strict';

var exec = require('exec'),
    mongoose = require('mongoose'),
    Log = mongoose.model('Log');

var emit = function () {
};

exports.index = function (req, res) {
    res.render('index', {
        user: req.user || null
    });
};

exports.setCache = function (req, res, next) {
    res.header('Cache-Control', 'public, max-age=315360000');
    next();
};

exports.gitPull = function (req, res) {

    console.log('Executando git pull ...');
    console.log(req.body);

    exec('sudo -u ubuntu git pull origin master',
        function (error, stdout, stderr) {
            res.writeHead(200, {'Content-Type': 'text/plain'});

            res.write('stdout: ' + stdout + '\n');
            res.write('stderr: ' + stderr + '\n');
            if (error !== null) {
                res.write('exec error: ' + error);
            }
            res.end();
        });
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
        //console.log('Map reduce took %d ms', stats.processtime);

        next();
    });

};


exports.log = function (req, res, next) {

    next();

    if (res.statusCode === 200 || res.statusCode === 304) {
        var log = new Log();
        log.url = req.path;
        log.method = req.method;
        log.save();
    }

};

exports.dashboard = function (req, res) {

    var query = req.query.query;
    if (!query)
        query = '/api/v1/posts';

    res.render('templates/dashboard', {
        wsUrl: 'ws://' + req.headers.host.replace(':3000', '') + ':4000',
        query: query
    });
};
