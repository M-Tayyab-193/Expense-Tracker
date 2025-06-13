const express = require('express');
const router = express.Router();
const { createGroup, getUserGroups } = require('../controllers/groupController');
const authenticateToken = require('../middleware/authMiddleware');

// Create a group
router.post('/', authenticateToken, createGroup);

// Get all groups for current user
router.get('/', authenticateToken, getUserGroups);

module.exports = router;
