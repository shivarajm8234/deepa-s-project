export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'government' | 'non-government';
  experience: string;
  remote: boolean;
  description: string;
  requirements: string[];
  deadline: string;
  tags: string[];
  url?: string;
  source?: string;
  applicationDeadline?: string;
  examDate?: string;
  eligibility?: string;
  postedDate?: string;
  jobType?: string;
}

export type JobType = 'all' | 'government' | 'non-government';

export interface JobFilters {
  search: string;
  type: string;
  location: string;
  remote: boolean;
  experience: string;
  jobType: JobType;
}