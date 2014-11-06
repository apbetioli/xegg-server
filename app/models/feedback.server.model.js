'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FeedbackSchema = new Schema({
    text: {
        type: String,
        trim: true,
        required: 'Text is required'
    }
});

mongoose.model('Feedback', FeedbackSchema);
