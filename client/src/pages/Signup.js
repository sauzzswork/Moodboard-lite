import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/signup`, // Use environment variable here
        signupData
      );
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-center">
      <div className="login-card">
        <h2>Create Account</h2>
        {error && (
          <div style={{
            color: "#d32f2f",
            marginBottom: "0.8rem",
            fontWeight: "bold",
            fontSize: "1rem"
          }}>{error}</div>
        )}
        <form onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength="3"
            placeholder="Choose a username"
            id="username"
            autoFocus
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            id="email"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            placeholder="Create a password"
            id="password"
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
            id="confirmPassword"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
