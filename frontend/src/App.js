import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import StoreList from "./components/StoreList";
import AdminDashboard from "./components/AdminDashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Container from "./components/Container";

export default function App() {
  const [user, setUser] = useState(null);

  // Check for token in localStorage to persist login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      setUser(savedUser);
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar with dynamic logout */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Page Container */}
      <Container>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={!user ? <Login onLogin={setUser} /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup onSignup={setUser} /> : <Navigate to="/" />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              user && user.role === "SYSTEM_ADMIN" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/stores"
            element={user ? <StoreList user={user} /> : <Navigate to="/login" />}
          />

          {/* Home / Default */}
          <Route
            path="/"
            element={
              user ? (
                <div>
                  <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
                    FSIC — Demo
                  </h1>
                  {user.role === "SYSTEM_ADMIN" && <AdminDashboard />}
                  <StoreList user={user} />
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
}
