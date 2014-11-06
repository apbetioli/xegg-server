'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TagSchema = new Schema({
    tag: {
        type: String,
        trim: true,
        unique: 'Duplicated tag. Please, inform another tag.',
        required: 'Tag is required'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Tag', TagSchema);

