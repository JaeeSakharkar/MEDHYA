const express = require('express');
const router = express.Router();
const auth = require('../authMiddleware');
const scoreController = require('../controllers/scoreController');

// Get current user's scores
router.get('/', auth, scoreController.getScores);

// Submit a quiz score
router.post('/', auth, scoreController.submitScore);

module.exports = router;
