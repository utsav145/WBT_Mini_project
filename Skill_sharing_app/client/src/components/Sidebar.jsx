import React, { useState } from 'react';
import {
  FaHome,
  FaTachometerAlt,
  FaEnvelope,
  FaUserCircle,
  FaBars,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LogoutConfirmationModal from './LogoutConfirmationModal';
import './Sidebar.css';

function Sidebar({ isCollapsed, toggleSidebar }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/', { replace: true });
  };

  const handleProfileClick = () => {
    if (user?.id) {
      navigate(`/profile`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button onClick={toggleSidebar} className="toggle-btn">
          <FaBars />
        </button>
      </div>

      {/* Profile Section */}
      <div className="profile-wrapper" onClick={handleProfileClick}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          width: '100%',
          alignItems: 'center'
        }}>
          <FaUserCircle 
            className="profile-img" 
            size={isCollapsed ? "40" : "50"} /* Dynamic size based on sidebar state */
          />
        </div>
        {!isCollapsed && (
          <div className="profile-text">
            <div className="profile-name">{user?.name || 'User'}</div>
            <div className="profile-email">{user?.email || 'user@example.com'}</div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="sidebar-links">
        <Link to="/user" className="nav-link">
          <div style={{ display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-start', width: '100%', alignItems: 'center' }}>
            <FaHome />
            {!isCollapsed && <span style={{ marginLeft: '1rem' }}>Home</span>}
          </div>
        </Link>
        <Link to="/admin-dashboard" className="nav-link">
          <div style={{ display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-start', width: '100%', alignItems: 'center' }}>
            <FaTachometerAlt />
            {!isCollapsed && <span style={{ marginLeft: '1rem' }}>Dashboard</span>}
          </div>
        </Link>
        <Link to="/MessagingLanding" className="nav-link">
          <div style={{ display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-start', width: '100%', alignItems: 'center' }}>
            <FaEnvelope />
            {!isCollapsed && <span style={{ marginLeft: '1rem' }}>Messages</span>}
          </div>
        </Link>
        <Link to="/settings" className="nav-link">
          <div style={{ display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-start', width: '100%', alignItems: 'center' }}>
            <FaCog />
            {!isCollapsed && <span style={{ marginLeft: '1rem' }}>Settings</span>}
          </div>
        </Link>
        <Link to="/contact" className="nav-link">
          <div style={{ display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-start', width: '100%', alignItems: 'center' }}>
            <FaQuestionCircle />
            {!isCollapsed && <span style={{ marginLeft: '1rem' }}>Help</span>}
          </div>
        </Link>
      </div>

      {/* Logout Button */}
      <div className="sidebar-bottom">
        <button className="logout-btn" onClick={handleLogoutClick}>
          <div style={{ display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-start', width: '100%', alignItems: 'center' }}>
            <FaSignOutAlt />
            {!isCollapsed && <span style={{ marginLeft: '1rem' }}>Logout</span>}
          </div>
        </button>
      </div>

      <LogoutConfirmationModal
        show={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
}

export default Sidebar;
