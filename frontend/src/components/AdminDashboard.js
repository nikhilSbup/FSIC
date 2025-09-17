import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);

  useEffect(()=>{ fetchStats(); fetchLists(); }, []);
  async function fetchStats() {
    const res = await API.get('/admin/stats'); setStats(res.data);
  }
  async function fetchLists() {
    const r1 = await API.get('/admin/users'); setUsers(r1.data);
    const r2 = await API.get('/admin/stores'); setStores(r2.data);
  }
  return (
    <div className="card">
      <h3>Admin Dashboard</h3>
      {stats && <div>
        <div>Total users: {stats.totalUsers}</div>
        <div>Total stores: {stats.totalStores}</div>
        <div>Total ratings: {stats.totalRatings}</div>
      </div>}
      <h4>Users</h4>
      <ul>{users.map(u=> <li key={u.id}>{u.name} — {u.email} — {u.role}</li>)}</ul>
      <h4>Stores</h4>
      <ul>{stores.map(s=> <li key={s.id}>{s.name} — {s.rating || '–'}</li>)}</ul>
    </div>
  );
}
