import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { auth } from './services/api';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import BackToTop from './components/common/BackToTop';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminPage from './pages/AdminPage';
import Mission1Page from './pages/Mission1Page';
import AllSubmissionsPage from './pages/AllSubmissionsPage';

import './styles/index.css';

// Admin chỉ được dùng các trang /admin, /leaderboard (và trang đăng nhập/đăng ký)
function isAdminSession() {
  if (auth.user) return auth.user.role === 'admin';
  try {
    if (!localStorage.getItem('token')) return false;
    const u = JSON.parse(localStorage.getItem('user'));
    return !!u && u.role === 'admin';
  } catch {
    return false;
  }
}

function AppContent() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  const isAdminAllowed = location.pathname.startsWith('/admin') || location.pathname === '/leaderboard';
  if (isAdminSession() && !isAuthRoute && !isAdminAllowed) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="app-container">
      {!isAuthRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/mission-1" element={<Mission1Page />} />
        <Route path="/mission-1/all-submissions" element={<AllSubmissionsPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      {!isAuthRoute && <Footer />}
      {!isAuthRoute && <BackToTop />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
