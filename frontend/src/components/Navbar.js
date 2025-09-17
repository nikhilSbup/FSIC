// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo / App Name */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          FSIC App
        </Link>

        {/* Right side menu */}
        <div className="space-x-6 flex items-center">
          {!user ? (
            <>
              <Link to="/stores" className="hover:text-gray-200">
                Stores
              </Link>
              <Link to="/login" className="hover:text-gray-200">
                Login
              </Link>
              <Link to="/signup" className="hover:text-gray-200">
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link to="/stores" className="hover:text-gray-200">
                Stores
              </Link>
              <Link to="/dashboard" className="hover:text-gray-200">
                Dashboard
              </Link>
              <button
                onClick={onLogout}
                className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
