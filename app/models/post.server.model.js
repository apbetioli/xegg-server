'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
    media: {
        url: {
            type: String,
            required: 'URL is required'
        },
        contentType: {
            type: String
        }
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
    stats: {
        likes: {
            type: Number,
            default: 1
        },
        comments: {
            type: Number,
            default: 0
        }
    },
    tags: [String]
});

mongoose.model('Post', PostSchema, 'Post');
