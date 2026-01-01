import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-indigo-600 text-white p-4 shadow-md flex justify-between items-center">
      <div className="font-bold text-xl">Todo App</div>
      {user && (
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline">Hi, {user.name}</span>
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
