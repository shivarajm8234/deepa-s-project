import { useState } from 'react';
import { Search, Filter, MapPin, Briefcase, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onLocationChange: (location: string) => void;
  onJobTypeChange: (type: string) => void;
  onSectorToggle: (isGovernment: boolean) => void;
  activeFilters: {
    query: string;
    location: string;
    jobType: string;
    isGovernment: boolean;
  };
}

export const SearchFilters = ({ 
  onSearch, 
  onLocationChange, 
  onJobTypeChange, 
  onSectorToggle,
  activeFilters 
}: SearchFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      {/* Main Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search jobs, skills, companies..."
          value={activeFilters.query}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 pr-12 h-12 text-base"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-2 top-2 h-8 w-8 p-0"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Government/Private Toggle */}
      <div className="flex gap-2">
        <Button
          variant={!activeFilters.isGovernment ? "default" : "outline"}
          onClick={() => onSectorToggle(false)}
          className="flex-1 h-10"
          size="sm"
        >
          <Building className="w-4 h-4 mr-2" />
          Private Jobs
        </Button>
        <Button
          variant={activeFilters.isGovernment ? "default" : "outline"}
          onClick={() => onSectorToggle(true)}
          className="flex-1 h-10"
          size="sm"
        >
          <Briefcase className="w-4 h-4 mr-2" />
          Govt Jobs
        </Button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 gap-3 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="City, State or Remote"
                value={activeFilters.location}
                onChange={(e) => onLocationChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Job Type</label>
            <Select value={activeFilters.jobType} onValueChange={onJobTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="All job types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {(activeFilters.location || activeFilters.jobType !== 'all') && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.location && (
            <Badge variant="secondary" className="gap-1">
              <MapPin className="w-3 h-3" />
              {activeFilters.location}
            </Badge>
          )}
          {activeFilters.jobType !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              <Briefcase className="w-3 h-3" />
              {activeFilters.jobType}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};