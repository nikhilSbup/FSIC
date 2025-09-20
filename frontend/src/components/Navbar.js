import React, { useState } from "react";
import { Link } from "react-router-dom";
import ChangePasswordModal from "./ChangePasswordModal";

export default function Navbar({ user, onLogout }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-indigo-600 p-4 flex justify-between items-center text-white relative z-50">
        {/* Logo */}
        <div className="text-lg font-bold">FSIC Platform</div>

        {/* Hamburger Button for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <div
          className={`flex-col md:flex md:flex-row md:items-center md:space-x-4 absolute md:static top-full left-0 w-full md:w-auto transition-all duration-300 ${
            menuOpen ? "flex bg-white text-black shadow-md p-4" : "hidden md:flex text-white bg-indigo-600 md:bg-transparent"
          }`}
        >
          {!user && (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 md:py-0 hover:underline"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-2 md:py-0 hover:underline"
              >
                Signup
              </Link>
            </>
          )}

          {user && (
            <>
              {user.role === "SYSTEM_ADMIN" && (
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 md:py-0 hover:underline"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => setShowPasswordModal(true)}
                className="block px-4 py-2 md:py-0 hover:underline text-left md:text-center w-full md:w-auto"
              >
                Change Password
              </button>
              <button
                onClick={onLogout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 w-full md:w-auto text-left md:text-center mt-2 md:mt-0"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Change Password Modal */}
      {user && (
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </>
  );
}