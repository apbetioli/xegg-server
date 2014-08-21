'use strict';

var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

var user, user2, user3;

describe('User Model Unit Tests:', function() {
	before(function(done) {
		user = new User({
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local'
		});
		user2 = new User({
			email: 'other@mail.com',
			username: 'username',
			password: 'password',
			provider: 'local'
		});
        user3 = new User({
            email: 'test@test.com',
            username: 'otherusername',
            password: 'password',
            provider: 'local'
        });

		done();
	});

	describe('Method Save', function() {
		it('should begin with no users', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			user.save(done);
		});

		it('should fail to save an existing user with the same username', function(done) {
			user.save();
			return user2.save(function(err) {
				should.exist(err);
				done();
			});
		});

        it('should fail to save an existing user with the same email', function(done) {
            user.save();
            return user3.save(function(err) {
                should.exist(err);
                done();
            });
        });

		it('should be able to show an error when try to save without email', function(done) {
			user.email = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

        it('should be able to show an error when try to save without username', function(done) {
            user.username = '';
            return user.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without password', function(done) {
            user.password = '';
            return user.save(function(err) {
                should.exist(err);
                done();
            });
        });
	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});