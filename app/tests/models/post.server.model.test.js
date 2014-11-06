'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Tag = mongoose.model('Tag'),
    Post = mongoose.model('Post');

var user, post;

describe('Post Model Unit Tests:', function () {
    beforeEach(function (done) {
        user = new User({
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });


        user.save(function (err) {
            should.not.exists(err);

                post = new Post({
                    url: 'teste',
                    title: 'Bora off road! #automodelismo #offroad',
                    user: user,
                    tags: ['automodelismo', 'offroad']
                });

                done();
        });
    });

    describe('Method Save', function () {
        it('should be able to save without problems', function (done) {
            return post.save(function (err) {
                should.not.exist(err);
                should.exist(post.created);
                should.exist(post.user);
                done();
            });
        });

        it('should be able to save without title', function (done) {
            post.title = '';

            return post.save(function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to save without tags', function (done) {
            post.tags = [];

            return post.save(function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('should show an error when try to save without user', function (done) {
            post.user = '';

            return post.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should show an error when try to save without url', function (done) {
            post.url = '';

            return post.save(function (err) {
                should.exist(err);
                done();
            });
        });

    });

    afterEach(function (done) {
        Post.remove().exec();
        User.remove().exec();
        Tag.remove().exec();
        done();
    });
});
