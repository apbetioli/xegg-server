
var index = require('./index');


var configure = function(app) {

    app.use('/', index);

};

exports.configure = configure;