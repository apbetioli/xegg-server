'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
    post: {
        type: Schema.ObjectId,
        ref: 'Post'
    },
    comment: {
        type: String,
        trim: true,
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('Comment', CommentSchema, 'Comment');