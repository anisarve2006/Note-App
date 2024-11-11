const express = require('express');
const { create, update, read, remove } = require('../components/note');
const router = express.Router();

// Post Routes
router.post('/create', create);
router.post('/update/:id', update);

// Get Routes
router.get('/create', (req, res) => res.render('createNote')); // Adjust path
router.get('/read/:id', read);
router.get('/remove/:id', remove);

module.exports = router;
