'use strict';

var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');

var User = mongoose.model('User');

var url = 'http://localhost:3001';
var user;

function clear() {
    User.remove().exec();
}

describe('User Controller Test:', function () {

    beforeEach(function (done) {
        clear();

        user = new User({
            email: 'alexandre@test.com',
            username: 'alexandre',
            password: 'password'
        });

        done();

    });

    describe('Sign in', function () {

        var token = '';

        it('should authenticate and generate a token', function (done) {

            user.save(function (err) {
                if(err)
                    throw err;

                var credentials = {username: 'alexandre', password: 'password'};

                request(url)
                    .post('/auth/signin')
                    .send(credentials)
                    .expect(200)
                    .end(function (err, res) {
                        if(err)
                            throw err;

                        var u = res.body;
                        should.exist(u.token);
                        should.not.exist(u.salt);
                        should.not.exist(u.password);

                        User.findOne({token: u.token}).exec(function(err, user){
                            should.not.exist(err);
                            should.exist(user);

                            user.password.should.not.be.equal('')

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