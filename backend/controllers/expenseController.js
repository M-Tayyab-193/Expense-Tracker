const pool = require('../db');

const buildExpenseFilterQuery = ({ userId, isPersonal, title, start_date, end_date }) => {
  let baseQuery = `
    SELECT e.*, ${isPersonal ? '' : 'g.name AS group_name'}
    FROM expensify.expenses e
    ${isPersonal ? '' : 'JOIN expensify.groups g ON e.group_id = g.id'}
    WHERE e.user_id = $1 AND e.is_personal = $2
  `;

  const values = [userId, isPersonal];
  let count = 3;

  if (title) {
    baseQuery += ` AND LOWER(e.title) LIKE $${count}`;
    values.push(`%${title.toLowerCase()}%`);
    count++;
  }

  if (start_date) {
    baseQuery += ` AND e.date >= $${count}`;
    values.push(start_date);
    count++;
  }

  if (end_date) {
    baseQuery += ` AND e.date <= $${count}`;
    values.push(end_date);
    count++;
  }

  baseQuery += ` ORDER BY e.date DESC`;

  return { query: baseQuery, values };
};


// Add personal expense
const addPersonalExpense = async (req, res) => {
  const { amount, title, date } = req.body;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `INSERT INTO expensify.expenses 
        (user_id, group_id, amount, title, date, is_personal)
       VALUES ($1, NULL, $2, $3, $4, TRUE)
       RETURNING *`,
      [userId, amount, title, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log('Error adding personal expense:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get personal expenses by user
const getPersonalExpenses = async (req, res) => {
  const userId = req.user.userId;
  const { title, start_date, end_date } = req.query;

  try {
    const { query, values } = buildExpenseFilterQuery({
      userId,
      isPersonal: true,
      title,
      start_date,
      end_date
    });

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching personal expenses:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update personal expense
const updatePersonalExpense = async (req, res) => {
  const { expenseId } = req.params;
  const { title, amount, date } = req.body;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `UPDATE expensify.expenses
       SET title = $1, amount = $2, date = $3
       WHERE id = $4 AND user_id = $5 AND is_personal = TRUE
       RETURNING *`,
      [title, amount, date, expenseId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Expense not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating expense:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete personal expense
const deletePersonalExpense = async (req, res) => {
  const { expenseId } = req.params;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `DELETE FROM expensify.expenses
       WHERE id = $1 AND user_id = $2 AND is_personal = TRUE`,
      [expenseId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Expense not found or unauthorized' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Error deleting expense:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add group expense and split liabilities
const addGroupExpense = async (req, res) => {
  const { groupId, title, amount, date } = req.body;
  const paidBy = req.user.userId;

  try {
    await pool.query('BEGIN');

    // 1. Add expense
    const expenseResult = await pool.query(
      `INSERT INTO expensify.expenses 
        (user_id, group_id, title, amount, date, is_personal) 
       VALUES ($1, $2, $3, $4, $5, FALSE)
       RETURNING id`,
      [paidBy, groupId, title, amount, date]
    );
    const expenseId = expenseResult.rows[0].id;

    // 2. Get group members
    const membersResult = await pool.query(
      `SELECT user_id FROM expensify.group_members WHERE group_id = $1`,
      [groupId]
    );
    const memberIds = membersResult.rows.map(row => row.user_id);
    const share = parseFloat((amount / memberIds.length).toFixed(2));

    // 3. Add liabilities
    for (const memberId of memberIds) {
      if (memberId !== paidBy) {
        await pool.query(
          `INSERT INTO expensify.liabilities 
            (from_user_id, to_user_id, group_id, amount, date, note)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [memberId, paidBy, groupId, share, date, `Split of '${title}'`]
        );
      }
    }

    await pool.query('COMMIT');
    res.status(201).json({ message: 'Group expense added and split successfully.' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error adding group expense:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getGroupExpenses = async (req, res) => {
  const userId = req.user.userId;
  const { title, start_date, end_date } = req.query;

  try {
    const { query, values } = buildExpenseFilterQuery({
      userId,
      isPersonal: false,
      title,
      start_date,
      end_date
    });

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching group expenses:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addPersonalExpense,
  getPersonalExpenses,
  updatePersonalExpense,
  deletePersonalExpense,
  addGroupExpense,
  getGroupExpenses
};
