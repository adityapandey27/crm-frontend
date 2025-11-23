// import React from "react";
// import { NavLink } from "react-router-dom";
// import { LayoutDashboard, Users, Calendar } from "lucide-react";

// const links = [
//   { to: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
//   { to: "/leads", label: "Leads", icon: <Users size={18} /> },
//   { to: "/appointments", label: "Appointments", icon: <Calendar size={18} /> },
// ];

// export default function Sidebar() {
//   return (
//     <aside className="w-64 bg-gradient-to-b from-white to-indigo-50 border-r shadow-md flex flex-col h-full">
//       {/* Logo */}
//       <div className="p-5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-xl shadow-sm rounded-br-3xl">
//         Student CRM
//       </div>

//       {/* Navigation */}
//       <nav className="p-4 space-y-2">
//         {links.map((item) => (
//           <NavLink
//             key={item.to}
//             to={item.to}
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all 
//               ${isActive
//                 ? "bg-indigo-600 text-white shadow"
//                 : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
//               }`
//             }
//           >
//             {item.icon}
//             {item.label}
//           </NavLink>
//         ))}
//       </nav>
//     </aside>
//   );
// }


import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, X } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { to: "/leads", label: "Leads", icon: <Users size={18} /> },
  { to: "/appointments", label: "Appointments", icon: <Calendar size={18} /> },
];

export default function Sidebar({ close }) {
  return (
    <aside className="w-64 bg-gradient-to-b from-white to-indigo-50 border-r shadow-md flex flex-col h-full">

      {/* Top Header */}
      <div className="flex items-center justify-between p-5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-xl shadow-sm rounded-br-3xl">
        Student CRM

        {/* Close Button (Mobile Only) */}
        {close && (
          <button
            onClick={close}
            className="md:hidden text-white hover:text-gray-200"
          >
            <X size={22} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={close}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all 
              ${isActive
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
