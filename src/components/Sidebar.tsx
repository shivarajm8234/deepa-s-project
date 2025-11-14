import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Calendar,
  Settings,
  TrendingUp,
} from 'lucide-react';
import useAuthStore from '../stores/authStore';

export default function Sidebar() {
  const { profile } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', to: '/jobs', icon: Briefcase },
    { name: 'Resume Builder', to: '/resume-builder', icon: FileText },
    { name: 'Chat Assistant', to: '/chat', icon: MessageSquare },
    { name: 'Interviews', to: '/interviews', icon: Calendar },
    { name: 'Career Pathway', to: '/career-pathway', icon: TrendingUp },
  ];

  if (profile?.role === 'admin') {
    navigation.push({ name: 'Admin', to: '/admin', icon: Settings });
  }

  return (
    <nav className="hidden lg:block w-64 bg-white shadow-sm h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}