'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Comment = mongoose.model('Comment'),
    Media = mongoose.model('Media'),
    Post = mongoose.model('Post');

var postUser, commentUser, post, comment, media;

describe('Comment Model Unit Tests:', function () {
    beforeEach(function (done) {
        postUser = new User({
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });

        commentUser = new User({
            email: 'other@test.com',
            username: 'otherUsername',
            password: 'password'
        });

        media = new Media({
            media: 'teste',
            contentType: 'image/gif'
        });

        postUser.save(function (err) {
            should.not.exists(err);

            media.save(function (err) {
                should.not.exists(err);

                post = new Post({
                    media: media,
                    title: 'Bora off road! #automodelismo #offroad',
                    user: postUser,
                    tags: ['automodelismo', 'offroad']
                });

                post.save(function (err) {
                    should.not.exists(err);

                    comment = new Comment({
                        post: post,
                        comment: 'Fera',
                        user: commentUser
                    });

                    done();
                });

            });


        });
    });

    describe('Method Save', function () {
        it('should be able to save without problems', function (done) {
            return comment.save(function (err) {
                should.not.exist(err);
                should.exist(comment.created);
                done();
            });
        });

        it('should show an error when try to save without post', function (done) {
            comment.post = '';

            return comment.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should show an error when try to save without comment', function (done) {
            comment.comment = '';

            return comment.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should show an error when try to save without user', function (done) {
            comment.user = '';

            return comment.save(function (err) {
                should.exist(err);
                done();
            });
        });


    });

    afterEach(function (done) {
        Comment.remove().exec();
        Post.remove().exec();
        User.remove().exec();
        done();
    });
});