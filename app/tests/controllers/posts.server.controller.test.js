'use strict';

var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');

var Post = mongoose.model('Post'),
    User = mongoose.model('User'),
    Media = mongoose.model('Media'),
    Tag = mongoose.model('Tag');

var url = 'http://localhost:3001';
var user, post, media;

//TODO autenticar user para funcionar a regra do usuario

describe('Post Controller Test:', function () {

    beforeEach(function (done) {
        user = new User({
            email: 'alexandre@test.com',
            username: 'alexandre',
            password: 'password'
        });

        media = new Media({
            media: 'teste',
            contentType: 'image/gif'
        });

        user.save(function (err) {
            should.not.exists(err);

            media.save(function () {

                post = new Post({
                    media: media,
                    title: 'Bora off road! #automodelismo #offroad',
                    tags: ['automodelismo', 'offroad']
                });

                done();
            });
        });
    });

    describe('Method Post', function () {

        it('should save a post', function (done) {

            request(url)
                .post('/api/v1/posts')
                .send(post)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    var p = res.body;

                    p.should.have.property('_id');
                    p.title.should.equal('Bora off road! #automodelismo #offroad');
                    should.exist(p.created);
                    should.exist(p.media);
                    should.exist(p.user);

                    Tag.find({}, function (err, tags) {
                        tags.should.have.length(2);
                        done();
                    });

                });
        });
    });

    describe('Method Get', function () {

        it('should get a post', function (done) {

            post.save(function (err) {
                should.not.exist(err);

                request(url)
                    .get('/api/v1/posts')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        var posts = res.body;
                        posts.should.have.length(1);

                        var p = posts[0];

                        p.should.have.property('_id');
                        p.title.should.equal('Bora off road! #automodelismo #offroad');
                        should.exist(p.created);
                        should.exist(p.media);
                        should.exist(p.user);

                        done();
                    });
            });
        });
    });


    afterEach(function (done) {
        Post.remove().exec();
        Tag.remove().exec();
        User.remove().exec();
        Media.remove().exec();
        done();
    });
});