const express = require('express');
const router = express.Router();
const { authenticateJWT, requireAdmin } = require('../authMiddleware');
const chapterController = require('../controllers/chapterController');

// Get all chapters for a subject (authenticated users)
router.get('/:subjectId', authenticateJWT, chapterController.getChapters);

// Create chapter (Admin only)
router.post('/:subjectId', authenticateJWT, requireAdmin, chapterController.createChapter);

// Update chapter (Admin only)
router.put('/:subjectId/:chapterId', authenticateJWT, requireAdmin, chapterController.updateChapter);

// Delete chapter (Admin only)
router.delete('/:subjectId/:chapterId', authenticateJWT, requireAdmin, chapterController.deleteChapter);

module.exports = router;
