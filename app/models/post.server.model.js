'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
    image: {
        type: String,
        default: '',
        trim: true,
        required: 'Image cannot be blank'
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    author: String, //TODO FK
    language: {
        type: String,
        default: 'pt',
        trim: true
    },
    country: {
        type: String,
        default: 'BR',
        trim: true
    },
    tag: String, //TODO FK
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Post', PostSchema, 'Post');