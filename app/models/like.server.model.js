'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LikeSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        index: true
    },
    post: {
        type: Schema.ObjectId,
        index: true
    }
});

mongoose.model('Like', LikeSchema);
