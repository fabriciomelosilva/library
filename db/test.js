const db = require('./index');

async function testConnection() {
  try {
    const res = await db.query('SELECT NOW()');
    console.log('Conexão bem-sucedida!', res.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('Erro ao conectar:', err);
    process.exit(1);
  }
}

testConnection();
