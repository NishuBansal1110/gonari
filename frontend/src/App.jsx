import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Options from './pages/Options';
import WhyChooseUs from './pages/WhyChooseUs';
import ContactUs from './pages/ContactUs';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import BookRide from './pages/BookRide';
import LiveTracking from './pages/LiveTracking';
import DriverDashboard from './pages/DriverDashboard';
import AdminPanel from './pages/AdminPanel';
import UserProfile from './pages/UserProfile';

// Protected Route wrapper component
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  
  if (!token || !userJson) {
    return <Navigate to="/signin" replace />;
  }

  const user = JSON.parse(userJson);
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If not authorized for this role, redirect to their role-specific dashboard or home
    if (user.role === 'DRIVER') return <Navigate to="/driver" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/book" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-safety-dark text-slate-100">
        <Header />
        
        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/options" element={<Options />} />
            <Route path="/why" element={<WhyChooseUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Rider Only Routes */}
            <Route
              path="/book"
              element={
                <ProtectedRoute allowedRoles={['RIDER']}>
                  <BookRide />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracking"
              element={
                <ProtectedRoute allowedRoles={['RIDER']}>
                  <LiveTracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['RIDER']}>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            {/* Driver Only Routes */}
            <Route
              path="/driver"
              element={
                <ProtectedRoute allowedRoles={['DRIVER']}>
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Only Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* Catch-all fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
