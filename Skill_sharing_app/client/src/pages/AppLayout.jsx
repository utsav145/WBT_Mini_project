// src/layouts/AppLayout.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom'; // ⬅️ Import Outlet from React Router
import '../styles/AppLayout.css';

function AppLayout() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className="main-layout">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className={`main-panel ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <Navbar />
        <div className="page-content">
          <Outlet /> {/* ⬅️ This renders the nested route's component */}
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
