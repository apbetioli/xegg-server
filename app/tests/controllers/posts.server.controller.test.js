'use strict';

var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');

var Post = mongoose.model('Post'),
    Comment = mongoose.model('Comment'),
    User = mongoose.model('User'),
    Tag = mongoose.model('Tag');

var url = 'http://localhost:3001';
var user, post, loggedUser;

function clear() {
    Comment.remove().exec();
    Post.remove().exec();
    Tag.remove().exec();
    User.remove().exec();
}

function signin(user, done) {
    request(url)
        .post('/auth/signin')
        .send(user)
        .end(function (err, res) {
            if (err) throw err;

            loggedUser = res.body;
            should.exist(loggedUser.token);

            done();
        });
}

describe('Post Controller Test:', function () {

    beforeEach(function (done) {
        clear();

        post = new Post({
            url: 'http://some.gif',
            title: '#automodelismo Bora off road! #offroad'
        });

        user = new User({
            email: 'alexandre@test.com',
            username: 'alexandre',
            password: 'password'
        });

        user.save(function (err) {
            if (err) throw err;

            signin({email: 'alexandre@test.com', password: 'password'}, done);
        });
    });

    it('should get unauthorized if the token is invalid', function (done) {
        request(url)
            .post('/api/v1/posts')
            .set('token', 'invalid')
            .send(post)
            .expect(401)
            .end(function (err, res) {
                if (err) throw err;

                done();
            });
    });

    describe('Method Post', function () {

        beforeEach(function (done) {

            request(url)
                .post('/api/v1/posts')
                .set('token', loggedUser.token)
                .send(post)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) throw err;

                    var p = res.body;

                    should.exist(p._id);
                    should.exist(p.created);
                    should.exist(p.user);

                    done();
                });

        });

        it('should create 2 tags', function (done) {

            Tag.find()
                .sort('tag')
                .exec(function (err, tags) {
                    tags.should.have.length(2);
                    tags[0].tag.should.be.equal('automodelismo');
                    tags[1].tag.should.be.equal('offroad');
                    done();
                });

        });

        describe('Method Get', function () {

            it('should get some posts', function (done) {

                request(url)
                    .get('/api/v1/posts')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) throw err;

                        var posts = res.body;
                        posts.should.have.length(1);

                        var p = posts[0];

                        p.should.have.property('_id');
                        p.title.should.equal('#automodelismo Bora off road! #offroad');
                        should.exist(p._id);
                        should.exist(p.created);
                        should.exist(p.user);

                        done();
                    });
            });
        });

        describe('Comment Controller Test', function () {

            var comment;

            beforeEach(function (done) {

                comment = new Comment({
                    comment: 'cool'
                });

                done();
            });

            describe('Method Post', function () {

                it('should save a comment', function (done) {

                    request(url)
                        .post('/api/v1/posts/' + post._id + '/comments')
                        .set('token', loggedUser.token)
                        .send(comment)
                        .end(function (err, res) {
                            if (err) throw err;

                            var c = res.body;

                            should.exist(c._id);
                            should.exist(c.created);
                            should.exist(c.post);
                            should.exist(c.user);
                            c.comment.should.equal('cool');

                            done();

                        });
                });

            });

        });
    });

    afterEach(function (done) {
        clear();
        done();
    });
});
