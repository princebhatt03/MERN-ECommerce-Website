import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL ||
          import.meta.env.VITE_LOCAL_BACKEND_URL
        }/api/userLogin`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Login successful!');
        setErrorMessage('');

        // Store token and user data in localStorage
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));

        // Navigate to home page
        navigate('/');
      } else {
        setErrorMessage(data.message || 'Invalid username or password.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setErrorMessage('Server error! Please try again later.');
      setSuccessMessage('');
    }

    // Clear messages after delay
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">User Login</h2>

        {errorMessage && (
          <p className="text-red-500 mb-4 text-sm">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-600 mb-4 text-sm">{successMessage}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            autoComplete="username"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            autoComplete="current-password"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-300">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
