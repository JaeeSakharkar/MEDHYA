// Chapter Model: MongoDB version using Mongoose
const Chapter = require('../schemas/Chapter');

/**
 * List all chapters for a subject
 */
async function listChapters(subjectId) {
  try {
    const chapters = await Chapter.find({ subjectId }).sort({ createdAt: -1 });
    // Transform data to match frontend expectations
    return chapters.map(c => ({
      id: c.id,
      title: c.name, // Frontend expects 'title', backend stores 'name'
      description: c.description,
      order: c.order || 0,
      subjectId: c.subjectId,
      createdAt: c.createdAt
    }));
  } catch (error) {
    throw new Error(`Failed to list chapters: ${error.message}`);
  }
}

/**
 * Create a chapter under a subject.
 */
async function createChapter(subjectId, chapter) {
  try {
    const newChapter = new Chapter({
      id: chapter.id || `chapter-${Date.now()}`, // Generate ID if not provided
      subjectId,
      name: chapter.name || chapter.title, // Handle both 'name' and 'title'
      description: chapter.description,
      order: chapter.order || 0,
      createdAt: new Date()
    });
    const savedChapter = await newChapter.save();
    
    // Return in frontend-expected format
    return {
      id: savedChapter.id,
      title: savedChapter.name, // Frontend expects 'title'
      description: savedChapter.description,
      order: savedChapter.order || 0,
      subjectId: savedChapter.subjectId,
      createdAt: savedChapter.createdAt
    };
  } catch (error) {
    throw new Error(`Failed to create chapter: ${error.message}`);
  }
}

/**
 * Get a chapter by id
 */
async function getChapter(subjectId, chapterId) {
  try {
    const chapter = await Chapter.findOne({ subjectId, id: chapterId });
    return chapter;
  } catch (error) {
    throw new Error(`Failed to get chapter: ${error.message}`);
  }
}

/**
 * Update chapter
 */
async function updateChapter(subjectId, chapterId, updates) {
  try {
    const updatedChapter = await Chapter.findOneAndUpdate(
      { subjectId, id: chapterId },
      {
        name: updates.name || updates.title, // Handle both formats
        description: updates.description,
        order: updates.order,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedChapter) return null;
    
    // Return in frontend-expected format
    return {
      id: updatedChapter.id,
      title: updatedChapter.name,
      description: updatedChapter.description,
      order: updatedChapter.order || 0,
      subjectId: updatedChapter.subjectId,
      createdAt: updatedChapter.createdAt
    };
  } catch (error) {
    throw new Error(`Failed to update chapter: ${error.message}`);
  }
}

/**
 * Delete chapter
 */
async function deleteChapter(subjectId, chapterId) {
  try {
    await Chapter.findOneAndDelete({ subjectId, id: chapterId });
    return true;
  } catch (error) {
    throw new Error(`Failed to delete chapter: ${error.message}`);
  }
}

module.exports = {
  listChapters,
  createChapter,
  getChapter,
  updateChapter,
  deleteChapter
};