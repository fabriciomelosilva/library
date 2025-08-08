const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  const { title, author, year } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING *',
      [title, author, year]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar livro' });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM books ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar livros' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar livro' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_available } = req.body;

    await db.query(
      'UPDATE books SET is_available = $1 WHERE id = $2',
      [is_available, id]
    );

    res.json({ message: 'Livro atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar livro' });
  }
});



router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM books WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }
    res.json({ message: 'Livro removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar livro' });
  }
});

module.exports = router;
