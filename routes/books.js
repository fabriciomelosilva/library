const express = require('express');
const router = express.Router();
const db = require('../db');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const upload = multer({ dest: 'tmp/' });

router.post('/', upload.single('image'), async (req, res) => { 
  const title = req.body.title;
  const author = req.body.author;
  const year = parseInt(req.body.year) || null;
  const description = req.body.description;
  const responsible = req.body.responsible;
  const contact = req.body.contact;
  
  let imageUrl = null;
  
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'books',
      });
      imageUrl = result.secure_url;
    }
    
    const result = await db.query(
      `INSERT INTO books (title, author, year, description, image_url, responsible, contact)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, author, year, description, imageUrl, responsible, contact]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding book' });
  }
});

// GET all books
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM books ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});

// GET book by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Book not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching book' });
  }
});

// UPDATE is_available
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_available } = req.body;

    await db.query('UPDATE books SET is_available = $1 WHERE id = $2', [is_available, id]);
    res.json({ message: 'Book updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating book' });
  }
});

// DELETE book
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM books WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting book' });
  }
});

module.exports = router;
