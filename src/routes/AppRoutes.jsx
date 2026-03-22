import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import MainLayout from "../components/common/MainLayout";
import BillingPOS from "../pages/billing/BillingPOS";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import StockManagement from "../pages/stock/StockManagement";
import StaffManagement from "../pages/staff/StaffManagement";
import MenuManagement from "../pages/menu/MenuManagement";
import OrderReports from '../pages/reports/OrderReports';
import NotFound from "../pages/NotFound";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/billing" replace />;
  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Protected */}
      <Route
        path="/billing"
        element={
          <ProtectedRoute allowedRoles={["cashier", "admin"]}>
            <MainLayout>
              <BillingPOS />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stock"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <MainLayout>
              <StockManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      // Add inside your routes (admin only):
      <Route
        path="/staff"
        element={
          <ProtectedRoute roles={["admin"]}>
            <MainLayout>
              <StaffManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu"
        element={
          <ProtectedRoute roles={["admin"]}>
            <MainLayout>
              <MenuManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />
     <Route path="/reports" element={
  <ProtectedRoute roles={['admin']}>
    <MainLayout><OrderReports /></MainLayout>
  </ProtectedRoute>
} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
