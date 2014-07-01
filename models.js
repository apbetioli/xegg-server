var mongoose = require('mongoose');

var TagSchema = mongoose.Schema({
    name: String,
    image: String,
    created: Date
});

TagSchema.pre('save', function(next) {
    this.created = new Date();

    next();
});

var Tag = mongoose.model('Tag', TagSchema, 'Tag')
exports.Tag = Tag;

var PostSchema = mongoose.Schema({
    image: String,
    description: String,
    author: String,
    language: String,
    tag: String,
    created: Date
});

PostSchema.pre('save', function(next) {
    this.created = new Date();

    next();

});

var Post = mongoose.model('Post', PostSchema, 'Post');
exports.Post = Post;

var StatsSchema = mongoose.Schema({
    date: Date,
    posts_viewed: Number,
    posts_added: Number,
    app_access: Number
});

var Stats = mongoose.model('Stats', StatsSchema, 'Stats');
exports.Stats = Stats;
