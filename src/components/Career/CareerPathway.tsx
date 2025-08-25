import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown, 
  ChevronUp, 
  Target, 
  TrendingUp, 
  Clock,
  DollarSign,
  MapPin,
  Briefcase,
  Users,
  Star
} from 'lucide-react';

interface CareerLevel {
  id: string;
  title: string;
  level: number;
  salaryRange: string;
  experience: string;
  skills: string[];
  responsibilities: string[];
  companies: string[];
  isCurrentLevel?: boolean;
  isCompleted?: boolean;
  timeToReach?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const CareerPathway = () => {
  const [expandedLevel, setExpandedLevel] = useState<string>('2');
  const [selectedTrack, setSelectedTrack] = useState('Software Development');

  const careerTracks = [
    'Software Development',
    'Data Science',
    'Product Management',
    'UI/UX Design',
    'DevOps Engineering'
  ];

  const careerPath: CareerLevel[] = [
    {
      id: '1',
      title: 'Junior Software Developer',
      level: 1,
      salaryRange: '₹3-6 LPA',
      experience: '0-2 years',
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
      responsibilities: [
        'Write clean, maintainable code',
        'Participate in code reviews',
        'Debug and fix issues',
        'Learn from senior developers'
      ],
      companies: ['Startups', 'Service Companies', 'Product Companies'],
      isCompleted: true,
      difficulty: 'Easy'
    },
    {
      id: '2',
      title: 'Software Developer',
      level: 2,
      salaryRange: '₹6-12 LPA',
      experience: '2-4 years',
      skills: ['React', 'Node.js', 'TypeScript', 'REST APIs', 'Database Design', 'Testing'],
      responsibilities: [
        'Develop complex features independently',
        'Mentor junior developers',
        'Participate in system design discussions',
        'Optimize application performance'
      ],
      companies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra'],
      isCurrentLevel: true,
      timeToReach: 'Current Position',
      difficulty: 'Medium'
    },
    {
      id: '3',
      title: 'Senior Software Developer',
      level: 3,
      salaryRange: '₹12-20 LPA',
      experience: '4-7 years',
      skills: ['System Design', 'Microservices', 'Cloud (AWS/Azure)', 'Leadership', 'Architecture'],
      responsibilities: [
        'Lead technical decisions for projects',
        'Design scalable systems',
        'Mentor team members',
        'Collaborate with stakeholders'
      ],
      companies: ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Zomato'],
      timeToReach: '1.5-2 years',
      difficulty: 'Medium'
    },
    {
      id: '4',
      title: 'Tech Lead / Engineering Manager',
      level: 4,
      salaryRange: '₹20-35 LPA',
      experience: '7-10 years',
      skills: ['Team Management', 'Project Planning', 'Strategic Thinking', 'Communication', 'Budget Management'],
      responsibilities: [
        'Manage engineering teams',
        'Define technical roadmap',
        'Coordinate cross-functional projects',
        'Drive technical excellence'
      ],
      companies: ['FAANG', 'Unicorn Startups', 'Fortune 500'],
      timeToReach: '3-4 years',
      difficulty: 'Hard'
    },
    {
      id: '5',
      title: 'Principal Engineer / Director',
      level: 5,
      salaryRange: '₹35-60 LPA',
      experience: '10+ years',
      skills: ['Strategic Vision', 'Cross-team Leadership', 'Innovation', 'Business Acumen', 'Industry Expertise'],
      responsibilities: [
        'Set technical vision for organization',
        'Lead large-scale initiatives',
        'Influence industry standards',
        'Drive innovation and R&D'
      ],
      companies: ['Top Tech Companies', 'Consulting Firms', 'Research Labs'],
      timeToReach: '5-7 years',
      difficulty: 'Hard'
    }
  ];

  const toggleExpand = (id: string) => {
    setExpandedLevel(expandedLevel === id ? '' : id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success text-success-foreground';
      case 'Medium': return 'bg-warning text-warning-foreground';
      case 'Hard': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getProgressPercentage = (level: CareerLevel) => {
    if (level.isCompleted) return 100;
    if (level.isCurrentLevel) return 60;
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Career Pathway</h1>
        <p className="text-muted-foreground">Visualize your career progression and plan your next steps</p>
      </div>

      {/* Track Selection */}
      <Card className="p-4">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Career Track</label>
          <div className="flex flex-wrap gap-2">
            {careerTracks.map((track) => (
              <Button
                key={track}
                variant={selectedTrack === track ? "default" : "outline"}
                onClick={() => setSelectedTrack(track)}
                size="sm"
              >
                {track}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Progress Overview */}
      <Card className="p-4 bg-gradient-primary text-primary-foreground">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold">Your Progress</h3>
            <p className="text-sm opacity-90">Level 2 of 5 in {selectedTrack}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">40%</div>
            <div className="text-xs opacity-90">Complete</div>
          </div>
        </div>
        <Progress value={40} className="bg-primary-foreground/20" />
      </Card>

      {/* Career Path Levels */}
      <div className="space-y-4">
        {careerPath.map((level, index) => {
          const isExpanded = expandedLevel === level.id;
          const progress = getProgressPercentage(level);
          
          return (
            <Card key={level.id} className={`overflow-hidden transition-all duration-300 ${
              level.isCurrentLevel ? 'ring-2 ring-primary' : ''
            }`}>
              {/* Header */}
              <div 
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleExpand(level.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      level.isCompleted ? 'bg-success text-success-foreground' :
                      level.isCurrentLevel ? 'bg-primary text-primary-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {level.level}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        {level.title}
                        {level.isCurrentLevel && (
                          <Badge variant="default" className="text-xs">
                            Current Level
                          </Badge>
                        )}
                        {level.isCompleted && (
                          <Badge variant="secondary" className="text-xs">
                            Completed
                          </Badge>
                        )}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {level.salaryRange}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {level.experience}
                        </span>
                        {level.timeToReach && (
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {level.timeToReach}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(level.difficulty)} variant="secondary">
                      {level.difficulty}
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <Progress value={progress} className="h-2" />
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-border">
                  {/* Skills Required */}
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {level.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Key Responsibilities
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {level.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 shrink-0" />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Companies */}
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Typical Companies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {level.companies.map((company) => (
                        <Badge key={company} variant="secondary" className="text-xs">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  {!level.isCompleted && (
                    <div className="pt-2">
                      <Button 
                        variant={level.isCurrentLevel ? "default" : "outline"} 
                        size="sm"
                        className="w-full"
                      >
                        {level.isCurrentLevel ? 'View Improvement Plan' : 'Prepare for This Level'}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Next Steps Card */}
      <Card className="p-4 bg-gradient-accent text-accent-foreground">
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp className="w-5 h-5" />
          <h3 className="font-semibold">Recommended Next Steps</h3>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Focus on TypeScript and System Design skills
          </li>
          <li className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Start mentoring junior developers
          </li>
          <li className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Take on leadership responsibilities in projects
          </li>
          <li className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Build expertise in cloud technologies (AWS/Azure)
          </li>
        </ul>
      </Card>
    </div>
  );
};