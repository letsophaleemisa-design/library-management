import { Router } from 'express';
import db from '../config/db.js';
import { authenticate, librarianOnly } from '../middleware/auth.js';
const router = Router();
router.use(authenticate);
router.get('/', async (_req, res) => {
  try { const [rows] = await db.execute('SELECT * FROM books ORDER BY title'); res.json(rows); }
  catch (e) { res.status(500).json({ message: e.message }); }
});
router.post('/', librarianOnly, async (req, res) => {
  try {
    const { title, author, genre, isbn, quantity } = req.body;
    if (!title?.trim() || !author?.trim() || !genre?.trim() || !isbn?.trim() || !Number.isInteger(Number(quantity)) || Number(quantity) < 0) return res.status(400).json({ message: 'Enter valid book details and a non-negative whole-number quantity.' });
    const [result] = await db.execute('INSERT INTO books (title, author, genre, isbn, quantity) VALUES (?, ?, ?, ?, ?)', [title.trim(), author.trim(), genre.trim(), isbn.trim(), Number(quantity)]);
    const [rows] = await db.execute('SELECT * FROM books WHERE id = ?', [result.insertId]); res.status(201).json(rows[0]);
  } catch (e) { res.status(e.code === 'ER_DUP_ENTRY' ? 409 : 500).json({ message: e.code === 'ER_DUP_ENTRY' ? 'That ISBN already exists.' : e.message }); }
});
router.put('/:id', librarianOnly, async (req, res) => {
  try {
    const { title, author, genre, isbn, quantity } = req.body;
    if (!title?.trim() || !author?.trim() || !genre?.trim() || !isbn?.trim() || !Number.isInteger(Number(quantity)) || Number(quantity) < 0) return res.status(400).json({ message: 'Enter valid book details.' });
    const [result] = await db.execute('UPDATE books SET title=?, author=?, genre=?, isbn=?, quantity=? WHERE id=?', [title.trim(), author.trim(), genre.trim(), isbn.trim(), Number(quantity), req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Book not found.' });
    const [rows] = await db.execute('SELECT * FROM books WHERE id=?', [req.params.id]); res.json(rows[0]);
  } catch (e) { res.status(e.code === 'ER_DUP_ENTRY' ? 409 : 500).json({ message: e.message }); }
});
router.delete('/:id', librarianOnly, async (req, res) => {
  try { const [r] = await db.execute('DELETE FROM books WHERE id=?', [req.params.id]); if (!r.affectedRows) return res.status(404).json({ message: 'Book not found.' }); res.json({ message: 'Book deleted.' }); }
  catch (e) { res.status(500).json({ message: e.message }); }
});
export default router;
