const express = require('express');
const router = express.Router();
const { authenticateJWT, requireAdmin } = require('../authMiddleware');

// Get user profile (authenticated user)
router.get('/profile', authenticateJWT, (req, res) => {
  // Return user info from JWT token
  const user = {
    id: req.user.sub,
    email: req.user.email,
    name: req.user.name || req.user.email,
    groups: req.user['cognito:groups'] || []
  };
  res.json(user);
});

// Get all users (Admin only)
router.get('/', authenticateJWT, requireAdmin, (req, res) => {
  // This would typically fetch from a database
  // For now, return mock data or implement with Cognito Admin SDK
  res.json([
    {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      groups: ['Admin'],
      status: 'CONFIRMED'
    },
    {
      id: '2',
      email: 'user@example.com',
      name: 'Regular User',
      groups: [],
      status: 'CONFIRMED'
    }
  ]);
});

// Get specific user (Admin only)
router.get('/:id', authenticateJWT, requireAdmin, (req, res) => {
  const { id } = req.params;
  // This would typically fetch from a database
  res.json({
    id,
    email: 'user@example.com',
    name: 'User Name',
    groups: [],
    status: 'CONFIRMED'
  });
});

module.exports = router;