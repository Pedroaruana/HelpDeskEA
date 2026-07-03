const express = require('express');
const rateLimit = require('express-rate-limit');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

pool.query(`ALTER TABLE helpdesk.tickets ADD COLUMN IF NOT EXISTS client_id VARCHAR(64)`).catch(() => {});
pool.query(`ALTER TABLE helpdesk.tickets ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP`).catch(() => {});

const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitos chamados criados em pouco tempo. Aguarde alguns minutos e tente novamente.' },
});

router.get('/', async (req, res) => {
  const clientId = req.headers['x-client-id'] || null;
  try {
    const result = await pool.query(
      'SELECT * FROM helpdesk.tickets WHERE client_id IS NULL OR client_id = $1 ORDER BY created_at DESC',
      [clientId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const clientId = req.headers['x-client-id'] || null;
  try {
    const result = await pool.query(
      'SELECT * FROM helpdesk.tickets WHERE id = $1 AND (client_id IS NULL OR client_id = $2)',
      [req.params.id, clientId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Chamado não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', createLimiter, async (req, res) => {
  const { title, description, priority, category, requester, assignee } = req.body;
  const clientId = req.headers['x-client-id'] || null;
  if (!title || !requester) {
    return res.status(400).json({ error: 'Título e solicitante são obrigatórios' });
  }
  try {
    const countResult = await pool.query('SELECT COUNT(*) FROM helpdesk.tickets');
    const count = parseInt(countResult.rows[0].count) + 1;
    const id = `TK-${String(count).padStart(3, '0')}`;

    const result = await pool.query(
      `INSERT INTO helpdesk.tickets (id, title, description, priority, category, requester, assignee, client_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [id, title, description || '', priority || 'medium', category || 'outros', requester, assignee || null, clientId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  const { title, description, status, priority, category, assignee } = req.body;
  const clientId = req.headers['x-client-id'] || null;
  const resolvedAtUpdate = status
    ? (status === 'resolved' || status === 'closed' ? new Date() : null)
    : undefined;
  try {
    const result = await pool.query(
      `UPDATE helpdesk.tickets SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        priority = COALESCE($4, priority),
        category = COALESCE($5, category),
        assignee = COALESCE($6, assignee),
        resolved_at = CASE WHEN $7::boolean THEN $8::timestamp ELSE resolved_at END,
        updated_at = NOW()
       WHERE id = $9 AND (client_id IS NULL OR client_id = $10) RETURNING *`,
      [title, description, status, priority, category, assignee, resolvedAtUpdate !== undefined, resolvedAtUpdate, req.params.id, clientId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Chamado não encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const clientId = req.headers['x-client-id'] || null;
  try {
    const result = await pool.query(
      'DELETE FROM helpdesk.tickets WHERE id = $1 AND (client_id IS NULL OR client_id = $2) RETURNING id',
      [req.params.id, clientId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Chamado não encontrado' });
    res.json({ message: 'Chamado removido' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
