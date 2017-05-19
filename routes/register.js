const express = require('express');
const User = require('../models/user');
const mid = require('../middleware/index');

const router = express.Router();

// GET /register
router.get('/', mid.loggedOut, (req, res) => res.render('register', {
    title: 'Sign Up',
    csrf: req.csrfToken(),
}));
// POST /register
router.post('/', (req, res, next) => {
    if (req.body.email &&
    req.body.name &&
    req.body.favoriteBook &&
    req.body.password &&
    req.body.confirmPassword) {
    // confirm that the user typed the same password twice
        if (req.body.password !== req.body.confirmPassword) {
            const err = new Error('Passwords do not match');
            err.status = 400;
            return next(err);
        }
    // add user to database
    // create object
        const userData = {
            email: req.body.email,
            name: req.body.name,
            favoriteBook: req.body.favoriteBook,
            password: req.body.password,
        };
    // insert object to database
        return User.create(userData, (error, user) => {
            if (error) {
                return next(error);
            }
            req.session.userId = user._id;
            return res.redirect('/profile');
        });
    }
    const err = new Error('All fields required.');
    err.status = 400;
    return next(err);
});

module.exports = router;
