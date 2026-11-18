const API_URL=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
export async function api(path,options={}){
 const token=localStorage.getItem('library_token');
 const response=await fetch(`${API_URL}${path}`,{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`} : {}),...options.headers}});
 const data=await response.json().catch(()=>({message:'The server returned an invalid response.'}));
 if(!response.ok) throw new Error(data.message||'Request failed.');
 return data;
}
