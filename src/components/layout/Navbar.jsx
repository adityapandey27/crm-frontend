// import React from "react";
// import useAuth from "../../store/authStore";
// import { useNavigate } from "react-router-dom";
// import { LogOut } from "lucide-react";

// export default function Navbar() {
//   const { user, clearAuth } = useAuth();
//   const nav = useNavigate();

//   const logout = () => {
//     clearAuth();
//     nav("/login");
//   };

//   return (
//     <header className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm">
//       {/* Welcome Text */}
//       <div className="text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
//         Welcome{user ? `, ${user.name || user.email}` : ""}
//       </div>

//       {/* Logout */}
//       <button
//         onClick={logout}
//         className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-lg transition"
//       >
//         <LogOut size={16} />
//         Logout
//       </button>
//     </header>
//   );
// }


import React from "react";
import useAuth from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  const { user, clearAuth } = useAuth();
  const nav = useNavigate();

  const logout = () => {
    clearAuth();
    nav("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm">
      
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        onClick={onMenuClick}
      >
        <Menu size={22} />
      </button>

      {/* Welcome */}
      <div className="text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        Welcome{user ? `, ${user.name || user.email}` : ""}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-lg transition"
      >
        <LogOut size={16} />
        Logout
      </button>
    </header>
  );
}
