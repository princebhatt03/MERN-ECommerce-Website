import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
        }/api/userRegister`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('User registered successfully!');
        setErrorMessage('');

        // Save JWT token and user data in localStorage
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));

        // Optional: Redirect after successful registration
        setTimeout(() => {
          navigate('/'); // Redirect to home or dashboard
        }, 1500);
      } else {
        setErrorMessage(data.message || 'Error registering user.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      setErrorMessage('Server error! Please try again later.');
      setSuccessMessage('');
    }

    // Clear messages after a few seconds
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create an Account
        </h2>

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
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="new-password"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-300">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRegister;
