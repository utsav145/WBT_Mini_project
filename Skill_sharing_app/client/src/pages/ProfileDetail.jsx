import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { profileApi } from '../services/api';
import { FaUser, FaEnvelope, FaBuilding, FaGithub, FaInstagram, FaTwitter, FaGlobe } from 'react-icons/fa';
import '../styles/Profile.css';

const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileApi.getProfile(id);
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

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

  if (error || !profile) {
    return (
      <div className="profile-page-container">
        <div className="profile-page-error">
          <p>{error || 'Profile not found'}</p>
          <button className="btn-primary" onClick={() => navigate('/user')}>
          Back to Users
        </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
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
        <button className="profile-page-edit-button" onClick={() => navigate('/MessagingLanding')}>
          Message
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
    </div>
  );
};

export default ProfileDetail;
