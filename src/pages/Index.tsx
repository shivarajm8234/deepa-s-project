import { useState } from 'react';
import { MobileNavigation } from '@/components/Layout/MobileNavigation';
import { SearchFilters } from '@/components/Dashboard/SearchFilters';
import { JobCard } from '@/components/Dashboard/JobCard';
import { AIChatBot } from '@/components/Chat/AIChatBot';
import { ResumeBuilder } from '@/components/Resume/ResumeBuilder';
import { SkillGapAnalysis } from '@/components/Skills/SkillGapAnalysis';
import { CareerPathway } from '@/components/Career/CareerPathway';
import { PortfolioCreator } from '@/components/Portfolio/PortfolioCreator';
import { SettingsProfile } from '@/components/Settings/SettingsProfile';
import { mockJobs, Job } from '@/data/mockJobs';
import { 
  Zap, 
  Users, 
  TrendingUp, 
  MessageCircle,
  Bell,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [filters, setFilters] = useState({
    query: '',
    location: '',
    jobType: 'all',
    isGovernment: false
  });

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  const handleLocationChange = (location: string) => {
    setFilters(prev => ({ ...prev, location }));
  };

  const handleJobTypeChange = (type: string) => {
    setFilters(prev => ({ ...prev, jobType: type }));
  };

  const handleSectorToggle = (isGovernment: boolean) => {
    setFilters(prev => ({ ...prev, isGovernment }));
  };

  const handleSaveJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
    ));
    toast({
      title: "Job saved!",
      description: "Added to your saved jobs list.",
    });
  };

  const handleApplyJob = (jobId: string) => {
    toast({
      title: "Redirecting to application...",
      description: "Opening job application page.",
    });
  };

  // Filter jobs based on current filters
  const filteredJobs = jobs.filter(job => {
    const matchesQuery = !filters.query || 
      job.title.toLowerCase().includes(filters.query.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.query.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(filters.query.toLowerCase()));
    
    const matchesLocation = !filters.location || 
      job.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesJobType = filters.jobType === 'all' || job.type === filters.jobType;
    
    const matchesSector = job.isGovernment === filters.isGovernment;

    return matchesQuery && matchesLocation && matchesJobType && matchesSector;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Find Your Dream Job</h1>
          <p className="text-muted-foreground">AI-powered job matching for your career</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-primary rounded-lg text-primary-foreground">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5" />
            <span className="font-semibold">AI Matches</span>
          </div>
          <p className="text-2xl font-bold">
            {filteredJobs.filter(job => job.aiMatch > 80).length}
          </p>
          <p className="text-sm opacity-90">High-match jobs</p>
        </div>
        
        <div className="p-4 bg-gradient-secondary rounded-lg text-secondary-foreground">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">New Jobs</span>
          </div>
          <p className="text-2xl font-bold">{filteredJobs.length}</p>
          <p className="text-sm opacity-90">Available positions</p>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        onSearch={handleSearch}
        onLocationChange={handleLocationChange}
        onJobTypeChange={handleJobTypeChange}
        onSectorToggle={handleSectorToggle}
        activeFilters={filters}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredJobs.length} jobs found
          </span>
          {filters.isGovernment && (
            <Badge variant="secondary">Government Sector</Badge>
          )}
        </div>
        <Button variant="ghost" size="sm">
          Sort by: Relevance
        </Button>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onSave={handleSaveJob}
            onApply={handleApplyJob}
          />
        ))}
        
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search filters or explore different keywords.
            </p>
            <Button onClick={() => setFilters({ query: '', location: '', jobType: 'all', isGovernment: false })}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'chat':
        return <AIChatBot />;
      case 'resume':
        return <ResumeBuilder />;
      case 'skills':
        return <SkillGapAnalysis />;
      case 'pathway':
        return <CareerPathway />;
      case 'portfolio':
        return <PortfolioCreator />;
      case 'forum':
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Community Forum</h2>
            <p className="text-muted-foreground">Coming soon - Connect with other job seekers and professionals</p>
          </div>
        );
      case 'settings':
        return <SettingsProfile />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header for chat mode */}
      {activeTab === 'chat' && (
        <div className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="flex items-center gap-3 p-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveTab('dashboard')}
            >
              ← Back
            </Button>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span className="font-semibold">AI Career Assistant</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`${activeTab === 'chat' ? 'h-[calc(100vh-80px)]' : 'pb-20 px-4 pt-6'}`}>
        {activeTab === 'chat' ? (
          <div className="h-full">
            {renderTabContent()}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {renderTabContent()}
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      {activeTab !== 'chat' && (
        <MobileNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      )}
    </div>
  );
};

export default Index;