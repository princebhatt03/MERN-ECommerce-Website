import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import logo from '../assets/images/logo.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('userToken');

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    navigate('/userLogin');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Categories', path: '/categories' },
    { label: 'Cart', path: '/cart' },
    { label: 'Profile', path: '/profile' },
  ];

  return (
    <header className="bg-white shadow-md w-full fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link
          to="/"
          className="text-2xl font-bold text-orange-500">
          <img
            src={logo}
            alt="Logo"
            className="h-20 w-auto inline-block mr-2"
          />
        </Link>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <nav className="hidden md:flex space-x-6 items-center">
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-gray-700 hover:text-orange-500 transition-colors duration-200 ${
                  isActive ? 'font-semibold text-orange-500' : ''
                }`
              }>
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-500 font-medium transition-colors duration-200">
              Logout
            </button>
          )}
        </nav>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-white shadow-lg px-4 pb-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block text-gray-700 hover:text-orange-500 transition-colors duration-200 ${
                    isActive ? 'font-semibold text-orange-500' : ''
                  }`
                }>
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-red-500 font-medium">
                Logout
              </button>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
