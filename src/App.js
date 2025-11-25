import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import LeadView from "./pages/LeadView";
import Appointments from "./pages/Appointments";
import Layout from "./components/layout/Layout";
import useAuth from "./store/authStore";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// function App() {
//   return (
//     <>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <Dashboard />
//               </Layout>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/leads"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <Leads />
//               </Layout>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/leads/:id"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <LeadView />
//               </Layout>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/appointments"
//           element={
//             <ProtectedRoute>
//               <Layout>
//                 <Appointments />
//               </Layout>
//             </ProtectedRoute>
//           }
//         />
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//       <a
//         href="https://www.canva.com/design/DAG43uWRQPs/zSyYK7rpVJgx5LVrcGU8CA/edit?utm_content=DAG43uWRQPs&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
//         style={{ color: "red" }}
//       >
//         button
//       </a>
//     </>
//   );
// }


function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <Layout><Leads /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads/:id"
          element={
            <ProtectedRoute>
              <Layout><LeadView /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Layout><Appointments /></Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* MOVE IT HERE */}
        <a
        href="https://www.canva.com/design/DAG43uWRQPs/zSyYK7rpVJgx5LVrcGU8CA/edit?utm_content=DAG43uWRQPs&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
        style={{
          color: "red",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "white",
          padding: "8px 12px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.15)"
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        Canva Link
      </a>
    </>
  );
}

export default App;
