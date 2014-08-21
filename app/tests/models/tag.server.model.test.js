'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Tag = mongoose.model('Tag');

var tag, tag2;

describe('Tag Model Unit Tests:', function () {
    beforeEach(function (done) {
        tag = new Tag({
            tag: 'automodelismo'
        });

        tag2 = new Tag({
            tag: 'automodelismo'
        });

        done();
    });

    describe('Method Save', function () {
        it('should be able to save without problems', function (done) {
            return tag.save(function (err) {
                should.not.exist(err);
                should.exist(tag.created);
                done();
            });
        });

        it('should be able to show an error when try to save without name', function (done) {
            tag.tag = '';

            return tag.save(function (err) {
                should.exist(err);
                done();
            });
        });
        /*
        TODO ver pq não passa

        it('should be able to show an error when try to save two equal tags', function (done) {
            tag.save();
            return tag2.save(function (err) {
                should.exist(err);
                done();
            });
        });
        */
    });

    afterEach(function (done) {
        Tag.remove().exec();
        done();
    });
});