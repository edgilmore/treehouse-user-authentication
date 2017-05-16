const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res, next) => {
    if (!req.session.userId) {
        const err = new Error('You are not authorized to view this page.');
        err.status = 403;
        return next(err);
    }
    User.findById(req.session.userId).exec((err, user) => {
        if (err) {
            return next(err);
        }
        return res.render('profile', {
            title: 'Profile',
            name: user.name,
            favorite: user.favoriteBook,
        });
    });
});

module.exports = router;
