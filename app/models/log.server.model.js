'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LogSchema = new Schema({
    url: String,
    method: String,
    date:  {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Log', LogSchema);
