import React, { useState } from "react";
import API from "../api";

export default function Signup({ onSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", {
        name,
        email,
        address,
        password,
      });
      // auto-login
      const login = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", login.data.token);
      onSignup(login.data.user);
    } catch (err) {
      if (err.response?.status === 500 && err.response?.data?.message?.includes("Duplicate")) {
        setErr("Email already registered, please login.");
      } else {
        setErr(err.response?.data?.message || "Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
      <h3 className="text-2xl font-bold text-center text-indigo-600 mb-6">
        Sign Up
      </h3>

      <form onSubmit={submit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Full Name</label>
          <input
            placeholder="20-60 characters"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter a valid email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Address</label>
          <textarea
            placeholder="Max 400 characters"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="8-16 chars, one uppercase, one special char"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {/* Error Message */}
        {err && (
          <p className="text-red-500 text-sm text-center font-medium">{err}</p>
        )}

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
        >
          Sign Up
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-indigo-600 font-medium hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}
