import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import { authenticate, librarianOnly } from '../middleware/auth.js';
const router = Router();
router.use(authenticate, librarianOnly);
router.get('/', async (_req, res) => { try { const [rows] = await db.execute('SELECT id,name,membership_id,role,created_at FROM users ORDER BY name'); res.json(rows); } catch(e) { res.status(500).json({message:e.message}); } });
router.post('/', async (req,res) => {
  try {
    const {name,membership_id,role,password} = req.body;
    if (!name?.trim() || !membership_id?.trim() || !['librarian','member'].includes(role) || !password || password.length < 8) return res.status(400).json({message:'Provide a name, membership ID, valid role and password of at least 8 characters.'});
    const hash = await bcrypt.hash(password, 10);
    const [r] = await db.execute('INSERT INTO users(name,membership_id,role,password_hash) VALUES(?,?,?,?)',[name.trim(),membership_id.trim(),role,hash]);
    res.status(201).json({id:r.insertId,name,membership_id,role});
  } catch(e) { res.status(e.code==='ER_DUP_ENTRY'?409:500).json({message:e.code==='ER_DUP_ENTRY'?'Membership ID already exists.':e.message}); }
});
router.put('/:id', async (req,res) => {
  try {
    const {name,membership_id,role,password} = req.body;
    if (!name?.trim() || !membership_id?.trim() || !['librarian','member'].includes(role)) return res.status(400).json({message:'Enter valid user details.'});
    if (password) {
      if(password.length<8) return res.status(400).json({message:'Password must contain at least 8 characters.'});
      const hash=await bcrypt.hash(password,10);
      await db.execute('UPDATE users SET name=?,membership_id=?,role=?,password_hash=? WHERE id=?',[name.trim(),membership_id.trim(),role,hash,req.params.id]);
    } else await db.execute('UPDATE users SET name=?,membership_id=?,role=? WHERE id=?',[name.trim(),membership_id.trim(),role,req.params.id]);
    const [rows]=await db.execute('SELECT id,name,membership_id,role FROM users WHERE id=?',[req.params.id]);
    if(!rows.length) return res.status(404).json({message:'User not found.'}); res.json(rows[0]);
  } catch(e) { res.status(e.code==='ER_DUP_ENTRY'?409:500).json({message:e.message}); }
});
router.delete('/:id', async(req,res)=>{
  if(Number(req.params.id)===req.user.id) return res.status(400).json({message:'You cannot delete your own active account.'});
  try { const [r]=await db.execute('DELETE FROM users WHERE id=?',[req.params.id]); if(!r.affectedRows)return res.status(404).json({message:'User not found.'}); res.json({message:'User deleted.'}); }
  catch(e){res.status(500).json({message:e.message});}
});
export default router;
