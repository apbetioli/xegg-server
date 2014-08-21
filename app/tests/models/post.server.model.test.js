'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Tag = mongoose.model('Tag'),
    Media = mongoose.model('Media'),
    Post = mongoose.model('Post');

var user, post, media;

describe('Post Model Unit Tests:', function () {
    beforeEach(function (done) {
        user = new User({
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });

        media = new Media({
            media: 'teste',
            contentType: 'image/gif'
        });

        user.save(function (err) {
            should.not.exists(err);

            media.save(function (err) {
                should.not.exists(err);

                post = new Post({
                    media: media,
                    title: 'Bora off road! #automodelismo #offroad',
                    user: user,
                    tags: ['automodelismo', 'offroad']
                });

                done();
            });
        });
    });

    describe('Method Save', function () {
        it('should be able to save without problems', function (done) {
            return post.save(function (err) {
                should.not.exist(err);
                should.exist(post.created);
                should.exist(post.user);
                post.likes.should.be.equal(1);
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

        it('should show an error when try to save without media', function (done) {
            post.media = '';

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