'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
    post: {
        type: Schema.ObjectId,
        ref: 'Post',
        required: 'Post is required'
    },
    comment: {
        type: String,
        trim: true,
        required: 'Comment is required'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: 'User is required'
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('Comment', CommentSchema, 'Comment');