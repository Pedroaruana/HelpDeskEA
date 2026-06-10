const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM helpdesk.tickets ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM helpdesk.tickets WHERE id = $1',
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Chamado não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, description, priority, category, requester, assignee } = req.body;
  if (!title || !requester) {
    return res.status(400).json({ error: 'Título e solicitante são obrigatórios' });
  }
  try {
    const countResult = await pool.query('SELECT COUNT(*) FROM helpdesk.tickets');
    const count = parseInt(countResult.rows[0].count) + 1;
    const id = `TK-${String(count).padStart(3, '0')}`;

    const result = await pool.query(
      `INSERT INTO helpdesk.tickets (id, title, description, priority, category, requester, assignee)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [id, title, description || '', priority || 'medium', category || 'outros', requester, assignee || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  const { title, description, status, priority, category, assignee } = req.body;
  try {
    const result = await pool.query(
      `UPDATE helpdesk.tickets SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        priority = COALESCE($4, priority),
        category = COALESCE($5, category),
        assignee = COALESCE($6, assignee),
        updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [title, description, status, priority, category, assignee, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Chamado não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM helpdesk.tickets WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Chamado não encontrado' });
    res.json({ message: 'Chamado removido' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
