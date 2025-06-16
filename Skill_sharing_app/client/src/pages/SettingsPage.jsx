import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { deleteAccount } from '../api';
import { authApi } from '../services/api';
import { FaUser, FaKey, FaTrash, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/SettingsPage.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('Please fill in all password fields');
      return false;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }

    return true;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!validatePasswordChange()) {
      setLoading(false);
      return;
    }

    try {
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccess('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // Simple confirmation prompt
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      setError('');
      
      // Get user ID from localStorage directly
      let userId = user?.id;
      
      // If user ID is not available in context, try to get it from localStorage
      if (!userId) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            userId = parsedUser.id;
            console.log('Retrieved user ID from localStorage:', userId);
          } catch (e) {
            console.error('Error parsing stored user:', e);
          }
        }
      }
      
      // Fallback to 1 if still no user ID (for development purposes)
      userId = userId || 1;
      console.log('Using user ID for deletion:', userId);
      
      // Call the API to delete the account using the user ID
      await deleteAccount(userId);
      
      // If successful, logout and redirect to homepage
      alert('Your account has been deleted successfully.');
      logout();
      navigate('/');
    } catch (err) {
      console.error('Delete account error:', err);
      setError(err.message || 'Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="settings-container">
      <h2>Account Settings</h2>
      <div className="settings-content">
        {/* Tabs - Left Navigation */}
        <div className="tabs">
          <button
            className={activeTab === 'personal' ? 'active' : ''}
            onClick={() => setActiveTab('personal')}
          >
            <FaUser /> Personal Info
          </button>
          <button
            className={activeTab === 'account' ? 'active' : ''}
            onClick={() => setActiveTab('account')}
          >
            <FaKey /> Account Info
          </button>
          <button
            className={activeTab === 'delete-account' ? 'active' : ''}
            onClick={() => setActiveTab('delete-account')}
          >
            <FaTrash /> Delete Account
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'personal' && (
            <div className="tab-panel">
              <h3>Personal Information</h3>
              <div>
                <label>Full Name</label>
                <input type="text" placeholder="Your Name" defaultValue={user?.name || ''} />
              </div>
              <div>
                <label>Email Address</label>
                <input type="email" placeholder="your@email.com" defaultValue={user?.email || ''} />
              </div>
              <div>
                <label>Phone Number</label>
                <input type="tel" placeholder="+91 1234567890" />
              </div>
              <button className="save-btn">
                <FaSave /> Save Changes
              </button>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="tab-panel">
              <h3>Change Password</h3>
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              
              <form onSubmit={handlePasswordSubmit}>
                <div>
                  <label>Current Password</label>
                  <div className="password-input-group">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div>
                  <label>New Password</label>
                  <div className="password-input-group">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div>
                  <label>Confirm New Password</label>
                  <div className="password-input-group">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={loading}
                >
                  <FaSave /> {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'delete-account' && (
            <div className="tab-panel">
              <h3>Delete Account</h3>
              <div className="warning-message">
                Warning: This action cannot be undone. All your data will be permanently deleted.
              </div>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <button 
                className="delete-account-btn" 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                <FaTrash /> {isDeleting ? 'Deleting...' : 'Delete My Account'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
