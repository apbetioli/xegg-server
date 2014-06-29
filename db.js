var models = require('./models');
var mongoose = require('mongoose');

var dbhost = process.env.OPENSHIFT_MONGODB_DB_HOST || "127.0.0.1";
var dbport = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;

var connectDevelopment = function () {
    mongoose.connect('mongodb://' + dbhost + ':' + dbport + '/x-egg', function (errLocal) {
        if (errLocal) {
            console.log("mongoose connect error: " + errLocal);
            console.log("mongoose connect  " + "mongodb://" + dbhost + ":" + dbport + "/xegg");
        } else {
            console.log("mongoose connected development");
        }
    });
}

var connectOpenshift = function () {
    mongoose.connect('mongodb://admin:EptglreXKwDi@' + dbhost + ':' + dbport + '/xegg', function (err) {
        if (err) {
            console.log("process.env.OPENSHIFT_DB_HOST - " + dbhost);
            console.log("process.env.OPENSHIFT_DB_PORT - " + dbport);
            console.log("mongoose connect error: " + err);

            connectDevelopment();
        } else {
            console.log("mongoose connected openshift");
        }
    });
}

var connect = function () {
    if (dbhost === '127.0.0.1')
        connectDevelopment();
    else
        connectOpenshift();
}

connect();

new models.createModels(mongoose);

exports.Post = mongoose.model('Post', models.Post, 'Post');
exports.Tag = mongoose.model('Tag', models.Tag, 'Tag');

exports.db = mongoose.connection.db;
exports.mongoose = mongoose;









