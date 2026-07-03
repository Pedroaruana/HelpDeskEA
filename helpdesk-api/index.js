require('dotenv').config();
const express = require('express');
const cors = require('cors');

const ticketsRouter = require('./src/routes/tickets');
const authRouter = require('./src/routes/auth');
const techniciansRouter = require('./src/routes/technicians');
const statsRouter = require('./src/routes/stats');
const attachmentsRouter = require('./src/routes/attachments');

const app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/tickets', ticketsRouter);
app.use('/api/auth', authRouter);
app.use('/api/technicians', techniciansRouter);
app.use('/api/stats', statsRouter);
app.use('/api/attachments', attachmentsRouter);

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
}

module.exports = app;
