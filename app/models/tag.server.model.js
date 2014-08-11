'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TagSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true,
        required: 'Name cannot be blank'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Tag', TagSchema, 'Tag');