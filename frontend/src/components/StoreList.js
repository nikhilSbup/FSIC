// StoreList.js
import React, { useEffect, useState } from "react";
import API from "../api";

export default function StoreList({ user }) {
  const [stores, setStores] = useState([]);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  async function fetchStores() {
    try {
      setLoading(true);
      const res = await API.get("/stores", { params: { q } });
      setStores(res.data);
      setMsg("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  }

  async function rate(storeId, score) {
    try {
      const comment = prompt("Optional comment");
      const res = await API.post(`/stores/${storeId}/rate`, { score, comment });
      setMsg(res.data.message);
      fetchStores();
    } catch (err) {
      setMsg(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="bg-white shadow-xl rounded-xl p-8 max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-extrabold text-indigo-800 mb-6">Stores</h2>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search stores by name or address"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-grow h-14 px-6 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-500 text-lg transition-all duration-200"
        />
        <button
          onClick={fetchStores}
          className="h-14 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-base font-semibold transition duration-200 ease-in-out"
        >
          Search
        </button>
      </div>

      {msg && <p className="text-center text-red-500 mb-4">{msg}</p>}
      {loading && <p className="text-center text-gray-500">Loading stores...</p>}
      {!loading && stores.length === 0 && (
        <p className="text-center text-gray-500 italic">No stores found 🔍</p>
      )}

      {/* Store List */}
      <div className="space-y-6">
        {stores.map((s) => (
          <div
            key={s.id}
            className="border rounded-xl p-6 shadow-sm hover:shadow-md transition duration-200"
          >
            <h3 className="text-xl font-semibold text-gray-800">{s.name}</h3>
            <p className="text-gray-600">{s.address}</p>
            <p className="mt-2">
              ⭐ Average:{" "}
              <span className="font-medium text-indigo-600">
                {s.averageRating || "–"}
              </span>{" "}
              | Your rating:{" "}
              <span className="font-medium text-green-600">
                {s.userRating || "–"}
              </span>
            </p>
            <div className="flex gap-2 mt-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => rate(s.id, n)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-indigo-500 hover:text-white font-semibold transition duration-200"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
