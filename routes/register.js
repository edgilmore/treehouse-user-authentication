const express = require('express');

const router = express.Router();

// GET /register
router.get('/register', (req, res, next) => res.render('register', {
  title: 'Register',
}));

// POST /register
router.post('/register', (req, res, next) => res.send('User created!'));
