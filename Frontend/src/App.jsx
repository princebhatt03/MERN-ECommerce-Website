import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FrontPage from './pages/FrontPage';
import UserRegister from './pages/user/UserRegister';
import UserLogin from './pages/user/UserLogin';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
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
        element={<UserLogin />}
      />
      <Route
        path="*"
        element={<ErrorPage />}
      />
    </Routes>
  );
};

export default App;
