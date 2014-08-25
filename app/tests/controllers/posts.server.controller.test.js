'use strict';

var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');

var Post = mongoose.model('Post'),
    User = mongoose.model('User'),
    Media = mongoose.model('Media'),
    Tag = mongoose.model('Tag');

var url = 'http://localhost:3001';
var user, post, media, loggedUser;

function clear() {
    Post.remove().exec();
    Tag.remove().exec();
    User.remove().exec();
    Media.remove().exec();
}

function signin(user, done) {
    request(url)
        .post('/auth/signin')
        .send(user)
        .end(function (err, res) {
            if(err)
                throw err;

            loggedUser = res.body;
            should.exist(loggedUser.email);

            done();
        });
}

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
            if(err)
                throw err;

            media.save(function () {

                post = new Post({
                    media: media,
                    user: user,
                    title: 'Bora off road! #automodelismo #offroad',
                    tags: ['automodelismo', 'offroad']
                });

                signin({username:'alexandre', password:'password'}, done);
            });
        });
    });

    describe('Method Post', function () {

        it('should save a post', function (done) {

            request(url)
                .post('/api/v1/posts')
                .set('token', loggedUser.token)
                .send(post)
                .end(function (err, res) {
                    if(err)
                        throw err;

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

        it('should show error of invalid token', function (done) {
            request(url)
                .post('/api/v1/posts')
                .set('token', 'invalid')
                .send(post)
                .expect(401)
                .end(function (err, res) {
                    if(err)
                        throw err;

                    done();
                });
        });

    });

    describe('Method Get', function () {

        it('should get a post', function (done) {

            post.save(function (err) {
                if(err)
                    throw err;

                request(url)
                    .get('/api/v1/posts')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err)
                            throw err;

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
        clear();
        done();
    });
});