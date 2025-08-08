const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        year INTEGER,
        is_available BOOLEAN DEFAULT true
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS loans (
        id SERIAL PRIMARY KEY,
        book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        borrower_name TEXT NOT NULL,
        borrow_date DATE NOT NULL DEFAULT CURRENT_DATE,
        return_date DATE,
        returned BOOLEAN DEFAULT false
      );
    `);

    console.log('✅ Tabelas "books" e "loans" verificadas/criadas');
  } catch (err) {
    console.error('❌ Erro ao criar tabelas:', err);
  }
}

initDB();

module.exports = pool;
