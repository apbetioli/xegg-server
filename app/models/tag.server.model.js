'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TagSchema = new Schema({
    tag: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Tag', TagSchema, 'Tag');

