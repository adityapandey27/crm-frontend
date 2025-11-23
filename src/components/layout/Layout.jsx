// import React from "react";
// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";

// export default function Layout({ children }) {
//   return (
//     <div className="flex h-screen bg-gray-50 bg-gray-50">
//       <div style={{height:"100%"}} className="w-[20%]">

//       <Sidebar />
//       </div>
//       <div className="flex-1 flex flex-col w-[80%]">
//         <Navbar />
//         <main className="p-6 overflow-auto bg-gray-50">{children}</main>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar (Slide-in) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 md:hidden 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar close={() => setMobileOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="p-6 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
