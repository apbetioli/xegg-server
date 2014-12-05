'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResultSchema = new Schema({
    _id: Object,
    value: Object
});

mongoose.model('Result', ResultSchema);
