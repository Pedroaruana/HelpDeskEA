require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function setup() {
  try {
    await pool.query(`
      CREATE SCHEMA IF NOT EXISTS helpdesk;

      CREATE TABLE IF NOT EXISTS helpdesk.users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'technician',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS helpdesk.tickets (
        id VARCHAR(10) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'open',
        priority VARCHAR(10) NOT NULL DEFAULT 'medium',
        category VARCHAR(30) NOT NULL DEFAULT 'outros',
        requester VARCHAR(100) NOT NULL,
        assignee VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Tabelas criadas com sucesso!');
  } catch (err) {
    console.error('Erro:', err.message);
  } finally {
    await pool.end();
  }
}

setup();
