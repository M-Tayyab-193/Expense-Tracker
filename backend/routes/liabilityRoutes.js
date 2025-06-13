const express = require('express');
const router = express.Router();
const { getUserLiabilities, settleLiability, getUserSettlements } = require('../controllers/liabilityController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getUserLiabilities);
router.post('/:liabilityId/settle', authenticateToken, settleLiability);
router.get('/settlements', authenticateToken, getUserSettlements);

module.exports = router;
