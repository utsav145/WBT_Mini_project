import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './pages/AppRoutes';
import { AuthProvider } from './contexts/AuthContext'; // Import this

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
