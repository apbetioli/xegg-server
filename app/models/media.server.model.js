'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MediaSchema = new Schema({
    media: {
        type: Buffer,
        required: 'Media is required'
    },
    contentType: {
        type: String,
        required: 'Content type is required'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Media', MediaSchema, 'Media');
