import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  Bookmark,
  ExternalLink,
  Zap
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  postedTime: string;
  description: string;
  skills: string[];
  aiMatch: number;
  isGovernment: boolean;
  isSaved: boolean;
}

interface JobCardProps {
  job: Job;
  onSave: (jobId: string) => void;
  onApply: (jobId: string) => void;
}

export const JobCard = ({ job, onSave, onApply }: JobCardProps) => {
  return (
    <Card className="p-4 space-y-4 hover:shadow-custom-lg transition-all duration-300 border-l-4 border-l-primary/20">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{job.title}</h3>
            {job.aiMatch >= 80 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-accent rounded-full">
                <Zap className="w-3 h-3 text-accent-foreground" />
                <span className="text-xs font-medium text-accent-foreground">AI Match</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building className="w-4 h-4" />
            <span className="truncate">{job.company}</span>
          </div>
        </div>
        <button
          onClick={() => onSave(job.id)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Bookmark className={`w-5 h-5 ${job.isSaved ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
        </button>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSign className="w-4 h-4" />
          <span className="truncate">{job.salary}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="truncate">{job.postedTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={job.isGovernment ? "secondary" : "outline"} className="text-xs">
            {job.isGovernment ? 'Government' : 'Private'}
          </Badge>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2">
        {job.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {job.skills.slice(0, 3).map((skill) => (
          <Badge key={skill} variant="outline" className="text-xs">
            {skill}
          </Badge>
        ))}
        {job.skills.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{job.skills.length - 3} more
          </Badge>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button 
          onClick={() => onApply(job.id)}
          className="flex-1"
          size="sm"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Apply
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1"
        >
          View Details
        </Button>
      </div>

      {/* AI Match Score */}
      {job.aiMatch > 0 && (
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-muted-foreground">AI Match:</span>
            <span className="font-medium text-accent">{job.aiMatch}%</span>
          </div>
          <div className="flex-1 bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${job.aiMatch}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
};