import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Star,
  Upload,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
  grade: string;
}

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
  };
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }>;
}

export const ResumeBuilder = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [atsScore, setAtsScore] = useState(78);
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: ''
    },
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: []
  });

  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !resumeData.skills.includes(newSkill.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      duration: '',
      description: ''
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const generateAtsScore = () => {
    const score = Math.floor(Math.random() * 20) + 70; // Mock score between 70-90
    setAtsScore(score);
    toast({
      title: "ATS Analysis Complete",
      description: `Your resume scored ${score}/100. Check recommendations below.`,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-success" />;
    if (score >= 60) return <AlertCircle className="w-5 h-5 text-warning" />;
    return <AlertCircle className="w-5 h-5 text-destructive" />;
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
      <div className="grid grid-cols-1 gap-4">
        <Input
          placeholder="Full Name"
          value={resumeData.personalInfo.name}
          onChange={(e) => setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, name: e.target.value }
          }))}
        />
        <Input
          placeholder="Email Address"
          type="email"
          value={resumeData.personalInfo.email}
          onChange={(e) => setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, email: e.target.value }
          }))}
        />
        <Input
          placeholder="Phone Number"
          value={resumeData.personalInfo.phone}
          onChange={(e) => setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, phone: e.target.value }
          }))}
        />
        <Input
          placeholder="Location (City, State)"
          value={resumeData.personalInfo.location}
          onChange={(e) => setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, location: e.target.value }
          }))}
        />
        <Input
          placeholder="LinkedIn URL"
          value={resumeData.personalInfo.linkedin}
          onChange={(e) => setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
          }))}
        />
        <Input
          placeholder="Portfolio Website"
          value={resumeData.personalInfo.portfolio}
          onChange={(e) => setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, portfolio: e.target.value }
          }))}
        />
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Professional Summary</h3>
      <Textarea
        placeholder="Write a compelling professional summary that highlights your key achievements and career goals..."
        value={resumeData.summary}
        onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
        className="min-h-32"
      />
      <p className="text-sm text-muted-foreground">
        Tip: Keep it concise (2-3 sentences) and focus on your most relevant accomplishments.
      </p>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Skills</h3>
      
      <div className="flex gap-2">
        <Input
          placeholder="Add a skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
        />
        <Button onClick={addSkill} size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {resumeData.skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="gap-1">
            {skill}
            <button onClick={() => removeSkill(skill)}>
              <Trash2 className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Work Experience</h3>
        <Button onClick={addExperience} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {resumeData.experience.map((exp) => (
          <Card key={exp.id} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <Input
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  />
                  <Input
                    placeholder="Position/Job Title"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  />
                  <Input
                    placeholder="Duration (e.g., Jan 2020 - Present)"
                    value={exp.duration}
                    onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                  />
                </div>
                <Textarea
                  placeholder="Describe your key responsibilities and achievements..."
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  className="min-h-24"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(exp.id)}
                className="ml-2"
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
    { id: 'personal', label: 'Personal' },
    { id: 'summary', label: 'Summary' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'ats', label: 'ATS Score' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Resume Builder</h1>
          <p className="text-muted-foreground">Build an ATS-optimized resume</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* ATS Score Card */}
      <Card className="p-4 bg-gradient-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">ATS Compatibility Score</h3>
            <p className="text-sm opacity-90">How well your resume passes automated screening</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold">{atsScore}/100</div>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={generateAtsScore}
                className="mt-1"
              >
                Analyze
              </Button>
            </div>
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
        {activeTab === 'summary' && renderSummary()}
        {activeTab === 'skills' && renderSkills()}
        {activeTab === 'experience' && renderExperience()}
        {activeTab === 'ats' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {getScoreIcon(atsScore)}
              <div>
                <h3 className="text-lg font-semibold">ATS Analysis Results</h3>
                <p className={`text-sm font-medium ${getScoreColor(atsScore)}`}>
                  Score: {atsScore}/100
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-medium">Recommendations:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 mt-0.5 text-warning" />
                  Add more relevant keywords from job descriptions
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 mt-0.5 text-warning" />
                  Use standard section headings (Experience, Education, Skills)
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 mt-0.5 text-warning" />
                  Include quantifiable achievements with numbers
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 mt-0.5 text-warning" />
                  Ensure consistent formatting throughout
                </li>
              </ul>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};