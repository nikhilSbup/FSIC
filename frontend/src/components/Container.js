// src/components/Container.js
import React from "react";

export default function Container({ children }) {
  return (
    <div className="container mx-auto px-4 py-6">
      {children}
    </div>
  );
}
