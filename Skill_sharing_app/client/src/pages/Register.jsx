import React, { useState, useEffect } from 'react';
import { register } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import '../styles/Register.css';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    hasLetter: false,
    hasNumber: false,
    hasSpecial: false,
    match: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Validate password requirements
    const newRequirements = {
      length: form.password.length >= 6,
      hasLetter: /[a-zA-Z]/.test(form.password),
      hasNumber: /\d/.test(form.password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
      match: form.password && form.password === form.confirmPassword
    };
    setPasswordRequirements(newRequirements);
  }, [form.password, form.confirmPassword]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const res = await register(form);
      console.log('Registration response:', res); // Debug log
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err); // Debug log
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join SkillShare to connect with professionals</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="auth-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="auth-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="auth-input"
                required
                minLength="6"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            <div className="password-requirements">
              <h4>Password Requirements:</h4>
              <ul>
                <li className={passwordRequirements.length ? "valid" : "invalid"}>
                  {passwordRequirements.length ? <FaCheck /> : <FaTimes />} At least 6 characters
                </li>
                <li className={passwordRequirements.hasLetter ? "valid" : "invalid"}>
                  {passwordRequirements.hasLetter ? <FaCheck /> : <FaTimes />} Contains a letter
                </li>
                <li className={passwordRequirements.hasNumber ? "valid" : "invalid"}>
                  {passwordRequirements.hasNumber ? <FaCheck /> : <FaTimes />} Contains a number
                </li>
                <li className={passwordRequirements.hasSpecial ? "valid" : "invalid"}>
                  {passwordRequirements.hasSpecial ? <FaCheck /> : <FaTimes />} Contains a special character
                </li>
              </ul>
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="auth-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {form.confirmPassword && (
              <div className="password-requirements">
                <ul>
                  <li className={passwordRequirements.match ? "valid" : "invalid"}>
                    {passwordRequirements.match ? <FaCheck /> : <FaTimes />} Passwords match
                  </li>
                </ul>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
      </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
