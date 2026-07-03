const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const [totals, avg, byWeek, byCategory] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE status = 'open') AS open,
          COUNT(*) FILTER (WHERE status = 'in-progress') AS in_progress,
          COUNT(*) FILTER (WHERE status IN ('resolved','closed')) AS resolved,
          COUNT(*) FILTER (WHERE priority = 'critical' AND status NOT IN ('resolved','closed')) AS critical
        FROM helpdesk.tickets
      `),
      pool.query(`
        SELECT ROUND(AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600)::numeric, 1) AS avg_hours
        FROM helpdesk.tickets
        WHERE status IN ('resolved','closed') AND resolved_at IS NOT NULL
      `),
      pool.query(`
        SELECT
          TO_CHAR(DATE_TRUNC('week', created_at), 'DD/MM') AS label,
          COUNT(*) AS count
        FROM helpdesk.tickets
        WHERE created_at >= NOW() - INTERVAL '6 weeks'
        GROUP BY DATE_TRUNC('week', created_at)
        ORDER BY DATE_TRUNC('week', created_at)
      `),
      pool.query(`
        SELECT category, COUNT(*) AS count
        FROM helpdesk.tickets
        GROUP BY category
        ORDER BY count DESC
      `),
    ]);

    const t = totals.rows[0];
    res.json({
      total: parseInt(t.total),
      open: parseInt(t.open),
      inProgress: parseInt(t.in_progress),
      resolved: parseInt(t.resolved),
      critical: parseInt(t.critical),
      avgResolutionHours: parseFloat(avg.rows[0].avg_hours) || 0,
      byWeek: byWeek.rows.map(r => ({ label: r.label, count: parseInt(r.count) })),
      byCategory: byCategory.rows.map(r => ({ category: r.category, count: parseInt(r.count) })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
