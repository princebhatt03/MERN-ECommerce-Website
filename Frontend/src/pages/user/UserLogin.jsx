import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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

    const finalURL =
      import.meta.env.VITE_BACKEND_URL ||
      import.meta.env.VITE_LOCAL_BACKEND_URL;

    if (!finalURL) {
      setErrorMessage('❌ Backend URL is not configured in .env file');
      return;
    }

    // Basic validation before sending
    if (!formData.username.trim() || !formData.password.trim()) {
      setErrorMessage('❌ Please fill both username and password');
      return;
    }

    try {
      const response = await fetch(`${finalURL}/api/userLogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Make sure to only send the required fields, no extra data
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.token && data.user) {
        setSuccessMessage('✅ Login successful!');
        setErrorMessage('');

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Optional: console log for debugging
        console.log('Login successful:', data);

        navigate('/');
      } else {
        setErrorMessage(data.message || '❌ Invalid username or password.');
        setSuccessMessage('');

        // Optional: log backend message for debugging
        console.warn('Login failed:', data.message);
      }
    } catch (error) {
      console.error('❌ Login Error:', error);
      setErrorMessage('⚠️ Server error! Please try again later.');
      setSuccessMessage('');
    }

    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 4000);
  };

  const handleGoogleLogin = () => {
    alert('Google Login clicked! Add your OAuth flow here.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          Welcome Back
        </h2>

        {errorMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 mb-4 text-center font-semibold">
            {errorMessage}
          </motion.p>
        )}
        {successMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-600 mb-4 text-center font-semibold">
            {successMessage}
          </motion.p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
            required
            autoComplete="username"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
            required
            autoComplete="current-password"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg transition duration-300">
            Login
          </motion.button>
        </form>

        <div className="mt-6 flex flex-col items-center">
          <p className="text-gray-600 mb-4 font-semibold">Or login with</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full max-w-xs bg-white border border-gray-300 rounded-xl py-3 text-gray-700 font-semibold shadow-md hover:shadow-lg transition">
            {/* Google Icon SVG */}
            <svg
              className="w-6 h-6 mr-2"
              viewBox="0 0 533.5 544.3"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M533.5 278.4c0-17.7-1.6-35-4.7-51.7H272v97.9h146.8c-6.4 34.6-25.8 63.9-55.3 83.4v69.4h89.4c52.2-48 82.6-119 82.6-198.9z"
                fill="#4285F4"
              />
              <path
                d="M272 544.3c74.3 0 136.7-24.6 182.2-66.8l-89.4-69.4c-24.8 16.7-56.6 26.6-92.8 26.6-71.3 0-131.8-48-153.6-112.9H26.7v70.7c45.4 89.3 138.9 151.8 245.3 151.8z"
                fill="#34A853"
              />
              <path
                d="M118.4 323.8c-10.3-30.7-10.3-63.9 0-94.6V158.5H26.7c-37.3 74.3-37.3 162.9 0 237.2l91.7-71.9z"
                fill="#FBBC05"
              />
              <path
                d="M272 107.7c39.7 0 75.4 13.7 103.5 40.7l77.6-77.6C408.2 24.6 345.9 0 272 0 165.5 0 72 62.5 26.7 152.7l91.7 70.8c21.7-64.8 82.2-112.9 153.6-112.9z"
                fill="#EA4335"
              />
            </svg>
            Login with Google
          </motion.button>
        </div>

        <p className="mt-8 text-center text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/userRegister"
            className="text-indigo-600 font-semibold hover:underline">
            Register Now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default UserLogin;
