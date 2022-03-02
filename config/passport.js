const mongoose = require('mongoose');
const User = require('../models/User');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// connects Google Auth to passport
module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://my-story-vault.herokuapp.com/auth/google/callback"
        // callbackURL: "http://localhost:8084/auth/google/callback"
    },

        async (accessToken, refreshToken, profile, callback) => {
            // gets user info from google profile
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value
            }

            try {
                // looks for user in DB
                let user = await User.findOne({ goggleId: profile.id });

                if (user) {
                    callback(null, user);
                }
                // creates user in DB if user don't already exist
                else {
                    user = await User.create(newUser);
                    callback(null, user)
                }
            } catch (err) {
                console.error(err)
            }

        }


    ));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    })

}