var mongoose = require('mongoose');

var StatsSchema = mongoose.Schema({
    date: Date,
    posts_viewed: Number,
    posts_added: Number,
    app_access: Number
});

var Stats = mongoose.model('Stats', StatsSchema, 'Stats');
exports.Stats = Stats;