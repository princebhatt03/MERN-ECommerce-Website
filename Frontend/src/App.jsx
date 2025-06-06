import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import FrontPage from './pages/FrontPage';
import UserRegister from './pages/user/UserRegister';
import UserLogin from './pages/user/UserLogin';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './ProtectedRoute';
import UserProfileUpdate from './pages/user/UserProfileUpdate';

const App = () => {
  // Simple user state initialized from localStorage
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <FrontPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/userRegister"
        element={<UserRegister />}
      />
      <Route
        path="/userLogin"
        element={<UserLogin onLogin={setUser} />}
      />

      {/* Pass user prop here */}
      <Route
        path="/userProfile"
        element={<UserProfileUpdate user={user} />}
      />

      <Route
        path="*"
        element={<ErrorPage />}
      />
    </Routes>
  );
};

export default App;
