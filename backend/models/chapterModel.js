// Chapter Model: CRUD for chapters stored under a subject in DynamoDB
const ddbDoc = require('../db');
const TableName = process.env.DYNAMODB_TABLE;

/**
 * List all chapters for a subject
 */
async function listChapters(subjectId) {
  const params = {
    TableName,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `SUBJECT#${subjectId}`,
      ':sk': 'CHAPTER#'
    }
  };
  const { Items } = await ddbDoc.query(params);
  return Items;
}

/**
 * Create a chapter under a subject.
 */
async function createChapter(subjectId, chapter) {
  const item = {
    PK: `SUBJECT#${subjectId}`,
    SK: `CHAPTER#${chapter.id}`,
    ...chapter,
    createdAt: Date.now()
  };
  await ddbDoc.put({ TableName, Item: item });
  return item;
}

/**
 * Get a chapter by id
 */
async function getChapter(subjectId, chapterId) {
  const params = {
    TableName,
    Key: { PK: `SUBJECT#${subjectId}`, SK: `CHAPTER#${chapterId}` }
  };
  const { Item } = await ddbDoc.get(params);
  return Item;
}

/**
 * Update chapter
 */
async function updateChapter(subjectId, chapterId, updates) {
  const params = {
    TableName,
    Key: { PK: `SUBJECT#${subjectId}`, SK: `CHAPTER#${chapterId}` },
    UpdateExpression: 'set name = :n, description = :d',
    ExpressionAttributeValues: {
      ':n': updates.name,
      ':d': updates.description
    },
    ReturnValues: 'ALL_NEW'
  };
  const { Attributes } = await ddbDoc.update(params);
  return Attributes;
}

/**
 * Delete chapter
 */
async function deleteChapter(subjectId, chapterId) {
  await ddbDoc.delete({
    TableName,
    Key: { PK: `SUBJECT#${subjectId}`, SK: `CHAPTER#${chapterId}` }
  });
  return true;
}

module.exports = {
  listChapters,
  createChapter,
  getChapter,
  updateChapter,
  deleteChapter
};
