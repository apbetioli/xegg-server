'use strict';

var exec = require('exec'),
    errorHandler = require('./errors'),
    mongoose = require('mongoose'),
    Log = mongoose.model('Log'),
    User = mongoose.model('User');

exports.index = function (req, res) {
    res.render('index', {
        user: req.user || null,
        messageType: 'hide'
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

exports.log = function (req, res, next) {

    next();

    if (res.statusCode === 200 || res.statusCode === 304) {
        var log = new Log();
        log.url = req.path;
        log.method = req.method;
        log.save();
    }

};


exports.invite = function (req, res) {
    console.log('Solicitando convite para usuário');
    var email =req.body.email;

    var user = new User();
    user.invite = true;
    user.username = email ;
    user.password = 'conviteSolicitado';
    user.provider = 'local';
    user.email = email;

    user.save(function (err) {
        if (err) {
            res.render('index', {
                messageType: 'alert-warning',
                message: 'Houve um problema na solicitação do convite: ' +  errorHandler.getErrorMessage(err)
            });
        } else {
            res.render('index', {
                messageType: 'alert-success',
                message: 'Convite solicitado com sucesso para o email: ' + email
            });
        }
    });

};
