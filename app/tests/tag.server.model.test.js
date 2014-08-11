'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Tag = mongoose.model('Tag');

var user, tag;

describe('Tag Model Unit Tests:', function () {
    beforeEach(function (done) {
        tag = new Tag({
            name: 'automodelismo'
        });

        done();
    });

    describe('Method Save', function () {
        it('should be able to save without problems', function (done) {
            return tag.save(function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without name', function (done) {
            tag.name = '';

            return tag.save(function (err) {
                should.exist(err);
                done();
            });
        });
    });

    afterEach(function (done) {
        Tag.remove().exec();
        done();
    });
});