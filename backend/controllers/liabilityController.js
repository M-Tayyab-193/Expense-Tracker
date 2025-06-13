const pool = require('../db');

const getUserLiabilities = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT l.*, 
              u1.email AS from_email,
              u2.email AS to_email,
              g.name AS group_name
       FROM expensify.liabilities l
       JOIN expensify.users u1 ON l.from_user_id = u1.id
       JOIN expensify.users u2 ON l.to_user_id = u2.id
       JOIN expensify.groups g ON l.group_id = g.id
       WHERE l.from_user_id = $1 OR l.to_user_id = $1
       ORDER BY l.date DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching liabilities:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const settleLiability = async (req, res) => {
  const { liabilityId } = req.params;
  const { amount } = req.body;
  const userId = req.user.userId;

  try {
    await pool.query('BEGIN');

    // 1. Get liability
    const liabilityResult = await pool.query(
      `SELECT * FROM expensify.liabilities WHERE id = $1`,
      [liabilityId]
    );

    if (liabilityResult.rowCount === 0) {
      return res.status(404).json({ error: 'Liability not found' });
    }

    const liability = liabilityResult.rows[0];

    if (liability.from_user_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to settle this liability' });
    }

    // 2. Log settlement
    await pool.query(
      `INSERT INTO expensify.settlements 
        (liability_id, paid_by, amount)
       VALUES ($1, $2, $3)`,
      [liabilityId, userId, amount]
    );

    // 3. Calculate new amount
    const newAmount = parseFloat(liability.amount) - parseFloat(amount);

    if (newAmount <= 0) {
      // fully paid, mark settled
      await pool.query(
        `UPDATE expensify.liabilities
         SET amount = 0, is_settled = TRUE
         WHERE id = $1`,
        [liabilityId]
      );
    } else {
      // update remaining amount
      await pool.query(
        `UPDATE expensify.liabilities
         SET amount = $1
         WHERE id = $2`,
        [newAmount, liabilityId]
      );
    }

    await pool.query('COMMIT');
    res.status(200).json({ message: 'Liability updated successfully' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error settling liability:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserSettlements = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT s.*, 
              l.from_user_id, l.to_user_id,
              u1.email AS from_email,
              u2.email AS to_email,
              g.name AS group_name
       FROM expensify.settlements s
       JOIN expensify.liabilities l ON s.liability_id = l.id
       JOIN expensify.users u1 ON l.from_user_id = u1.id
       JOIN expensify.users u2 ON l.to_user_id = u2.id
       JOIN expensify.groups g ON l.group_id = g.id
       WHERE s.paid_by = $1 OR l.to_user_id = $1
       ORDER BY s.date DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching settlements:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = { getUserLiabilities, settleLiability, getUserSettlements };
