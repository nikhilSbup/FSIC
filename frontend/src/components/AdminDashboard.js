import React, { useEffect, useState } from "react";
import API from "../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "NORMAL_USER",
  });

  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  const [editingUser, setEditingUser] = useState(null);
  const [editingStore, setEditingStore] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchLists();
  }, []);

  async function fetchStats() {
    const res = await API.get("/admin/stats");
    setStats(res.data);
  }

  async function fetchLists() {
    const u = await API.get("/admin/users");
    setUsers(u.data);
    const s = await API.get("/admin/stores");
    setStores(s.data);
  }

  async function handleAddUser(e) {
    e.preventDefault();
    try {
      await API.post("/admin/users", newUser);
      setNewUser({ name: "", email: "", password: "", address: "", role: "NORMAL_USER" });
      fetchLists();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add user");
    }
  }

  async function handleUpdateUser(e) {
    e.preventDefault();
    try {
      await API.put(`/admin/users/${editingUser.id}`, editingUser);
      setEditingUser(null);
      fetchLists();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update user");
    }
  }

  async function handleDeleteUser(id) {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchLists();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete user");
    }
  }

  async function handleAddStore(e) {
    e.preventDefault();
    try {
      await API.post("/admin/stores", newStore);
      setNewStore({ name: "", email: "", address: "", ownerId: "" });
      fetchLists();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add store");
    }
  }

  async function handleUpdateStore(e) {
    e.preventDefault();
    try {
      await API.put(`/admin/stores/${editingStore.id}`, editingStore);
      setEditingStore(null);
      fetchLists();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update store");
    }
  }

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-3xl font-bold text-indigo-700">Admin Dashboard</h2>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h3 className="text-lg text-gray-600">Total Users</h3>
            <p className="text-2xl font-bold text-indigo-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h3 className="text-lg text-gray-600">Total Stores</h3>
            <p className="text-2xl font-bold text-indigo-600">{stats.totalStores}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h3 className="text-lg text-gray-600">Total Ratings</h3>
            <p className="text-2xl font-bold text-indigo-600">{stats.totalRatings}</p>
          </div>
        </div>
      )}

      {/* Add User */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Add User</h3>
        <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Full Name" className="border p-2 rounded"
            value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
          <input type="email" placeholder="Email" className="border p-2 rounded"
            value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
          <input type="password" placeholder="Password" className="border p-2 rounded"
            value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
          <input type="text" placeholder="Address" className="border p-2 rounded"
            value={newUser.address} onChange={e => setNewUser({ ...newUser, address: e.target.value })} />
          <select className="border p-2 rounded" value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
            <option value="NORMAL_USER">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
            <option value="SYSTEM_ADMIN">Admin</option>
          </select>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Add</button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Users</h3>
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="px-4 py-2 border">{u.id}</td>
                <td className="px-4 py-2 border">{u.name}</td>
                <td className="px-4 py-2 border">{u.email}</td>
                <td className="px-4 py-2 border">{u.role}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button onClick={() => setEditingUser(u)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                  <button onClick={() => handleDeleteUser(u.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editingUser && (
          <form onSubmit={handleUpdateUser} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="border p-2 rounded" />
            <input type="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="border p-2 rounded" />
            <input type="text" value={editingUser.address} onChange={e => setEditingUser({ ...editingUser, address: e.target.value })} className="border p-2 rounded" />
            <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })} className="border p-2 rounded">
              <option value="NORMAL_USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="SYSTEM_ADMIN">Admin</option>
            </select>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={() => setEditingUser(null)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </form>
        )}
      </div>

      {/* Add Store */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Add Store</h3>
        <form onSubmit={handleAddStore} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Store Name" className="border p-2 rounded"
            value={newStore.name} onChange={e => setNewStore({ ...newStore, name: e.target.value })} required />
          <input type="email" placeholder="Store Email" className="border p-2 rounded"
            value={newStore.email} onChange={e => setNewStore({ ...newStore, email: e.target.value })} />
          <input type="text" placeholder="Store Address" className="border p-2 rounded col-span-2"
            value={newStore.address} onChange={e => setNewStore({ ...newStore, address: e.target.value })} />
          <input type="number" placeholder="Owner ID" className="border p-2 rounded"
            value={newStore.ownerId} onChange={e => setNewStore({ ...newStore, ownerId: e.target.value })} />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
        </form>
      </div>

      {/* Stores Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Stores</h3>
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Rating</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(s => (
              <tr key={s.id}>
                <td className="px-4 py-2 border">{s.id}</td>
                <td className="px-4 py-2 border">{s.name}</td>
                <td className="px-4 py-2 border">{s.rating || "—"}</td>
                <td className="px-4 py-2 border">
                  <button onClick={() => setEditingStore(s)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editingStore && (
          <form onSubmit={handleUpdateStore} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={editingStore.name} onChange={e => setEditingStore({ ...editingStore, name: e.target.value })} className="border p-2 rounded" />
            <input type="email" value={editingStore.email} onChange={e => setEditingStore({ ...editingStore, email: e.target.value })} className="border p-2 rounded" />
            <input type="text" value={editingStore.address} onChange={e => setEditingStore({ ...editingStore, address: e.target.value })} className="border p-2 rounded col-span-2" />
            <input type="number" value={editingStore.ownerId || ""} onChange={e => setEditingStore({ ...editingStore, ownerId: e.target.value })} className="border p-2 rounded" />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={() => setEditingStore(null)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </form>
        )}
      </div>
    </div>
  );
}
