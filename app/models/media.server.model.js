'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MediaSchema = new Schema({
    url: {
        type: String,
        required: 'URL is required'
    },
    contentType: {
        type: String,
        required: 'Content type is required'
    }
});

mongoose.model('Media', MediaSchema, 'Media');
