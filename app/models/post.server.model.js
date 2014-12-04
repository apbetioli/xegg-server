'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
    url: {
        type: String,
        required: 'URL is required'
    },
    title: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
        //,
        //required: 'User is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    tags: [String]
});

mongoose.model('Post', PostSchema);
