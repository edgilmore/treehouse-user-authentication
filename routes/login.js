const express = require('express');
const User = require('../models/user');

const router = express.Router();

// Get Login Page
router.get('/', (req, res) => res.render('login', {
    Title: 'Log In',
}));

// Post Login Page
router.post('/', (req, res, next) => {
    if (req.body.email && req.body.password) {
        User.authenticate(req.body.email, req.body.password, (error, user) => {
            if (error || !user) {
                const err = new Error('Wrong email for password.');
                err.status = 401;
                return next(err);
            }
            req.session.userId = user._id;
            return res.redirect('/profile');
        });
    }
    const err = new Error('Email and Password fields are required.');
    err.status = 400;
    return next(err);
});

module.exports = router;
