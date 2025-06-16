import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // 👈
import User from './User';
import Login from './Login';
import Register from './Register';
import ProfileDetail from './ProfileDetail';
import ProfileCard from './ProfileCard';
import AppLayout from './AppLayout';
import ForgotPassword from './ForgotPassword';
import AdminDashboard from './AdminDashboard';
import MessagingLanding from './MessagingLanding';
import ContactUs from './ContactUs';
import AboutUs from './AboutUs';
import Home from './Home';
import SettingsPage from './SettingsPage';
import ProtectedRoute from '../components/ProtectedRoute';
import Profile from './Profile'; 
const user = {
  name: 'John Doe',
  status: 'Independent Worker',
  image: '/profile.jpg',
};

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/about-us" element={<AboutUs />} />
      
      <Route
        element={
          <ProtectedRoute>
            <AppLayout isLoggedIn={isLoggedIn} user={user} />
          </ProtectedRoute>
        }
      >
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/User" element={<User />} />
        <Route path="/profile/:id" element={<ProfileDetail />} />
        <Route path="/profile-card" element={<ProfileCard profile={user} />} />
        <Route path="/MessagingLanding" element={<MessagingLanding />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<Profile />} /> {/* Add Profile route */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
