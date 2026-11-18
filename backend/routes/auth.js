import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const router = Router();
router.post('/login', async (req, res) => {
  try {
    const { membership_id, password } = req.body;
    if (!membership_id || !password) return res.status(400).json({ message: 'Membership ID and password are required.' });
    const [rows] = await db.execute('SELECT id, name, membership_id, role, password_hash FROM users WHERE membership_id = ?', [membership_id]);
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash))) return res.status(401).json({ message: 'Invalid membership ID or password.' });
    const user = rows[0];
    const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, name: user.name, membership_id: user.membership_id, role: user.role } });
  } catch (error) { res.status(500).json({ message: 'Login failed.', error: error.message }); }
});
export default router;
