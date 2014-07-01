var mongoose = require('mongoose');

var connectMongo = function (connection_string) {
    mongoose.connect('mongodb://' + connection_string, function (err) {
        if (err) {
            console.log("mongoose connect error: " + err);
            console.log("connection_string: " + connection_string);
        } else {
            console.log("mongoose connected: " + connection_string);
        }
    });

}

var connect = function () {

    var connection_string = '127.0.0.1:27017/xegg';

    if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
        connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
            process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
            process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
            process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
            process.env.OPENSHIFT_APP_NAME;
    }

    connectMongo(connection_string);
}

connect();

exports.db = mongoose.connection.db;









