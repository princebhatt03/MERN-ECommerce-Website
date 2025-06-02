import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FrontPage from './pages/FrontPage';

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<FrontPage />}
      />
    </Routes>
  );
};

export default App;
