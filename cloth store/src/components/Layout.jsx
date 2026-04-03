import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, PlusCircle, List, BarChart2 } from 'lucide-react';

const Layout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container" style={{ flexDirection: 'column' }}>
      <nav className="nav-bar">
        <div style={{ display: 'flex', flex: 1, gap: '8px' }}>
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Home size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Dashboard
          </NavLink>
          <NavLink to="/add-entry" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <PlusCircle size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Add Entry
          </NavLink>
          <NavLink to="/records" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <List size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Records
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BarChart2 size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Reports
          </NavLink>
        </div>
        <button onClick={handleLogout} className="nav-item" style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
          <LogOut size={18} style={{ verticalAlign: 'middle' }} />
        </button>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
