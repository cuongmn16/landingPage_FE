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
  const missionRouteNum = (location.pathname.match(/^\/mission-([124])(\/|$)/) || [])[1];
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
        <Link to={currentUser?.role === 'admin' ? '/admin' : '/'} className="navbar__logo">
          <img src="/assets/ctin-logo.png" alt="CTIN" className="navbar__logo-img" />
          <span className="navbar__logo-divider"></span>
          <span className="navbar__logo-event">
            <span className="navbar__logo-event-main">
              {isAdminRoute ? 'ADMIN' : 'TREASURE HUNT'}
            </span>
            <span className="navbar__logo-event-sub">
              {missionRouteNum ? `Mission 0${missionRouteNum}` : isAdminRoute ? 'Treasure Hunt' : isLeaderboardRoute ? 'Leaderboard' : '25 Years'}
            </span>
          </span>
        </Link>

        <nav className={`navbar__nav ${isOpen ? 'is-open' : ''}`} id="navMenu">
          {isAdminRoute || currentUser?.role === 'admin' ? (
            <>
              <a href="#pending" onClick={(e) => { e.preventDefault(); navigate('/admin?tab=pending'); }}>Chờ duyệt</a>
              <a href="#submissions" onClick={(e) => { e.preventDefault(); navigate('/admin?tab=submissions'); }}>Bài nộp</a>
              <Link to="/leaderboard">Bảng xếp hạng</Link>
            </>
          ) : isDashboardRoute ? (
            <>
              <Link to="/">Trang chủ</Link>
              <Link to="/leaderboard">Bảng xếp hạng</Link>
            </>
          ) : missionRouteNum ? (
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

        <div className="navbar__actions">
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
                className="navbar__logout-btn"
                title="Đăng xuất khỏi hệ thống"
                aria-label="Đăng xuất"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span className="navbar__logout-text">Đăng xuất</span>
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
