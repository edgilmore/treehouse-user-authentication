const express = require('express');

const router = express.Router();

// GET /register
router.get('/', (req, res, next) => res.render('register', {
  title: 'Register',
}));
// POST /register
router.post('/', (req, res) => res.send('User created!'));

module.exports = router;
