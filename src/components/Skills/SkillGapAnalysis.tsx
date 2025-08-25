import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  ExternalLink, 
  BookOpen, 
  Target,
  Plus,
  CheckCircle,
  AlertTriangle,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Skill {
  name: string;
  level: number; // 0-100
  inDemand: boolean;
  marketValue: 'High' | 'Medium' | 'Low';
}

interface LearningResource {
  title: string;
  provider: string;
  type: 'Course' | 'Certification' | 'Tutorial' | 'Book';
  duration: string;
  price: 'Free' | 'Paid';
  url: string;
}

interface JobRequirement {
  skill: string;
  importance: 'Must Have' | 'Good to Have';
  yourLevel: number;
  requiredLevel: number;
}

export const SkillGapAnalysis = () => {
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  
  const currentSkills: Skill[] = [
    { name: 'React', level: 80, inDemand: true, marketValue: 'High' },
    { name: 'JavaScript', level: 85, inDemand: true, marketValue: 'High' },
    { name: 'HTML/CSS', level: 90, inDemand: true, marketValue: 'Medium' },
    { name: 'Node.js', level: 65, inDemand: true, marketValue: 'High' },
    { name: 'Python', level: 45, inDemand: true, marketValue: 'High' },
    { name: 'SQL', level: 60, inDemand: true, marketValue: 'High' },
  ];

  const jobRequirements: JobRequirement[] = [
    { skill: 'React', importance: 'Must Have', yourLevel: 80, requiredLevel: 70 },
    { skill: 'TypeScript', importance: 'Must Have', yourLevel: 0, requiredLevel: 80 },
    { skill: 'Node.js', importance: 'Must Have', yourLevel: 65, requiredLevel: 75 },
    { skill: 'Docker', importance: 'Good to Have', yourLevel: 0, requiredLevel: 60 },
    { skill: 'AWS', importance: 'Good to Have', yourLevel: 20, requiredLevel: 70 },
    { skill: 'MongoDB', importance: 'Must Have', yourLevel: 40, requiredLevel: 65 },
  ];

  const learningResources: LearningResource[] = [
    {
      title: 'TypeScript for React Developers',
      provider: 'Udemy',
      type: 'Course',
      duration: '8 hours',
      price: 'Paid',
      url: '#'
    },
    {
      title: 'Docker Fundamentals',
      provider: 'Docker',
      type: 'Tutorial',
      duration: '4 hours',
      price: 'Free',
      url: '#'
    },
    {
      title: 'AWS Cloud Practitioner',
      provider: 'AWS',
      type: 'Certification',
      duration: '20 hours',
      price: 'Paid',
      url: '#'
    },
    {
      title: 'MongoDB University',
      provider: 'MongoDB',
      type: 'Course',
      duration: '12 hours',
      price: 'Free',
      url: '#'
    }
  ];

  const getSkillStatus = (req: JobRequirement) => {
    const gap = req.requiredLevel - req.yourLevel;
    if (gap <= 0) return { status: 'complete', color: 'text-success', icon: CheckCircle };
    if (gap <= 20) return { status: 'close', color: 'text-warning', icon: AlertTriangle };
    return { status: 'gap', color: 'text-destructive', icon: AlertTriangle };
  };

  const getProgressColor = (yourLevel: number, requiredLevel: number) => {
    if (yourLevel >= requiredLevel) return 'bg-success';
    if (yourLevel >= requiredLevel * 0.8) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Skill Gap Analysis</h1>
        <p className="text-muted-foreground">Identify missing skills and get learning recommendations</p>
      </div>

      {/* Role Selection */}
      <Card className="p-4">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Target Job Role</label>
          <div className="flex gap-2">
            <Input 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value)}
              placeholder="Enter job role..."
            />
            <Button size="sm">
              <Search className="w-4 h-4 mr-2" />
              Analyze
            </Button>
          </div>
        </div>
      </Card>

      {/* Current Skills Overview */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Your Current Skills</h3>
        <div className="grid grid-cols-1 gap-3">
          {currentSkills.map((skill) => (
            <div key={skill.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{skill.name}</span>
                    <Badge 
                      variant={skill.marketValue === 'High' ? 'default' : skill.marketValue === 'Medium' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {skill.marketValue} Demand
                    </Badge>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
                <span className="text-sm text-muted-foreground w-12">{skill.level}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Skill Gap Analysis */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Gap Analysis for {selectedRole}
        </h3>
        <div className="space-y-4">
          {jobRequirements.map((req) => {
            const status = getSkillStatus(req);
            const StatusIcon = status.icon;
            
            return (
              <div key={req.skill} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-5 h-5 ${status.color}`} />
                    <span className="font-medium text-foreground">{req.skill}</span>
                    <Badge 
                      variant={req.importance === 'Must Have' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {req.importance}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {req.yourLevel}% / {req.requiredLevel}%
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Your Level</span>
                    <span>Required Level</span>
                  </div>
                  <div className="relative">
                    <Progress value={req.requiredLevel} className="h-3 bg-muted" />
                    <div 
                      className={`absolute top-0 left-0 h-3 rounded-full ${getProgressColor(req.yourLevel, req.requiredLevel)}`}
                      style={{ width: `${Math.min(req.yourLevel, 100)}%` }}
                    />
                  </div>
                </div>

                {req.yourLevel < req.requiredLevel && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-foreground">
                      <strong>Gap:</strong> {req.requiredLevel - req.yourLevel}% skill improvement needed
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: Complete 2-3 projects or take a specialized course
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Learning Resources */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recommended Learning Resources</h3>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </Button>
        </div>
        
        <div className="space-y-3">
          {learningResources.map((resource, index) => (
            <div key={index} className="p-3 border border-border rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{resource.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {resource.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>by {resource.provider}</span>
                    <span>{resource.duration}</span>
                    <Badge variant={resource.price === 'Free' ? 'secondary' : 'outline'} className="text-xs">
                      {resource.price}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Items */}
      <Card className="p-4 bg-gradient-secondary text-secondary-foreground">
        <div className="flex items-center gap-3 mb-3">
          <Target className="w-5 h-5" />
          <h3 className="font-semibold">Next Steps</h3>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Focus on TypeScript - it's a must-have skill with 0% current level
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Improve Node.js skills by 10% to meet requirements
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Learn MongoDB basics for full-stack capability
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Consider AWS certification for cloud skills
          </li>
        </ul>
      </Card>
    </div>
  );
};