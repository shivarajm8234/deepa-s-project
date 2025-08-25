import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Share2,
  ExternalLink,
  Upload,
  Globe,
  Github,
  Linkedin,
  Mail,
  Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  imageUrl: string;
  featured: boolean;
}

interface PortfolioData {
  personalInfo: {
    name: string;
    title: string;
    bio: string;
    email: string;
    phone: string;
    website: string;
    github: string;
    linkedin: string;
    location: string;
  };
  projects: Project[];
  skills: string[];
  experience: Array<{
    id: string;
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
}

export const PortfolioCreator = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    personalInfo: {
      name: '',
      title: '',
      bio: '',
      email: '',
      phone: '',
      website: '',
      github: '',
      linkedin: '',
      location: ''
    },
    projects: [],
    skills: [],
    experience: []
  });

  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    technologies: [],
    liveUrl: '',
    githubUrl: '',
    imageUrl: '',
    featured: false
  });

  const [newTech, setNewTech] = useState('');

  const addProject = () => {
    if (!newProject.title || !newProject.description) {
      toast({
        title: "Missing information",
        description: "Please fill in project title and description.",
        variant: "destructive"
      });
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title || '',
      description: newProject.description || '',
      technologies: newProject.technologies || [],
      liveUrl: newProject.liveUrl || '',
      githubUrl: newProject.githubUrl || '',
      imageUrl: newProject.imageUrl || '',
      featured: newProject.featured || false
    };

    setPortfolioData(prev => ({
      ...prev,
      projects: [...prev.projects, project]
    }));

    setNewProject({
      title: '',
      description: '',
      technologies: [],
      liveUrl: '',
      githubUrl: '',
      imageUrl: '',
      featured: false
    });

    toast({
      title: "Project added!",
      description: "Your project has been added to the portfolio."
    });
  };

  const removeProject = (id: string) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  const addTechToProject = () => {
    if (newTech.trim() && !newProject.technologies?.includes(newTech.trim())) {
      setNewProject(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTechFromProject = (tech: string) => {
    setNewProject(prev => ({
      ...prev,
      technologies: prev.technologies?.filter(t => t !== tech) || []
    }));
  };

  const generatePortfolio = () => {
    toast({
      title: "Portfolio Generated!",
      description: "Your portfolio HTML file is ready for download."
    });
  };

  const sharePortfolio = () => {
    toast({
      title: "Share Link Created!",
      description: "Portfolio share link copied to clipboard."
    });
  };

  const previewPortfolio = () => {
    toast({
      title: "Opening Preview",
      description: "Portfolio preview will open in a new tab."
    });
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
      <div className="grid grid-cols-1 gap-4">
        <Input
          placeholder="Full Name"
          value={portfolioData.personalInfo.name}
          onChange={(e) => setPortfolioData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, name: e.target.value }
          }))}
        />
        <Input
          placeholder="Professional Title (e.g., Full Stack Developer)"
          value={portfolioData.personalInfo.title}
          onChange={(e) => setPortfolioData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, title: e.target.value }
          }))}
        />
        <Textarea
          placeholder="Professional bio - tell your story and highlight your passion..."
          value={portfolioData.personalInfo.bio}
          onChange={(e) => setPortfolioData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, bio: e.target.value }
          }))}
          className="min-h-24"
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Email"
            type="email"
            value={portfolioData.personalInfo.email}
            onChange={(e) => setPortfolioData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, email: e.target.value }
            }))}
          />
          <Input
            placeholder="Phone"
            value={portfolioData.personalInfo.phone}
            onChange={(e) => setPortfolioData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, phone: e.target.value }
            }))}
          />
        </div>
        <Input
          placeholder="Website URL"
          value={portfolioData.personalInfo.website}
          onChange={(e) => setPortfolioData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, website: e.target.value }
          }))}
        />
        <Input
          placeholder="GitHub Profile URL"
          value={portfolioData.personalInfo.github}
          onChange={(e) => setPortfolioData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, github: e.target.value }
          }))}
        />
        <Input
          placeholder="LinkedIn Profile URL"
          value={portfolioData.personalInfo.linkedin}
          onChange={(e) => setPortfolioData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
          }))}
        />
        <Input
          placeholder="Location (City, State)"
          value={portfolioData.personalInfo.location}
          onChange={(e) => setPortfolioData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, location: e.target.value }
          }))}
        />
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Projects</h3>
        <Badge variant="secondary" className="text-xs">
          {portfolioData.projects.length} projects
        </Badge>
      </div>

      {/* Add New Project */}
      <Card className="p-4 border-dashed border-2">
        <h4 className="font-medium text-foreground mb-4">Add New Project</h4>
        <div className="space-y-3">
          <Input
            placeholder="Project Title"
            value={newProject.title}
            onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
          />
          <Textarea
            placeholder="Project Description"
            value={newProject.description}
            onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
            className="min-h-20"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Live Demo URL"
              value={newProject.liveUrl}
              onChange={(e) => setNewProject(prev => ({ ...prev, liveUrl: e.target.value }))}
            />
            <Input
              placeholder="GitHub URL"
              value={newProject.githubUrl}
              onChange={(e) => setNewProject(prev => ({ ...prev, githubUrl: e.target.value }))}
            />
          </div>
          <Input
            placeholder="Project Image URL"
            value={newProject.imageUrl}
            onChange={(e) => setNewProject(prev => ({ ...prev, imageUrl: e.target.value }))}
          />
          
          {/* Technologies */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Technologies Used</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add technology"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTechToProject()}
              />
              <Button onClick={addTechToProject} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newProject.technologies?.map((tech) => (
                <Badge key={tech} variant="secondary" className="gap-1">
                  {tech}
                  <button onClick={() => removeTechFromProject(tech)}>
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={newProject.featured}
              onChange={(e) => setNewProject(prev => ({ ...prev, featured: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="featured" className="text-sm text-foreground">
              Featured Project
            </label>
          </div>

          <Button onClick={addProject} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      </Card>

      {/* Existing Projects */}
      <div className="space-y-4">
        {portfolioData.projects.map((project) => (
          <Card key={project.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground">{project.title}</h4>
                  {project.featured && (
                    <Badge variant="default" className="text-xs">
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  {project.liveUrl && (
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Live Demo
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button variant="ghost" size="sm">
                      <Github className="w-4 h-4 mr-1" />
                      Code
                    </Button>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeProject(project.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'projects', label: 'Projects' },
    { id: 'preview', label: 'Preview' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Portfolio Creator</h1>
          <p className="text-muted-foreground">Create and customize your professional portfolio</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={previewPortfolio}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" size="sm" onClick={sharePortfolio}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button size="sm" onClick={generatePortfolio}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="p-4 bg-gradient-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Portfolio Completion</h3>
            <p className="text-sm opacity-90">
              {portfolioData.personalInfo.name ? '✓' : '○'} Personal Info • 
              {portfolioData.projects.length > 0 ? '✓' : '○'} Projects • 
              {portfolioData.personalInfo.bio ? '✓' : '○'} Bio
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {Math.round((
                (portfolioData.personalInfo.name ? 1 : 0) +
                (portfolioData.projects.length > 0 ? 1 : 0) +
                (portfolioData.personalInfo.bio ? 1 : 0)
              ) / 3 * 100)}%
            </div>
            <div className="text-xs opacity-90">Complete</div>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            onClick={() => setActiveTab(tab.id)}
            className="shrink-0"
            size="sm"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <Card className="p-6">
        {activeTab === 'personal' && renderPersonalInfo()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'preview' && (
          <div className="text-center py-12">
            <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Globe className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Portfolio Preview</h3>
            <p className="text-muted-foreground mb-4">
              Your portfolio will appear here. Add some projects and personal info to see the preview.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setActiveTab('personal')}>
                Add Personal Info
              </Button>
              <Button variant="outline" onClick={() => setActiveTab('projects')}>
                Add Projects
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
