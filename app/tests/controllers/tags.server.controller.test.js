'use strict';

var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');

var Tag = mongoose.model('Tag');

var url = 'http://localhost:3001';
var tag;

describe('Tag Controller Test:', function() {

    beforeEach(function (done) {
        tag = new Tag({
            tag: 'automodelismo'
        });

        done();
    });

    describe('Method Post', function () {

        it('should return bad request when try to post without tag', function (done) {
            tag.tag = '';

            request(url)
                .post('/api/v1/tags')
                .send(tag)
                .expect(400)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    done();
                });
        });

        it('should save a tag', function(done){

            request(url)
                .post('/api/v1/tags')
                .send(tag)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err,res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.property('_id');
                    res.body.tag.should.equal('automodelismo');
                    res.body.created.should.not.equal(null);
                    done();
                });
        });
    });

    afterEach(function (done) {
        Tag.remove().exec();
        done();
    });
});