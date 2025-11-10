import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  Briefcase,
  FileText,
  Calendar,
  Settings,
  MoreHorizontal,
  X,
  ChevronRight,
  Target,
  TrendingUp,
  Eye,
  MessageCircle
} from 'lucide-react';
import useAuthStore from '../stores/authStore';
import useChatStore from '../stores/chatStore';

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const { profile } = useAuthStore();
  const { toggleChat } = useChatStore();
  const [showMore, setShowMore] = useState(false);

  const mainNavItems = [
    { 
      name: 'Home', 
      to: '/dashboard', 
      icon: Home,
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      name: 'Jobs', 
      to: '/jobs', 
      icon: Briefcase,
      gradient: 'from-green-500 to-green-600'
    },
    { 
      name: 'Chat', 
      to: '#', 
      icon: MessageCircle,
      gradient: 'from-purple-500 to-purple-600',
      onClick: () => toggleChat()
    },
    { 
      name: 'Portfolio', 
      to: '/portfolio', 
      icon: FileText,
      gradient: 'from-indigo-500 to-indigo-600'
    },
    { 
      name: 'More', 
      to: '#', 
      icon: MoreHorizontal,
      gradient: 'from-gray-500 to-gray-600',
      onClick: () => setShowMore(true)
    },
  ];

  const moreNavItems = [
    { 
      name: 'Skills Analysis', 
      to: '/skill-gap', 
      icon: Target,
      description: 'Analyze your skill gaps',
      gradient: 'from-yellow-500 to-yellow-600'
    },
    { 
      name: 'Resume Builder', 
      to: '/resume-builder', 
      icon: FileText,
      description: 'Create and manage your resume',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      name: 'Career Pathway', 
      to: '/career-pathway', 
      icon: TrendingUp,
      description: 'Plan your career growth',
      gradient: 'from-pink-500 to-pink-600'
    },
    { 
      name: 'Interviews', 
      to: '/interviews', 
      icon: Calendar,
      description: 'Prepare for your interviews',
      gradient: 'from-purple-500 to-purple-600'
    },
  ];

  // Add admin option if user is admin
  if (profile?.role === 'admin') {
    moreNavItems.push({
      name: 'Admin Dashboard',
      to: '/admin',
      icon: Settings,
      description: 'Admin panel & controls',
      gradient: 'from-red-500 to-red-600'
    });
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    if (path === '#') return false;
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (onClick?: () => void) => {
    if (onClick) {
      onClick();
    }
    setShowMore(false);
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100/50 safe-area-pb z-50 shadow-2xl">
        <div className="flex items-center justify-around h-20 px-2 max-w-md mx-auto">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            
            if (item.onClick) {
              return (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-300 touch-target min-w-[64px] group"
                >
                  <div className="relative mb-1">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-sm group-active:scale-95 transition-transform duration-200`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-600 group-active:text-gray-800 transition-colors">
                    {item.name}
                  </span>
                </button>
              );
            }
            
            return (
              <NavLink
                key={item.name}
                to={item.to}
                className="flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-300 touch-target min-w-[64px] group"
              >
                <div className="relative mb-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-active:scale-95 ${
                    active
                      ? `bg-gradient-to-br ${item.gradient} shadow-lg shadow-blue-500/25`
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <Icon className={`w-5 h-5 transition-colors duration-300 ${
                      active ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'
                    }`} />
                  </div>
                  {active && (
                    <>
                      <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-sm"></div>
                    </>
                  )}
                </div>
                <span className={`text-xs font-medium transition-colors duration-300 ${
                  active ? 'text-blue-600' : 'text-gray-600 group-hover:text-gray-700'
                }`}>
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* More Menu Overlay */}
      {showMore && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-fade-in">
          <div className="w-full bg-white rounded-t-3xl animate-slide-up max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 border-b border-gray-100/50">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">More Options</h3>
                  <p className="text-gray-600">Access all features & settings</p>
                </div>
                <button
                  onClick={() => setShowMore(false)}
                  className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl group"
                >
                  <X className="w-6 h-6 text-gray-600 group-hover:text-gray-800 transition-colors" />
                </button>
              </div>
            </div>

            {/* More Navigation Items */}
            <div className="p-6 pb-8 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-4">
                {moreNavItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.to);
                  
                  return (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      onClick={() => handleNavClick()}
                      className={`flex items-center p-5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                        active
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg'
                          : 'bg-gray-50/80 hover:bg-white border-2 border-transparent hover:shadow-lg hover:border-gray-200'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {active && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
                      )}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 transition-all duration-300 relative z-10 ${
                        active 
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl shadow-blue-500/25' 
                          : `bg-gradient-to-br ${item.gradient} group-hover:shadow-lg group-hover:scale-105`
                      }`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 relative z-10">
                        <h4 className={`font-bold text-lg mb-1 ${active ? 'text-blue-900' : 'text-gray-900'}`}>
                          {item.name}
                        </h4>
                        <p className={`text-sm ${active ? 'text-blue-700' : 'text-gray-600'}`}>
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight className={`w-6 h-6 transition-all duration-300 relative z-10 ${
                        active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1'
                      }`} />
                    </NavLink>
                  );
                })}
              </div>

              {/* User Info Section */}
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-3xl border-2 border-blue-100/50 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="flex items-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mr-4 shadow-xl shadow-blue-500/25">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">
                      {profile?.name || 'User'}
                    </span>
                    <p className="text-sm text-gray-600 mb-2">{profile?.email}</p>
                    {profile?.role === 'admin' && (
                      <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-100 rounded-full border border-blue-200">
                        <Settings className="w-3 h-3 mr-1" />
                        Administrator
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl text-center border border-green-100/50 shadow-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xl font-bold text-green-700 mb-1">24</div>
                  <div className="text-xs text-green-600 font-medium">Applications</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-2xl text-center border border-purple-100/50 shadow-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xl font-bold text-purple-700 mb-1">156</div>
                  <div className="text-xs text-purple-600 font-medium">Profile Views</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-2xl text-center border border-orange-100/50 shadow-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xl font-bold text-orange-700 mb-1">85%</div>
                  <div className="text-xs text-orange-600 font-medium">ATS Score</div>
                </div>
              </div>

              {/* Bottom Spacing for Safe Area */}
              <div className="h-8"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;