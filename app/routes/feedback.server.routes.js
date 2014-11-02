'use strict';

var mongoose = require('mongoose'),
    Feedback = mongoose.model('Feedback'),
    restify = require('express-restify-mongoose');

module.exports = function(app) {

    restify.serve(app, Feedback);
};
