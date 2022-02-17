// top level routes

const express = require('express');
const router = express.Router()

// @desc Login/Landing page
// @route GET /
router.get('/', (req, res) => {
    // looks for templates called dashboard in views folder
    // layout uses login layout from layouts/login
    res.render('login',
        { layout: 'login' })
})

// @desc Dashboard
// @route GET /dashboard
router.get('/dashboard', (req, res) => {
    // looks for templates called dashboard in views folder
    res.render('dashboard');
})


module.exports = router