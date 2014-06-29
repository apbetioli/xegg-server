var createModels = function (mongoose){

	var Post = mongoose.Schema({
        image       : String,
        description : String,
        author      : String,
        language    : String,
        tag         : String,
        created     : Date
    });

	var Tag = mongoose.Schema({
		name      : String,
		image     : String,
        created   : Date
	});

    var Stats = mongoose.Schema({
        date         : Date,
        posts_viewed : Number,
        posts_added  : Number,
        app_access   : Number
    });

	exports.Post  =Post;
	exports.Tag   =Tag;
    exports.Stats =Stats;
}

exports.createModels=createModels;
