// @desc routes for authentication
const express = require('express');
const passport = require('passport')
const router = express.Router()


// @desc auth with Google strategy in passportjs
// @route GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))


// @desc Google auth Callback
// @route GET /auth/google/callback
// redirects failure to route
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect dashboard.
        res.redirect('/dashboard');
    });


module.exports = router