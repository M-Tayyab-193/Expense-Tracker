const pool = require('../db');

const createGroup = async (req, res) => {
  const { name, memberEmails } = req.body; 
  const creatorId = req.user.userId;

  try {
    await pool.query('BEGIN');

    // 1. Create the group
    const groupResult = await pool.query(
      `INSERT INTO expensify.groups (name, created_by) VALUES ($1, $2) RETURNING id, name`,
      [name, creatorId]
    );
    const groupId = groupResult.rows[0].id;

    // 2. Resolve emails to user_ids
    const emailQuery = `
      SELECT id FROM expensify.users WHERE email = ANY($1)
    `;
    const result = await pool.query(emailQuery, [memberEmails]);
    const foundUserIds = result.rows.map(row => row.id);

    // 3. Combine with creatorId and remove duplicates
    const allUserIds = Array.from(new Set([...foundUserIds, creatorId]));

    // 4. Insert members into group_members
    const insertQuery = `
      INSERT INTO expensify.group_members (group_id, user_id)
      VALUES ($1, $2)
    `;
    for (const userId of allUserIds) {
      await pool.query(insertQuery, [groupId, userId]);
    }

    await pool.query('COMMIT');
    res.status(201).json({
      message: 'Group created successfully',
      group: {
        id: groupId,
        name,
        members: allUserIds
      }
    });

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error creating group:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserGroups = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `
      SELECT g.id, g.name, g.created_by, g.created_at
      FROM expensify.groups g
      JOIN expensify.group_members gm ON g.id = gm.group_id
      WHERE gm.user_id = $1
      ORDER BY g.created_at DESC
      `,
      [userId]
    );

    res.status(200).json({ groups: result.rows });

  } catch (err) {
    console.error('Error fetching user groups:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createGroup, getUserGroups };
