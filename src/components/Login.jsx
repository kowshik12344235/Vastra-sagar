import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card card animate-fade">
        <div className="logo-section">
          <h1>Vastra Sagar</h1>
          <p>Sales Dashboard Login</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label><User size={14} style={{ marginRight: '5px' }} /> Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label><Lock size={14} style={{ marginRight: '5px' }} /> Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          
          {error && <p style={{ color: 'var(--danger)', marginBottom: '15px' }}>{error}</p>}
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            LOGIN
          </button>
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '0.8rem' }}>Default: admin / admin</p>
      </div>
    </div>
  );
};

export default Login;
