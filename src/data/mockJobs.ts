export interface Job {
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

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp India',
    location: 'Bangalore, Karnataka',
    salary: '₹15-25 LPA',
    type: 'full-time',
    postedTime: '2 hours ago',
    description: 'We are looking for a senior software engineer to join our growing team. You will be responsible for developing scalable web applications using modern technologies.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
    aiMatch: 92,
    isGovernment: false,
    isSaved: false
  },
  {
    id: '2',
    title: 'Assistant Manager - IT',
    company: 'State Bank of India',
    location: 'Mumbai, Maharashtra',
    salary: '₹8-12 LPA',
    type: 'full-time',
    postedTime: '1 day ago',
    description: 'Government position for managing IT operations and digital transformation initiatives in banking sector.',
    skills: ['Project Management', 'Banking Systems', 'Digital Banking', 'Leadership'],
    aiMatch: 78,
    isGovernment: true,
    isSaved: true
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '₹8-15 LPA',
    type: 'remote',
    postedTime: '3 hours ago',
    description: 'Join our fast-paced startup environment. Build innovative products that will shape the future of fintech.',
    skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Redis'],
    aiMatch: 85,
    isGovernment: false,
    isSaved: false
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'Analytics Pro',
    location: 'Hyderabad, Telangana',
    salary: '₹12-20 LPA',
    type: 'full-time',
    postedTime: '5 hours ago',
    description: 'Work with large datasets to derive actionable insights. Experience with machine learning and statistical modeling required.',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'],
    aiMatch: 67,
    isGovernment: false,
    isSaved: false
  },
  {
    id: '5',
    title: 'Civil Engineer - PWD',
    company: 'Public Works Department',
    location: 'Delhi',
    salary: '₹6-10 LPA',
    type: 'full-time',
    postedTime: '2 days ago',
    description: 'Government position for infrastructure development projects. Handle road construction and maintenance projects.',
    skills: ['Civil Engineering', 'Project Planning', 'AutoCAD', 'Site Management'],
    aiMatch: 72,
    isGovernment: true,
    isSaved: false
  },
  {
    id: '6',
    title: 'UI/UX Designer',
    company: 'DesignStudio',
    location: 'Pune, Maharashtra',
    salary: '₹6-12 LPA',
    type: 'full-time',
    postedTime: '1 day ago',
    description: 'Create beautiful and intuitive user experiences. Work closely with developers to bring designs to life.',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'HTML/CSS'],
    aiMatch: 88,
    isGovernment: false,
    isSaved: true
  },
  {
    id: '7',
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    location: 'Chennai, Tamil Nadu',
    salary: '₹10-18 LPA',
    type: 'full-time',
    postedTime: '4 hours ago',
    description: 'Manage cloud infrastructure and CI/CD pipelines. Ensure high availability and scalability of applications.',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Jenkins', 'Terraform'],
    aiMatch: 76,
    isGovernment: false,
    isSaved: false
  },
  {
    id: '8',
    title: 'Marketing Manager',
    company: 'GrowthCorp',
    location: 'Gurgaon, Haryana',
    salary: '₹8-14 LPA',
    type: 'full-time',
    postedTime: '6 hours ago',
    description: 'Lead digital marketing campaigns and brand strategy. Drive customer acquisition and retention initiatives.',
    skills: ['Digital Marketing', 'SEO/SEM', 'Analytics', 'Brand Management', 'Social Media'],
    aiMatch: 65,
    isGovernment: false,
    isSaved: false
  }
];