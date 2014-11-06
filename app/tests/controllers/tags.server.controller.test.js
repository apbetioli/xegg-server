'use strict';

var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');

var Tag = mongoose.model('Tag');

var prefix = '/api/v1';
var url = 'http://localhost:3001';
var tag;

function clear() {
    Tag.remove().exec();
}

describe('Tag Controller Test:', function() {

    beforeEach(function (done) {
        clear();

        tag = new Tag({
            tag: 'automodelismo'
        });

        tag.save();

        done();
    });

    describe('Method Get', function () {

        it('should return some tags', function (done) {

            request(url)
                .get(prefix + '/tags')
                .expect(200)
                .expect('Content-type', 'application/json; charset=utf-8')
                .end(function (err, res) {
                    if (err) throw err;

                    var tags = res.body;
                    (1).should.be.equal(tags.length);
                    tags[0].tag.should.be.equal('automodelismo');

                    done();
                });
        });

        it('should return one tags', function (done) {

            request(url)
                .get(prefix + '/tags/' + tag._id)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) throw err;

                    var newTag = res.body;
                    should.exist(newTag);
                    newTag.tag.should.be.equal('automodelismo');

                    done();
                });
        });
    });

    afterEach(function (done) {
        clear();
        done();
    });
});
