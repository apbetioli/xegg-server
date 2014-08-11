'use strict';

var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Post = mongoose.model('Post');

var user, post;

describe('Post Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() {
			post = new Post({
                image: 'http://upload.wikimedia.org/wikipedia/commons/0/04/Automodelo_rc_combustao_off_road_monster_truck.jpg',
                description: 'Bora off road!',
                author: user.email,
                language: 'pt',
                country: 'BR',
                tag: 'automodelismo'
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return post.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without image', function(done) {
			post.image = '';

			return post.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Post.remove().exec();
		User.remove().exec();
		done();
	});
});