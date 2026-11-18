import {useEffect,useState} from 'react';
import {NavLink,Route,Routes,Navigate,useNavigate} from 'react-router-dom';
import {api} from './api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Transactions from './pages/Transactions';
import Users from './pages/Users';

export default function App(){
 const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('library_user'))}catch{return null}});
 const [refresh,setRefresh]=useState(0);const navigate=useNavigate();
 const login=(data)=>{localStorage.setItem('library_token',data.token);localStorage.setItem('library_user',JSON.stringify(data.user));setUser(data.user);navigate('/');};
 const logout=()=>{localStorage.removeItem('library_token');localStorage.removeItem('library_user');setUser(null);navigate('/login');};
 const Protected=({children,admin=false})=>!user?<Navigate to="/login" replace/>:admin&&user.role!=='librarian'?<Navigate to="/" replace/>:children;
 return <div className="app-shell">{user&&<aside className="sidebar"><div className="brand"><span className="brand-icon">L</span><div><b>Community</b><small>LIBRARY SYSTEM</small></div></div><div className="nav-label">WORKSPACE</div><nav><NavLink to="/">▦ <span>Dashboard</span></NavLink><NavLink to="/books">▤ <span>Book Management</span></NavLink><NavLink to="/transactions">⇄ <span>Transactions</span></NavLink>{user.role==='librarian'&&<NavLink to="/users">♙ <span>User Management</span></NavLink>}</nav><div className="sidebar-bottom"><div className="profile"><div className="avatar">{user.name?.[0]?.toUpperCase()}</div><div><b>{user.name}</b><small>{user.role}</small></div></div><button className="logout" onClick={logout}>↪ Sign out</button></div></aside>}
 <main className={user?'main-content':'login-main'}>{user&&<header className="topbar"><div><span className="muted">Library workspace</span><h2>Good day, {user.name.split(' ')[0]}</h2></div><span className="role-pill">{user.role}</span></header>}<Routes><Route path="/login" element={user?<Navigate to="/"/>:<Login onLogin={login}/>}/><Route path="/" element={<Protected><Dashboard refresh={refresh}/></Protected>}/><Route path="/books" element={<Protected><Books user={user} onChange={()=>setRefresh(x=>x+1)}/></Protected>}/><Route path="/transactions" element={<Protected><Transactions user={user} onChange={()=>setRefresh(x=>x+1)}/></Protected>}/><Route path="/users" element={<Protected admin><Users/></Protected>}/><Route path="*" element={<Navigate to={user?'/':'/login'}/>}/></Routes></main></div>;
}
