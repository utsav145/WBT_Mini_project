import React, { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import { profileApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../styles/User.css';
import { FaSearch } from 'react-icons/fa';

const User = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const data = await profileApi.getAllProfiles();
        // Filter out the current user's profile
        const otherProfiles = data.filter(profile => profile.id !== user?.id);
        setProfiles(otherProfiles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [user]);

  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch = 
      profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(profile.skills) ? profile.skills : JSON.parse(profile.skills || '[]')).some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesSearch;
  });

  // Custom search container and icon styles
  const searchContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '3rem',
    position: 'relative',
    padding: '0 1rem',
  };

  const searchWrapperStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '600px',
  };

  const searchIconStyle = {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#74767E',
    fontSize: '1.1rem',
    zIndex: 10,
  };

  const searchBarStyle = {
    padding: '1rem 1.5rem 1rem 3rem',
    width: '100%',
    border: '2px solid #E4E5E7',
    borderRadius: '30px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profiles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error loading profiles</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1>Discover Skilled Professionals</h1>
      
      <div style={searchContainerStyle}>
        <div style={searchWrapperStyle}>
          <FaSearch style={searchIconStyle} />
          <input
            type="text"
            placeholder="Search by skill, name, or interest..."
            style={searchBarStyle}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card-grid">
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))
        ) : (
          <p className="no-results">No profiles found.</p>
        )}
      </div>
    </div>
  );
};

export default User;
