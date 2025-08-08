const express = require('express');
const router = express.Router();
const db = require('../db');

// Registrar empréstimo
router.post('/', async (req, res) => {
  const { book_id, borrower_name, return_date } = req.body;
  try {
    // Criar empréstimo
    const result = await db.query(
      'INSERT INTO loans (book_id, borrower_name, return_date) VALUES ($1, $2, $3) RETURNING *',
      [book_id, borrower_name, return_date]
    );

    // Atualizar livro para indisponível
    await db.query(
      'UPDATE books SET is_available = false WHERE id = $1',
      [book_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar empréstimo' });
  }
});


// Listar todos os empréstimos
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT l.*, b.title, b.author
      FROM loans l
      JOIN books b ON l.book_id = b.id
      ORDER BY l.borrow_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar empréstimos' });
  }
});

// Marcar devolução
router.put('/:id/return', async (req, res) => {
  try {
    // Atualizar empréstimo para returned = true
    const result = await db.query(
      'UPDATE loans SET returned = true WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empréstimo não encontrado' });
    }

    // Atualizar livro para disponível
    const book_id = result.rows[0].book_id;
    await db.query(
      'UPDATE books SET is_available = true WHERE id = $1',
      [book_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao marcar devolução' });
  }
});


module.exports = router;
