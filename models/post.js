var mongoose = require('mongoose');

var PostSchema = mongoose.Schema({
    image       : String,
    description : String,
    author      : String,
    language    : String,
    country     : String,
    tag         : String,
    created     : Date
});

PostSchema.pre('save', function(next) {
    this.created = new Date();

    next();

});

var Post = mongoose.model('Post', PostSchema, 'Post');
exports.Post = Post;