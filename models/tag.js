var mongoose = require('mongoose');

var TagSchema = mongoose.Schema({
	name      : String,
	image     : String,
	language  : String,
	country   : String,
	created   : Date
});

TagSchema.pre('save', function(next) {
    this.created = new Date();

    next();
});

var Tag = mongoose.model('Tag', TagSchema, 'Tag')
exports.Tag = Tag;