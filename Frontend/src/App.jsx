import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FrontPage from './pages/FrontPage';
import UserRegister from './pages/user/UserRegister';
import UserLogin from './pages/user/UserLogin';

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<FrontPage />}
      />
      <Route
        path="/userRegister"
        element={<UserRegister />}
      />
      <Route
        path="/userLogin"
        element={<UserLogin />}
      />
    </Routes>
  );
};

export default App;
