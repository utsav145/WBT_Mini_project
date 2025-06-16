import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleReset = (e) => {
    e.preventDefault();
    alert(`Password reset link sent to ${email}`);
  };

  return (
    <div className="forgot-container">
      <h2>Reset Password</h2>
      <p className="subtitle">Enter your email and we’ll send you a link to reset your password.</p>
      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      <div className="toggle-auth">
        <p>Back to <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default ForgotPassword;
