import { Router } from 'express';
import db from '../config/db.js';
import { authenticate, librarianOnly } from '../middleware/auth.js';
const router=Router();
router.use(authenticate);
router.get('/',async(_req,res)=>{
  try { const [rows]=await db.execute(`SELECT t.id,t.book_id,t.user_id,t.type,t.quantity,t.created_at,b.title AS book_title,u.name AS user_name FROM transactions t JOIN books b ON b.id=t.book_id LEFT JOIN users u ON u.id=t.user_id ORDER BY t.created_at DESC`); res.json(rows); }
  catch(e){res.status(500).json({message:e.message});}
});
router.post('/',librarianOnly,async(req,res)=>{
  const {book_id,type,quantity,user_id}=req.body;
  const amount=Number(quantity);
  if(!book_id || !['ADD','BORROW'].includes(type) || !Number.isInteger(amount) || amount<1) return res.status(400).json({message:'Select a book, transaction type and positive whole-number quantity.'});
  const conn=await db.getConnection();
  try {
    await conn.beginTransaction();
    const [books]=await conn.execute('SELECT quantity FROM books WHERE id=? FOR UPDATE',[book_id]);
    if(!books.length) {await conn.rollback();return res.status(404).json({message:'Book not found.'});}
    const newQuantity=type==='ADD'?books[0].quantity+amount:books[0].quantity-amount;
    if(newQuantity<0){await conn.rollback();return res.status(400).json({message:'Not enough copies are available.'});}
    if(type==='BORROW' && user_id){const [users]=await conn.execute('SELECT id FROM users WHERE id=?',[user_id]);if(!users.length){await conn.rollback();return res.status(400).json({message:'Selected user does not exist.'});}}
    await conn.execute('UPDATE books SET quantity=? WHERE id=?',[newQuantity,book_id]);
    const [r]=await conn.execute('INSERT INTO transactions(book_id,user_id,type,quantity) VALUES(?,?,?,?)',[book_id,user_id||null,type,amount]);
    await conn.commit();res.status(201).json({id:r.insertId,book_id,user_id:user_id||null,type,quantity:amount,new_quantity:newQuantity});
  } catch(e){await conn.rollback();res.status(500).json({message:e.message});} finally{conn.release();}
});
export default router;
