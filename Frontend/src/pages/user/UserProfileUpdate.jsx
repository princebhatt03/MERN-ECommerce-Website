import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserProfileUpdate = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Load user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        fullName: parsedUser.fullName || '',
        username: parsedUser.username || '',
        email: parsedUser.email || '',
        mobile: parsedUser.mobile || '',
        password: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } else {
      navigate('/userLogin');
    }
  }, [navigate]);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openPasswordModal = e => {
    e.preventDefault();
    setErrorMsg('');
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmNewPassword
    ) {
      setErrorMsg('New passwords do not match!');
      return;
    }
    setShowPasswordModal(true);
  };

  const handleUpdate = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!user) {
      setErrorMsg('User data not loaded.');
      return;
    }

    if (!currentPassword) {
      setErrorMsg('Please enter your current password to confirm.');
      return;
    }

    const payload = {
      currentPassword,
      updates: {},
    };

    if (formData.fullName !== user.fullName)
      payload.updates.fullName = formData.fullName;
    if (formData.username !== user.username)
      payload.updates.username = formData.username;
    if (formData.email !== user.email) payload.updates.email = formData.email;
    if (formData.mobile !== user.mobile)
      payload.updates.mobile = formData.mobile;
    if (formData.newPassword) payload.updates.password = formData.newPassword;

    if (Object.keys(payload.updates).length === 0) {
      setErrorMsg('No changes to update.');
      return;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL ||
          import.meta.env.VITE_LOCAL_BACKEND_URL
        }/api/updateUserProfile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update localStorage with new user and token
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        setUser(data.user); // update local state
        setSuccessMsg('Profile updated successfully!');
        setShowPasswordModal(false);
        setCurrentPassword('');
      } else {
        setErrorMsg(data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Update Error:', error);
      setErrorMsg('Server error! Please try again later.');
    }
  };

  if (!formData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-lg p-10 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">
          Update Your Profile
        </h2>

        {(errorMsg || successMsg) && (
          <p
            className={`mb-4 text-center font-semibold ${
              errorMsg ? 'text-red-600' : 'text-green-600'
            }`}>
            {errorMsg || successMsg}
          </p>
        )}

        <form
          className="space-y-5"
          onSubmit={openPasswordModal}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password (leave blank if no change)"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="password"
            name="confirmNewPassword"
            placeholder="Confirm New Password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-xl border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-100 transition">
              Go Back to Home
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition">
              Update Profile
            </button>
          </div>
        </form>

        {showPasswordModal && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center text-indigo-700">
                Confirm Your Current Password
              </h3>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                autoFocus
              />

              {errorMsg && (
                <p className="text-red-600 text-center mb-2">{errorMsg}</p>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setCurrentPassword('');
                    setErrorMsg('');
                  }}
                  className="px-5 py-2 rounded-xl border border-gray-400 hover:bg-gray-100 transition">
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition">
                  Confirm & Update
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserProfileUpdate;
