'use strict';

var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');

var Post = mongoose.model('Post'),
    Comment = mongoose.model('Comment'),
    Media = mongoose.model('Media'),
    User = mongoose.model('User');

var url = 'http://localhost:3001';
var user, post, media, comment, loggedUser;

function clear() {
    Comment.remove().exec();
    Post.remove().exec();
    User.remove().exec();
    Media.remove().exec();
}

function signin(user, done) {
    request(url)
        .post('/auth/signin')
        .send(user)
        .end(function (err, res) {
            if (err) throw err;

            loggedUser = res.body;
            should.exist(loggedUser.email);

            done();
        });
}

describe('Comment Controller Test:', function () {

    beforeEach(function (done) {
        clear();

        user = new User({
            email: 'alexandre@test.com',
            username: 'alexandre',
            password: 'password'
        });

        media = new Media({
            media: 'teste',
            contentType: 'image/gif'
        });

        post = new Post({
            media: media,
            user: user,
            title: 'Bora off road! #automodelismo #offroad',
            tags: ['automodelismo', 'offroad']
        });

        comment = new Comment({
            comment: 'cool'
        });

        user.save(function (err) {
            if (err) throw err;

            media.save(function (err) {
                if (err) throw err;

                post.save(function (err) {
                    if (err) throw err;

                    signin({email: 'alexandre@test.com', password: 'password'}, done);
                });
            });
        });
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

                    c.should.have.property('_id');
                    c.comment.should.equal('cool');
                    should.exist(c.created);
                    should.exist(c.post);
                    should.exist(c.user);

                    done();

                });
        });

    });

    describe('Method Get', function () {

        it('should get some comments', function (done) {

            comment.post = post;
            comment.user = user;
            comment.save(function (err) {
                if (err) throw err;

                request(url)
                    .get('/api/v1/posts/' + post._id + '/comments')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err)
                            throw err;

                        var comments = res.body;
                        comments.should.have.length(1);

                        var c = comments[0];

                        c.should.have.property('_id');
                        c.comment.should.equal('cool');
                        should.exist(c.created);
                        should.exist(c.post);
                        should.exist(c.user);

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