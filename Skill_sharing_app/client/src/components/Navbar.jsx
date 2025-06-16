// Navbar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import your auth context
import LogoutConfirmationModal from './LogoutConfirmationModal';
import '../styles/Navbar.css';

function Navbar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth(); // Access logout from context

  const handleLogout = () => {
    logout();             // clears user, tokens, and storage
    navigate('/', { replace: true });  // use replace to prevent back navigation
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <span className="logo" onClick={() => navigate('/user')}>SkillShare</span>
        </div>
        <div className="navbar-right">

          <button
            className="btn login-btn"
            onClick={() => setShowLogoutModal(true)}
            style={{ color: 'white' }}
          >
            Logout
          </button>
        </div>
      </nav>

      <LogoutConfirmationModal
        show={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}

export default Navbar;
