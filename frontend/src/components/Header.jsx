import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Menu, X, LogOut, User, LayoutDashboard, Settings } from 'lucide-react';
import { authApi } from '../services/api';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Retrieve user details from localStorage
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const handleLogout = () => {
    authApi.logout();
    setShowDropdown(false);
    navigate('/');
    // Trigger window storage event or force state update if necessary (re-render)
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Ride Options', path: '/options' },
    { name: 'Why Choose Us', path: '/why' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <nav className="glass-panel sticky top-0 w-full z-50 px-6 py-3.5 shadow-xl border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-safety-pink to-safety-purple text-white shadow-glow-pink group-hover:scale-105 transition-all duration-300">
            <Shield className="w-5.5 h-5.5 animate-pulse" />
          </div>
          <span className="font-black text-2xl tracking-wider bg-gradient-to-r from-safety-pink to-safety-purple bg-clip-text text-transparent group-hover:opacity-95 transition-opacity">
            GONARI
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-semibold text-sm transition-all duration-300 py-1.5 px-4 rounded-full ${
                isActive(link.path)
                  ? 'text-safety-pink bg-safety-pink/10 border border-safety-pink/15 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth / Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/80 border border-white/10 hover:border-safety-pink transition-all duration-300"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-safety-pink to-safety-purple flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-gray-200">{user.name}</span>
                <span className="text-xs bg-safety-pink/20 text-safety-pink px-2 py-0.5 rounded-full uppercase text-[10px]">
                  {user.role}
                </span>
              </button>

              {/* Profile Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-card p-2 shadow-2xl border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
                  {user.role === 'RIDER' && (
                    <>
                      <Link
                        to="/book"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-gray-200 hover:text-white transition-colors"
                      >
                        <Shield className="w-4 h-4 text-safety-pink" />
                        <span>Book a Ride</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-gray-200 hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4 text-safety-pink" />
                        <span>My Profile & SOS</span>
                      </Link>
                    </>
                  )}
                  {user.role === 'DRIVER' && (
                    <Link
                      to="/driver"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-gray-200 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-safety-pink" />
                      <span>Driver Dashboard</span>
                    </Link>
                  )}
                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-gray-200 hover:text-white transition-colors"
                    >
                      <Settings className="w-4 h-4 text-safety-pink" />
                      <span>Admin Verification</span>
                    </Link>
                  )}
                  <hr className="my-1 border-white/5" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/signin"
                className="px-5 py-2.5 rounded-xl font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-safety-pink to-safety-purple hover:from-fuchsia-500 hover:to-violet-600 text-white shadow-glow-pink hover:shadow-lg transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/5 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`px-3 py-2 rounded-xl text-sm font-medium ${
                isActive(link.path) ? 'bg-safety-pink/15 text-safety-pink' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-white/5" />
          {user ? (
            <div className="flex flex-col gap-2">
              <div className="px-3 py-2 text-sm text-gray-400">
                Logged in as <span className="font-bold text-gray-200">{user.name}</span> ({user.role})
              </div>
              {user.role === 'RIDER' && (
                <>
                  <Link
                    to="/book"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-safety-pink" />
                    Book Ride
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-safety-pink" />
                    My Profile & SOS
                  </Link>
                </>
              )}
              {user.role === 'DRIVER' && (
                <Link
                  to="/driver"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-safety-pink" />
                  Driver Dashboard
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-safety-pink" />
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="mx-3 mt-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 px-3 pb-2">
              <Link
                to="/signin"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 rounded-xl text-center font-semibold text-gray-300 hover:bg-white/5 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 rounded-xl text-center font-semibold bg-gradient-to-r from-safety-pink to-safety-purple text-white shadow-glow-pink transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
