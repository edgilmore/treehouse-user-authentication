
const express = require('express');

const router = express.Router();

// Get Login Page
router.get('/', (req, res) => res.render('login', {
    Title: 'Log In',
}));

// Post Login Page
router.post('/', (req, res) => {

});

module.exports = router;
