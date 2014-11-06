'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MediaSchema = new Schema({
    contentType: {
        type: String,
        required: true
    },
    data: {
        type: Buffer,
        required: true
    }
});

mongoose.model('Media', MediaSchema);
