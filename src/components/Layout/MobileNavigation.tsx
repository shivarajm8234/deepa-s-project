import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Search, 
  User, 
  FileText, 
  TrendingUp, 
  Briefcase, 
  Users, 
  MessageCircle,
  Settings 
} from 'lucide-react';

interface NavigationTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navigationTabs: NavigationTab[] = [
  { id: 'dashboard', label: 'Jobs', icon: <Search className="w-5 h-5" /> },
  { id: 'resume', label: 'Resume', icon: <FileText className="w-5 h-5" /> },
  { id: 'skills', label: 'Skills', icon: <TrendingUp className="w-5 h-5" /> },
  { id: 'pathway', label: 'Pathway', icon: <Briefcase className="w-5 h-5" /> },
  { id: 'portfolio', label: 'Portfolio', icon: <User className="w-5 h-5" /> },
  { id: 'forum', label: 'Forum', icon: <Users className="w-5 h-5" /> },
  { id: 'chat', label: 'AI Chat', icon: <MessageCircle className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNavigation = ({ activeTab, onTabChange }: MobileNavigationProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navigationTabs.slice(0, 5).map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-200",
              "min-w-0 flex-1",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-custom"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {tab.icon}
            <span className="text-xs font-medium truncate">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};