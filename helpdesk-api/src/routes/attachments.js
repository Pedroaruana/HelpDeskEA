const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();
router.use(authMiddleware);

pool.query(`
  CREATE TABLE IF NOT EXISTS helpdesk.attachments (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(10) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    public_id TEXT NOT NULL,
    mimetype VARCHAR(100),
    size INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
  )
`).catch(() => {});

router.get('/:ticketId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, ticket_id, filename, url, mimetype, size, created_at FROM helpdesk.attachments WHERE ticket_id = $1 ORDER BY created_at DESC',
      [req.params.ticketId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:ticketId', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  try {
    const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const uploaded = await cloudinary.uploader.upload(dataUrl, {
      folder: 'helpdesk-ea',
      resource_type: 'auto',
      public_id: `${req.params.ticketId}_${Date.now()}`,
    });
    const result = await pool.query(
      `INSERT INTO helpdesk.attachments (ticket_id, filename, url, public_id, mimetype, size)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, ticket_id, filename, url, mimetype, size, created_at`,
      [req.params.ticketId, req.file.originalname, uploaded.secure_url, uploaded.public_id, req.file.mimetype, req.file.size]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const att = await pool.query('SELECT public_id FROM helpdesk.attachments WHERE id = $1', [req.params.id]);
    if (!att.rows.length) return res.status(404).json({ error: 'Anexo não encontrado' });
    await cloudinary.uploader.destroy(att.rows[0].public_id, { resource_type: 'auto' });
    await pool.query('DELETE FROM helpdesk.attachments WHERE id = $1', [req.params.id]);
    res.json({ message: 'Anexo removido' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
