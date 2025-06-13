const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

const { addPersonalExpense,
        getPersonalExpenses,
        updatePersonalExpense,
        deletePersonalExpense,
        addGroupExpense,
        getGroupExpenses } = require('../controllers/expenseController');

router.post('/personal', authenticateToken, addPersonalExpense);
router.get('/personal/:userId', authenticateToken, getPersonalExpenses);
router.put('/personal/:expenseId', authenticateToken, updatePersonalExpense);
router.delete('/personal/:expenseId', authenticateToken, deletePersonalExpense);

router.post('/group', authenticateToken, addGroupExpense);
router.get('/group', authenticateToken, getGroupExpenses);

module.exports = router;
