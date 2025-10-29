const express = require('express');
const router = express.Router();
const auth = require('../authMiddleware');
const chapterController = require('../controllers/chapterController');

// Get all chapters for a subject
router.get('/:subjectId', auth, chapterController.getChapters);

// Create chapter
router.post('/:subjectId', auth, chapterController.createChapter);

// Update chapter
router.put('/:subjectId/:chapterId', auth, chapterController.updateChapter);

// Delete chapter
router.delete('/:subjectId/:chapterId', auth, chapterController.deleteChapter);

module.exports = router;
