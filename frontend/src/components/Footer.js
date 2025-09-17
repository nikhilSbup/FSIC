// src/components/Footer.js
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 text-center py-4 mt-10">
      <p>© {new Date().getFullYear()} FSIC App. All Rights Reserved.</p>
    </footer>
  );
}
