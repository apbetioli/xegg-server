'use strict';

var formidable = require('formidable'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Media = mongoose.model('Media'),
    mmm = require('mmmagic'),
    Magic = mmm.Magic;

exports.upload = function (req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {

        if (err) {
            console.log(err);
            res.writeHead(500, {'content-type': 'text/plain'});
            res.end(err);
            return;
        }

        var file = files.image;

        var magic = new Magic(mmm.MAGIC_MIME_TYPE);
        magic.detectFile(file.path, function (err, type) {

            var media = new Media();
            media.data = fs.readFileSync(file.path);
            media.contentType = type;
            media.save(function (err, saved) {
                if (err)  {
		    console.log(err);
		    res.writeHead(500, {'content-type': 'text/plain'});
		    res.end(err);
		    return;
                }

                fs.unlink(file.path, function (err) {
                    if (err)
                        console.error('ERROR deleting temp file ' + file.path);
                });

                res.writeHead(200, {'content-type': 'text/plain'});
                res.end(req.protocol + '://' + req.get('host') + '/media/' + saved.id);
            });

        });

    });

};

exports.getMediaData = function (req, res) {

    var id = req.params.id;

    Media.findOne({_id: id}, function (err, media) {
        if (err) {
	    console.log(err);
            res.writeHead(500, {'content-type': 'text/plain'});
            res.end(err);
            return;
        }

        res.writeHead(200, {
            'Content-Type': media.contentType,
            'Cache-Control': 'public, max-age=315360000'
        });
        res.end(media.data, 'binary');

    });

};
