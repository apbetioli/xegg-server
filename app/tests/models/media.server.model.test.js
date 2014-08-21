'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Media = mongoose.model('Media');

var media;

describe('Media Model Unit Tests:', function () {
    beforeEach(function (done) {
        media = new Media({
            media: 'teste',
            contentType: 'image/gif'
        });

        done();
    });

    describe('Method Save', function () {
        it('should be able to save without problems', function (done) {
            return media.save(function (err) {
                should.not.exist(err);
                should.exist(media.created);
                done();
            });
        });

        it('should be able to show an error when try to save without media', function (done) {
            media.media = '';

            return media.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without content type', function (done) {
            media.contentType = '';

            return media.save(function (err) {
                should.exist(err);
                done();
            });
        });
    });

    afterEach(function (done) {
        Media.remove().exec();
        done();
    });
});