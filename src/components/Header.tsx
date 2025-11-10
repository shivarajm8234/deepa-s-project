import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../stores/authStore';

export default function Header() {
  const { profile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  return (
    <header className="bg-white/95 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-bold text-gray-900">JobPortal</h1>
              <div className="text-xs text-gray-500 hidden sm:block">Your Career Partner</div>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">


            {/* Profile */}
            <div className="relative">
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="flex items-center space-x-3 bg-gray-50 rounded-xl p-2 hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden lg:block">
                  <div className="text-sm font-medium text-gray-900">
                    {profile?.name || 'User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {profile?.role === 'admin' ? 'Administrator' : 'Job Seeker'}
                  </div>
                </div>
              </button>
              
              {/* Desktop Dropdown */}
              <div className="hidden lg:block">
                {showMobileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">{profile?.name || 'User'}</div>
                      <div className="text-xs text-gray-500 truncate">{profile?.email}</div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('/resume-builder');
                          setShowMobileMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">Edit Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowMobileMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-2">

            {profile && (
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="flex items-center space-x-2 bg-gray-50 rounded-xl p-1.5 hover:bg-gray-100 transition-colors"
              >
                <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                {showMobileMenu ? <X className="w-4 h-4 text-gray-500" /> : <Menu className="w-4 h-4 text-gray-500" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-100 py-4 bg-white/95 backdrop-blur-lg">
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{profile?.name || 'User'}</div>
                <div className="text-sm text-gray-600">{profile?.email}</div>
                {profile?.role === 'admin' && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full mt-1">
                    <Settings className="w-3 h-3 mr-1" />
                    Admin
                  </span>
                )}
              </div>
            </div>
            
            
            <div className="space-y-2">
              <button 
                onClick={() => {
                  navigate('/resume-builder');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Edit Profile</span>
              </button>
              
              
              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}