import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import CreateRepair from '../pages/CreateRepair';
import RepairList from '../pages/RepairList';
import RepairDetail from '../pages/RepairDetail';
import MyHistory from '../pages/MyHistory';
import UserManagement from '../pages/UserManagement';
import MasterDataManagement from '../pages/MasterDataManagement';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN' || user.role === 'STAFF') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/repairs" replace />;
  }

  return children;
};

// Default Home Redirect
const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN' || user.role === 'STAFF') {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/repairs" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<HomeRedirect />} />

      {/* Authenticated Dashboard Layout Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/create-repair" element={<CreateRepair />} />
        <Route path="/repairs" element={<RepairList />} />
        <Route path="/repairs/:id" element={<RepairDetail />} />
        <Route path="/my-history" element={<MyHistory />} />

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/master-data"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <MasterDataManagement />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
