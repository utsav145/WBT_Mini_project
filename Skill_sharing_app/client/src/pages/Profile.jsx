// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { profileApi } from '../services/api';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaGlobe, FaBuilding, FaInstagram, FaTwitter } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
        try {
        if (!isAuthenticated || !user) {
          setError('Please log in to view your profile');
          setLoading(false);
          return;
        }

        const response = await profileApi.getProfile(user.id);
        // Check if we have profile data in the response
        if (response && response.id) {
          setProfile(response);
        } else {
          setError('Profile not found. Please create your profile.');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, user]);

  const handleEditProfile = () => {
    navigate('/admin-dashboard');
  };

  if (loading) {
    return (
      <div className="profile-page-container">
        <div className="profile-page-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page-error">
        <p>{error}</p>
        <button className="btn-primary" onClick={handleEditProfile}>
          Create Profile
        </button>
      </div>
    );
  }

  if (!profile) {
  return (
      <div className="profile-page-container">
        <div className="profile-page-error">
          <p>No Profile Found!</p>
          <button className="btn-primary" onClick={handleEditProfile}>
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  // Parse skills if they're stored as a JSON string
  const skills = typeof profile.skills === 'string' 
    ? JSON.parse(profile.skills) 
    : profile.skills || [];

  return (
    <div className="profile-page-container">
      {loading ? (
        <div className="profile-page-loading">
          <div className="spinner"></div>
          <p>Loading profile...</p>
            </div>
      ) : error ? (
        <div className="profile-page-error">
          <p>{error}</p>
          <button className="btn-primary" onClick={handleEditProfile}>
            Create Profile
              </button>
        </div>
      ) : (
        <>
          <div className="profile-page-header" style={{ backgroundImage: `url(${profile.bannerImage})` }}>
            <div className="profile-page-image-container">
              {profile.image ? (
                <img src={profile.image} alt={profile.name} className="profile-page-image" />
              ) : (
                <div className="profile-page-image-placeholder">
                  <FaUser size={48} />
                </div>
              )}
            </div>
            <button className="profile-page-edit-button" onClick={handleEditProfile}>
              Edit Profile
            </button>
          </div>

          <div className="profile-page-content">
            <h1 className="profile-page-name">{profile.name}</h1>
            <p className="profile-page-position">{profile.positionTitle}</p>
            <p className="profile-page-bio">{profile.bio}</p>
            {profile.fullBio && (
              <div className="profile-page-section">
                <h2 className="profile-page-section-title">About Me</h2>
                <p className="profile-page-full-bio">{profile.fullBio}</p>
        </div>
            )}

            <div className="profile-page-section">
              <h2 className="profile-page-section-title">Contact Information</h2>
              <div className="profile-page-contact-info">
                {profile.email && (
                  <div className="profile-page-contact-item">
                    <FaEnvelope />
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile.companyName && (
                  <div className="profile-page-contact-item">
                    <FaBuilding />
                    <span>{profile.companyName}</span>
          </div>
                )}
              </div>
              </div>
              
            <div className="profile-page-section">
              <h2 className="profile-page-section-title">Social Links</h2>
              <div className="profile-page-social-links">
                {profile.githubLink && (
                  <a href={profile.githubLink} target="_blank" rel="noopener noreferrer" className="profile-page-social-link">
                    <FaGithub />
                    GitHub
                  </a>
                )}
                {profile.instagram && (
                  <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="profile-page-social-link">
                    <FaInstagram />
                    Instagram
                  </a>
                )}
                {profile.twitter && (
                  <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="profile-page-social-link">
                    <FaTwitter />
                    Twitter
                  </a>
                )}
                {profile.workLink && (
                  <a href={profile.workLink} target="_blank" rel="noopener noreferrer" className="profile-page-social-link">
                    <FaGlobe />
                    Portfolio
                  </a>
                )}
              </div>
            </div>

            {profile.experienceSummary && (
              <div className="profile-page-section">
                <h2 className="profile-page-section-title">Experience Summary</h2>
                <p className="profile-page-experience-summary">{profile.experienceSummary}</p>
              </div>
            )}

            {profile.popularWork && (
              <div className="profile-page-section">
                <h2 className="profile-page-section-title">Popular Work</h2>
                <p className="profile-page-popular-work">{profile.popularWork}</p>
              </div>
            )}

            {profile.projectDescription && (
              <div className="profile-page-section">
                <h2 className="profile-page-section-title">Project Description</h2>
                <p className="profile-page-project-description">{profile.projectDescription}</p>
              </div>
            )}

            {profile.skills && (
              <div className="profile-page-section">
                <h2 className="profile-page-section-title">Skills</h2>
                <div className="profile-page-skills-list">
                  {(() => {
                    try {
                      // Parse the skills string into an array
                      const skillsArray = JSON.parse(profile.skills);
                      return skillsArray.map((skill, index) => (
                        <span key={index} className="profile-page-skill-tag">
                          {skill}
                        </span>
                      ));
                    } catch (error) {
                      console.error('Error parsing skills:', error);
                      return null;
                    }
                  })()}
              </div>
              </div>
            )}
              
            <div className="profile-page-section">
              <h2 className="profile-page-section-title">Pricing & Rating</h2>
              <div className="profile-page-pricing-info">
                {profile.price && (
                  <div className="profile-page-price">
                    <span className="price-label">Hourly Rate:</span>
                    <span className="price-value">${profile.price}/hr</span>
                  </div>
                )}
                {profile.rating && (
                  <div className="profile-page-rating">
                    <span className="rating-label">Rating:</span>
                    <span className="rating-value">{profile.rating}/5</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
