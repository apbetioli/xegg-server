
var index = require('./index');

var apiPosts = require('./api/posts');

var use = function(app) {

    app.use('/', index);
    app.use('/api/posts', apiPosts);

};

exports.use = use;