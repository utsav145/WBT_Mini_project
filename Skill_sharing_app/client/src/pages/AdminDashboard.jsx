import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { profileApi } from '../services/api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    positionTitle: '',
    companyName: '',
    bio: '',
    fullBio: '',
    image: '',
    bannerImage: '',
    twitter: '',
    instagram: '',
    githubLink: '',
    workLink: '',
    experienceSummary: '',
    popularWork: '',
    projectDescription: '',
    skills: [],
    price: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [imagePreview, setImagePreview] = useState({
    profile: null,
    banner: null
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await profileApi.getProfile(user.id);
        if (data) {
          // Ensure skills is always an array
          const profileData = {
            ...data,
            skills: Array.isArray(data.skills) ? data.skills : 
                   typeof data.skills === 'string' ? JSON.parse(data.skills) : []
          };
          setFormData(profileData);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillAdd = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleSkillRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(prev => ({
      ...prev,
      [type]: previewUrl
    }));

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Upload image to server
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      
      // Update form data with the uploaded image URL
      setFormData(prev => ({
        ...prev,
        [type === 'profile' ? 'image' : 'bannerImage']: `http://localhost:5000${data.imageUrl}`
      }));

      setSuccess('Image uploaded successfully');
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err.message || 'Failed to upload image');
      // Clear preview on error
      setImagePreview(prev => ({
        ...prev,
        [type]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Prepare the profile data
      const profileData = {
        ...formData,
        userId: user.id,
        skills: JSON.stringify(formData.skills),
        rating: formData.rating || 4.5,
        price: formData.price || 85
      };

      let response;
      if (formData.id) {
        // Update existing profile
        response = await profileApi.updateProfile(user.id, profileData);
      } else {
        // Create new profile
        response = await profileApi.createProfile(profileData);
      }

      // Store the updated profile in localStorage
      localStorage.setItem('userProfile', JSON.stringify(response));

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading && !formData.id) {
    return (
      <div className="admin-loading-overlay">
        <div className="admin-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Edit Profile</h1>
      
      {error && (
        <div className="admin-alert admin-alert-error">
          {error}
        </div>
      )}
      
      {success && (
        <div className="admin-alert admin-alert-success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-profile-form">
        <div className="admin-form-section">
          <h2>Basic Information</h2>
          
          <div className="admin-form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="admin-form-control"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="admin-form-control"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Position Title:</label>
            <input
              type="text"
              name="positionTitle"
              value={formData.positionTitle}
              onChange={handleChange}
              className="admin-form-control"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Company Name:</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="admin-form-control"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Price (per hour):</label>
            <div className="admin-price-input">
              <span className="admin-price-currency">$</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="admin-input"
                min="0"
                step="0.01"
                placeholder="Enter your hourly rate"
                required
              />
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h2>Images</h2>
          
          <div className="admin-form-group">
            <label>Profile Image:</label>
            <div className="admin-image-upload-container">
              <div className="admin-image-preview-container">
                {(imagePreview.profile || formData.image) && (
                  <img
                    src={imagePreview.profile || formData.image}
                    alt="Profile preview"
                    className="admin-image-preview"
                  />
                )}
              </div>
              <div className="admin-file-input-container">
                <label className="admin-file-input-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'profile')}
                    className="admin-file-input"
                  />
                  <span>Choose Profile Image</span>
                </label>
                <p className="admin-file-hint">Max size: 5MB. Supported formats: JPG, PNG, GIF</p>
              </div>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Banner Image:</label>
            <div className="admin-image-upload-container">
              <div className="admin-image-preview-container">
                {(imagePreview.banner || formData.bannerImage) && (
                  <img
                    src={imagePreview.banner || formData.bannerImage}
                    alt="Banner preview"
                    className="admin-image-preview"
                  />
                )}
              </div>
              <div className="admin-file-input-container">
                <label className="admin-file-input-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'banner')}
                    className="admin-file-input"
                  />
                  <span>Choose Banner Image</span>
                </label>
                <p className="admin-file-hint">Max size: 5MB. Supported formats: JPG, PNG, GIF</p>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h2>Social Links</h2>
          
          <div className="admin-form-group">
            <label>Twitter:</label>
            <input
              type="url"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              className="admin-form-control"
              placeholder="https://twitter.com/username"
            />
          </div>

          <div className="admin-form-group">
            <label>Instagram:</label>
            <input
              type="url"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="admin-form-control"
              placeholder="https://instagram.com/username"
            />
          </div>

          <div className="admin-form-group">
            <label>GitHub:</label>
            <input
              type="url"
              name="githubLink"
              value={formData.githubLink}
              onChange={handleChange}
              className="admin-form-control"
              placeholder="https://github.com/username"
            />
          </div>

          <div className="admin-form-group">
            <label>Work Link:</label>
            <input
              type="url"
              name="workLink"
              value={formData.workLink}
              onChange={handleChange}
              className="admin-form-control"
              placeholder="https://example.com/work"
            />
          </div>
        </div>

        <div className="admin-form-section">
          <h2>Work Experience</h2>
          
          <div className="admin-form-group">
            <label>Experience Summary:</label>
            <textarea
              name="experienceSummary"
              value={formData.experienceSummary}
              onChange={handleChange}
              className="admin-form-control"
              rows="4"
            />
          </div>
        </div>

        <div className="admin-form-section">
          <h2>Project Details</h2>
          
          <div className="admin-form-group">
            <label>Popular Work:</label>
            <input
              type="text"
              name="popularWork"
              value={formData.popularWork}
              onChange={handleChange}
              className="admin-form-control"
            />
          </div>

          <div className="admin-form-group">
            <label>Project Description:</label>
            <textarea
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleChange}
              className="admin-form-control"
              rows="4"
            />
          </div>
        </div>

        <div className="admin-form-section">
          <h2>Skills</h2>
          
          <div className="admin-add-skill-container">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="admin-form-control"
              placeholder="Add a skill"
            />
            <button type="button" onClick={handleSkillAdd} className="admin-btn-primary">Add</button>
          </div>

          <div className="admin-skills-container">
            {formData.skills.map((skill, index) => (
              <div key={index} className="admin-skill-tag">
                {skill}
                <button
                  type="button"
                  onClick={() => handleSkillRemove(index)}
                  className="remove-skill"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-form-section">
          <h2>Bio</h2>
          
          <div className="admin-form-group">
            <label>Short Bio:</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="admin-form-control"
              rows="3"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Full Bio:</label>
            <textarea
              name="fullBio"
              value={formData.fullBio}
              onChange={handleChange}
              className="admin-form-control"
              rows="6"
              required
            />
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminDashboard;
