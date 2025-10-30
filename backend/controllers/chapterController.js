const { chapterModel } = require('../models');

/**
 * Get all chapters for a subject.
 */
async function getChapters(req, res) {
  try {
    const { subjectId } = req.params;
    const chapters = await chapterModel.listChapters(subjectId);
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list chapters.' });
  }
}

/**
 * Create chapter.
 */
async function createChapter(req, res) {
  try {
    const { subjectId } = req.params;
    const chapter = req.body;
    const result = await chapterModel.createChapter(subjectId, chapter);
    res.status(201).json(result);
  } catch (err) {
    console.error('Chapter creation error:', err.message);
    res.status(500).json({ error: 'Failed to create chapter.' });
  }
}

/**
 * Update chapter.
 */
async function updateChapter(req, res) {
  try {
    const { subjectId, chapterId } = req.params;
    const updates = req.body;
    const result = await chapterModel.updateChapter(subjectId, chapterId, updates);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update chapter.' });
  }
}

/**
 * Delete chapter.
 */
async function deleteChapter(req, res) {
  try {
    const { subjectId, chapterId } = req.params;
    await chapterModel.deleteChapter(subjectId, chapterId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete chapter.' });
  }
}

module.exports = {
  getChapters,
  createChapter,
  updateChapter,
  deleteChapter
};
