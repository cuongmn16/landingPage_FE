import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../services/api';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(auth.user);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const u = await auth.load();
      setCurrentUser(u);
    };
    checkAuth();
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isMission1Route = location.pathname.startsWith('/mission-1');
  const isLeaderboardRoute = location.pathname === '/leaderboard';
  const isDashboardRoute = location.pathname === '/dashboard';

  const handleLogout = async (e) => {
    if (e) e.preventDefault();
    await auth.logout();
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <header className={`navbar ${isScrolled ? 'is-scrolled' : ''}`} id="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <img src="/assets/ctin-logo.png" alt="CTIN" className="navbar__logo-img" />
          <span className="navbar__logo-divider"></span>
          <span className="navbar__logo-event">
            <span className="navbar__logo-event-main">
              {isAdminRoute ? 'ADMIN' : 'TREASURE HUNT'}
            </span>
            <span className="navbar__logo-event-sub">
              {isMission1Route ? 'Mission 01' : isAdminRoute ? 'Treasure Hunt' : isLeaderboardRoute ? 'Leaderboard' : '25 Years'}
            </span>
          </span>
        </Link>

        <nav className={`navbar__nav ${isOpen ? 'is-open' : ''}`} id="navMenu">
          {isAdminRoute ? (
            <>
              <Link to="/">Trang chủ</Link>
              <a href="#pending" onClick={(e) => { e.preventDefault(); navigate('/admin?tab=pending'); }}>Chờ duyệt</a>
              <a href="#submissions" onClick={(e) => { e.preventDefault(); navigate('/admin?tab=submissions'); }}>Bài nộp</a>
              <a href="#logout" onClick={handleLogout}>Đăng xuất</a>
            </>
          ) : isDashboardRoute ? (
            <>
              <Link to="/">Trang chủ</Link>
              <Link to="/leaderboard">Bảng xếp hạng</Link>
              <a href="#logout" onClick={handleLogout}>Đăng xuất</a>
            </>
          ) : isMission1Route ? (
            <>
              <Link to="/">Trang chủ</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/leaderboard">Bảng xếp hạng</Link>
            </>
          ) : (
            <>
              <a href="/#story">Câu chuyện</a>
              <a href="/#how-to-play">Cách chơi</a>
              <a href="/#missions">Missions</a>
              <a href="/#progress">Tiến độ đơn vị</a>
              <a href="/#leaderboard-preview">Bảng xếp hạng</a>
              <a href="/#prizes">Giải thưởng</a>
              <a href="/#timeline">Timeline</a>
              <a href="/#faq">FAQ</a>
            </>
          )}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentUser ? (
            <>
              {currentUser.role === 'admin' ? (
                <Link to="/admin" className="btn btn--gold navbar__cta">
                  ← Admin Dashboard
                </Link>
              ) : (
                <Link to="/dashboard" className="btn btn--gold navbar__cta">
                  Tiếp tục hành trình
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="btn navbar__logout-btn"
                title="Đăng xuất khỏi hệ thống"
                style={{
                  padding: '8px 14px',
                  fontSize: '13px',
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  background: 'rgba(239, 68, 68, 0.15)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>🚪</span> Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn--gold navbar__cta">
              Đăng nhập
            </Link>
          )}

          <button
            className="navbar__hamburger"
            id="hamburger"
            aria-label="Menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
