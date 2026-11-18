import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import db from './config/db.js';
dotenv.config();
const membership_id=process.argv[2]||'LIB001';
const password=process.argv[3]||'ChangeMe123!';
const name=process.argv[4]||'Main Librarian';
try {
 const hash=await bcrypt.hash(password,10);
 await db.execute('INSERT INTO users(name,membership_id,role,password_hash) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name),role=VALUES(role),password_hash=VALUES(password_hash)',[name,membership_id,'librarian',hash]);
 console.log(`Librarian ready. Membership ID: ${membership_id}. Change the password after first login.`);
} catch(e){console.error(e.message);process.exitCode=1;} finally{await db.end();}
