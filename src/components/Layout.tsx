import { Outlet, NavLink } from 'react-router-dom';
import { MessageCircle, LayoutDashboard, Briefcase, FileText, BarChart, TrendingUp, Calendar } from 'lucide-react';
import MobileNavigation from './MobileNavigation';
import Header from './Header';
import useChatStore from '../stores/chatStore';

export default function Layout() {
  const { toggleChat } = useChatStore();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-24 lg:pb-0"> {/* Increased padding for mobile nav */}
        <div className="lg:flex">
          {/* Desktop Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block w-64 bg-white shadow-sm h-[calc(100vh-4rem)] sticky top-16">
            <nav className="p-4">
              <ul className="space-y-2">
                {[
                  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
                  { name: 'Jobs', to: '/jobs', icon: Briefcase },
                  { 
                    name: 'AI Chat Assistant', 
                    to: '#', 
                    icon: MessageCircle,
                    onClick: () => toggleChat()
                  },
                  { name: 'Portfolio', to: '/portfolio', icon: FileText },
                  { name: 'Resume Builder', to: '/resume-builder', icon: FileText },
                  { name: 'Skill Gap Analysis', to: '/skill-gap', icon: BarChart },
                  { name: 'Career Pathway', to: '/career-pathway', icon: TrendingUp },
                  { name: 'Interviews', to: '/interviews', icon: Calendar },
                ].map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={item.name}>
                      {item.onClick ? (
                        <button
                          onClick={item.onClick}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-gray-700 hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                        </button>
                      ) : (
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                            }`
                          }
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                        </NavLink>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
          
          {/* Main Content */}
          <div className="flex-1 min-h-screen">
            <div className="lg:p-6 p-4">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
      
      {/* Mobile Navigation - Only visible on mobile */}
      <div className="lg:hidden">
        <MobileNavigation />
      </div>
    </div>
  );
}