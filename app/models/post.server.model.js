'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
    media: {
        type: Schema.ObjectId,
        ref: 'Media',
        required: 'Media is required'
    },
    title: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: 'User is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 1
    },
    comments: {
        type: Number,
        default: 0
    },
    tags: [String]
});

mongoose.model('Post', PostSchema, 'Post');
