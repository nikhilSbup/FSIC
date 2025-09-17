import React, { useEffect, useState } from 'react';
import API from '../api';

export default function StoreList({ user }) {
  const [stores, setStores] = useState([]);
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState('');
  useEffect(()=>{ fetchStores(); }, []);
  async function fetchStores() {
    try {
      const res = await API.get('/stores', { params: { q } });
      setStores(res.data);
    } catch (err) { console.error(err); }
  }
  async function rate(storeId, score) {
    try {
      const comment = prompt('Optional comment');
      const res = await API.post(`/stores/${storeId}/rate`, { score, comment });
      setMsg(res.data.message);
      fetchStores();
    } catch (err) { setMsg(err.response?.data?.message || err.message); }
  }
  return (
    <div className="card">
      <h3>Stores</h3>
      <div style={{display:'flex', gap:8}}>
        <input placeholder="Search by name" value={q} onChange={e=>setQ(e.target.value)} />
        <button onClick={fetchStores}>Search</button>
      </div>
      <small>{msg}</small>
      <ul>
        {stores.map(s => (
          <li key={s.id} style={{margin:'12px 0', borderBottom:'1px solid #eee', paddingBottom:8}}>
            <strong>{s.name}</strong> — {s.address}<br/>
            Average: {s.averageRating || '–'} | Your rating: {s.userRating || '–'}<br/>
            <div style={{display:'flex', gap:6, marginTop:6}}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={()=>rate(s.id,n)}>{n}</button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
