'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MediaSchema = new Schema({
    media: {
        type: Buffer,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Media', MediaSchema, 'Media');
