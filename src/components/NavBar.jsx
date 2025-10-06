import React from 'react';
import { DevicePhoneMobileIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Navbar = ({ isAuthenticated = false, user = null, onLogin, onLogout }) => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <DevicePhoneMobileIcon className="h-8 w-8 text-white" />
            <h1 className="text-white text-xl font-bold">Product Manager</h1>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 text-white">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    {user?.name ? (
                      <span className="text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
                    ) : (
                      <UserCircleIcon className="h-6 w-6" />
                    )}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user?.name || 'User'}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;