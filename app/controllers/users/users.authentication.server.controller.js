'use strict';

var _ = require('lodash'),
    errorHandler = require('../errors'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    crypto = require('crypto'),
    User = mongoose.model('User');

function generateToken() {
    return crypto.randomBytes(16).toString('base64');
}

var authWithToken = function (req, res, next) {

    if (!req.headers.token)
        return next();

    User.findOne({token: req.headers.token}).exec(function (err, user) {
        if (err)
            return next();

        if (!user)
            return next();

        req.login(user, function (err) {
            if (err)
                return next();

            req.user = user;

            return next();
        });
    });


};

exports.authWithToken = authWithToken;

exports.requiresToken = function (req, res, next) {

    if (!req.headers.token)
        return res.status(401).send({
            message: 'Token is required. Please sign in.'
        });

    User.findOne({token: req.headers.token}).exec(function (err, user) {
        if (err)
            return res.status(400).send(err);

        if (!user)
            return res.status(401).send({
                message: 'Invalid token.'
            });

        req.login(user, function (err) {
            if (err)
                return res.status(400).send(err);

            req.user = user;
            req.body.user = user;

            next();
        });
    });
};

exports.signup = function (req, res) {
    delete req.body.roles;

    var user = new User(req.body);
    user.provider = 'local';
    user.token = generateToken();
    user.save(function (err) {
        if (err) {
            user.message = err.message;
            return res.status(400).jsonp(user);
        } else {
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function (err) {
                if (err) {
                    user.message = err.message;
                    res.status(400).jsonp(user);
                } else {
                    res.jsonp(user);
                }
            });
        }
    });
};

exports.signin = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err || !user) {
            user = new User();
            user.message = err !== null ? err.message : (info !== null ? info.message : 'Houve um erro no servidor!');
            res.status(400).jsonp(user);
        } else {

            user.token = generateToken();
            user.save(function (err) {
                if (err) {
                    user.message = err.message;
                    res.status(400).jsonp(user);
                } else {

                    user.password = undefined;
                    user.salt = undefined;

                    req.login(user, function (err) {
                        if (err) {
                            user.message = err.message;
                            res.status(400).jsonp(user);
                        } else {
                            res.jsonp(user);
                        }
                    });
                }
            });


        }
    })(req, res, next);
};

exports.signout = function (req, res) {
    req.logout();
    res.redirect('/');
};

exports.oauthCallback = function (strategy) {
    return function (req, res, next) {
        passport.authenticate(strategy, function (err, user, redirectURL) {
            if (err || !user) {
                return res.redirect('/#!/signin');
            }
            req.login(user, function (err) {
                if (err) {
                    return res.redirect('/#!/signin');
                }

                return res.redirect(redirectURL || '/');
            });
        })(req, res, next);
    };
};

exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
    if (!req.user) {
        // Define a search query fields
        var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
        var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

        // Define main provider search query
        var mainProviderSearchQuery = {};
        mainProviderSearchQuery.provider = providerUserProfile.provider;
        mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // Define additional provider search query
        var additionalProviderSearchQuery = {};
        additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // Define a search query to find existing user with current provider profile
        var searchQuery = {
            $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
        };

        User.findOne(searchQuery, function (err, user) {
            if (err) {
                return done(err);
            } else {
                if (!user) {
                    var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

                    User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
                        user = new User({
                            username: availableUsername,
                            email: providerUserProfile.email,
                            provider: providerUserProfile.provider,
                            providerData: providerUserProfile.providerData
                        });

                        // And save the user
                        user.save(function (err) {
                            return done(err, user);
                        });
                    });
                } else {
                    return done(err, user);
                }
            }
        });
    } else {
        // User is already logged in, join the provider data to the existing user
        var user = req.user;

        // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
        if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
            // Add the provider data to the additional provider data field
            if (!user.additionalProvidersData) user.additionalProvidersData = {};
            user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

            // Then tell mongoose that we've updated the additionalProvidersData field
            user.markModified('additionalProvidersData');

            // And save the user
            user.save(function (err) {
                return done(err, user, '/#!/settings/accounts');
            });
        } else {
            return done(new Error('User is already connected using this provider'), user);
        }
    }
};

exports.removeOAuthProvider = function (req, res, next) {
    var user = req.user;
    var provider = req.param('provider');

    if (user && provider) {
        // Delete the additional provider
        if (user.additionalProvidersData[provider]) {
            delete user.additionalProvidersData[provider];

            // Then tell mongoose that we've updated the additionalProvidersData field
            user.markModified('additionalProvidersData');
        }

        user.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                req.login(user, function (err) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        res.jsonp(user);
                    }
                });
            }
        });
    }
};
