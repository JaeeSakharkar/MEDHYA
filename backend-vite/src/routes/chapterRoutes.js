import express from 'express';
import { authenticateJWT, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Mock chapter controller functions for now
const chapterController = {
  getChapters: (req, res) => {
    res.json([
      { id: '1', subjectId: req.params.subjectId, title: 'Introduction', description: 'Getting started' },
      { id: '2', subjectId: req.params.subjectId, title: 'Advanced Topics', description: 'Deep dive' }
    ]);
  },
  createChapter: (req, res) => {
    res.json({ success: true, id: Date.now().toString(), ...req.body });
  },
  updateChapter: (req, res) => {
    res.json({ success: true, id: req.params.chapterId, ...req.body });
  },
  deleteChapter: (req, res) => {
    res.json({ success: true });
  }
};

// Get all chapters for a subject (authenticated users)
router.get('/:subjectId', authenticateJWT, chapterController.getChapters);

// Create chapter (Admin only)
router.post('/:subjectId', authenticateJWT, requireAdmin, chapterController.createChapter);

// Update chapter (Admin only)
router.put('/:subjectId/:chapterId', authenticateJWT, requireAdmin, chapterController.updateChapter);

// Delete chapter (Admin only)
router.delete('/:subjectId/:chapterId', authenticateJWT, requireAdmin, chapterController.deleteChapter);

export default router;