'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ActionSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Schema.ObjectId,
        ref: 'Post',
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    like: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Action', ActionSchema, 'Action');
