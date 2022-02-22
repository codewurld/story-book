// top level routes

const express = require('express');
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth');

const Story = require('../models/Story')

// @desc Login/Landing page
// @route GET /
router.get('/', ensureGuest, (req, res) => {
    // looks for templates called dashboard in views folder
    // layout uses login layout from layouts/login
    res.render('login',
        { layout: 'login' })
})

// @desc Dashboard
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {

    try {
        const stories = await Story.find({ user: req.user.id }).lean()

        res.render('dashboard', {
            name: req.user.firstName,
            stories
        });
    } catch (err) {
        console.error(err);
        res.render('error/500')
    }

    // looks for templates called dashboard in views folder

})


module.exports = router