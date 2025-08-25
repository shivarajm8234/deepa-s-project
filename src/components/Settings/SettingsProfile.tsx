import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Bell, 
  Mail, 
  Shield, 
  Download,
  Upload,
  Trash2,
  Plus,
  Settings,
  Phone,
  MapPin,
  Briefcase,
  Save,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    profilePicture: string;
  };
  jobPreferences: {
    jobTypes: string[];
    preferredLocations: string[];
    salaryExpectation: string;
    availableFrom: string;
    workMode: 'remote' | 'onsite' | 'hybrid';
  };
  notifications: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    pushNotifications: boolean;
    jobMatches: boolean;
    weeklyDigest: boolean;
    newMessagesFromRecruiters: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'recruiters-only';
    showSalary: boolean;
    showContactInfo: boolean;
    allowRecruiterContact: boolean;
  };
}

export const SettingsProfile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    personalInfo: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 9876543210',
      location: 'Bangalore, Karnataka',
      bio: 'Full-stack developer with 3 years of experience in React and Node.js',
      profilePicture: ''
    },
    jobPreferences: {
      jobTypes: ['full-time', 'contract'],
      preferredLocations: ['Bangalore', 'Remote'],
      salaryExpectation: '₹8-12 LPA',
      availableFrom: '2024-02-01',
      workMode: 'hybrid'
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
      jobMatches: true,
      weeklyDigest: true,
      newMessagesFromRecruiters: true
    },
    privacy: {
      profileVisibility: 'recruiters-only',
      showSalary: false,
      showContactInfo: true,
      allowRecruiterContact: true
    }
  });

  const [newJobType, setNewJobType] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const saveProfile = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully."
    });
  };

  const deleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "This feature requires backend integration with Supabase.",
      variant: "destructive"
    });
  };

  const exportData = () => {
    toast({
      title: "Data Export",
      description: "Your data export will be ready shortly."
    });
  };

  const addJobType = () => {
    if (newJobType.trim() && !userProfile.jobPreferences.jobTypes.includes(newJobType.trim())) {
      setUserProfile(prev => ({
        ...prev,
        jobPreferences: {
          ...prev.jobPreferences,
          jobTypes: [...prev.jobPreferences.jobTypes, newJobType.trim()]
        }
      }));
      setNewJobType('');
    }
  };

  const removeJobType = (type: string) => {
    setUserProfile(prev => ({
      ...prev,
      jobPreferences: {
        ...prev.jobPreferences,
        jobTypes: prev.jobPreferences.jobTypes.filter(t => t !== type)
      }
    }));
  };

  const addLocation = () => {
    if (newLocation.trim() && !userProfile.jobPreferences.preferredLocations.includes(newLocation.trim())) {
      setUserProfile(prev => ({
        ...prev,
        jobPreferences: {
          ...prev.jobPreferences,
          preferredLocations: [...prev.jobPreferences.preferredLocations, newLocation.trim()]
        }
      }));
      setNewLocation('');
    }
  };

  const removeLocation = (location: string) => {
    setUserProfile(prev => ({
      ...prev,
      jobPreferences: {
        ...prev.jobPreferences,
        preferredLocations: prev.jobPreferences.preferredLocations.filter(l => l !== location)
      }
    }));
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Input
            placeholder="Full Name"
            value={userProfile.personalInfo.name}
            onChange={(e) => setUserProfile(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, name: e.target.value }
            }))}
          />
          <Input
            placeholder="Email Address"
            type="email"
            value={userProfile.personalInfo.email}
            onChange={(e) => setUserProfile(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, email: e.target.value }
            }))}
          />
          <Input
            placeholder="Phone Number"
            value={userProfile.personalInfo.phone}
            onChange={(e) => setUserProfile(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, phone: e.target.value }
            }))}
          />
          <Input
            placeholder="Location"
            value={userProfile.personalInfo.location}
            onChange={(e) => setUserProfile(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, location: e.target.value }
            }))}
          />
          <Textarea
            placeholder="Professional Bio"
            value={userProfile.personalInfo.bio}
            onChange={(e) => setUserProfile(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, bio: e.target.value }
            }))}
            className="min-h-24"
          />
        </div>
      </div>
    </div>
  );

  const renderJobPreferences = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Briefcase className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Job Preferences</h3>
      </div>

      <div className="space-y-4">
        {/* Job Types */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Preferred Job Types</label>
          <div className="flex gap-2">
            <Input
              placeholder="Add job type"
              value={newJobType}
              onChange={(e) => setNewJobType(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addJobType()}
            />
            <Button onClick={addJobType} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {userProfile.jobPreferences.jobTypes.map((type) => (
              <Badge key={type} variant="secondary" className="gap-1">
                {type}
                <button onClick={() => removeJobType(type)}>
                  <Trash2 className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Preferred Locations</label>
          <div className="flex gap-2">
            <Input
              placeholder="Add location"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addLocation()}
            />
            <Button onClick={addLocation} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {userProfile.jobPreferences.preferredLocations.map((location) => (
              <Badge key={location} variant="secondary" className="gap-1">
                {location}
                <button onClick={() => removeLocation(location)}>
                  <Trash2 className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Other Preferences */}
        <div className="grid grid-cols-1 gap-4">
          <Input
            placeholder="Salary Expectation (e.g., ₹8-12 LPA)"
            value={userProfile.jobPreferences.salaryExpectation}
            onChange={(e) => setUserProfile(prev => ({
              ...prev,
              jobPreferences: { ...prev.jobPreferences, salaryExpectation: e.target.value }
            }))}
          />
          <Input
            type="date"
            placeholder="Available From"
            value={userProfile.jobPreferences.availableFrom}
            onChange={(e) => setUserProfile(prev => ({
              ...prev,
              jobPreferences: { ...prev.jobPreferences, availableFrom: e.target.value }
            }))}
          />
        </div>

        {/* Work Mode */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Work Mode Preference</label>
          <div className="flex gap-2">
            {['remote', 'onsite', 'hybrid'].map((mode) => (
              <Button
                key={mode}
                variant={userProfile.jobPreferences.workMode === mode ? "default" : "outline"}
                size="sm"
                onClick={() => setUserProfile(prev => ({
                  ...prev,
                  jobPreferences: { ...prev.jobPreferences, workMode: mode as any }
                }))}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
      </div>

      <div className="space-y-4">
        {Object.entries(userProfile.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-foreground">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </h4>
              <p className="text-sm text-muted-foreground">
                {key === 'emailAlerts' && 'Receive job alerts via email'}
                {key === 'smsAlerts' && 'Receive important updates via SMS'}
                {key === 'pushNotifications' && 'Browser notifications for real-time updates'}
                {key === 'jobMatches' && 'Get notified when jobs match your profile'}
                {key === 'weeklyDigest' && 'Weekly summary of new opportunities'}
                {key === 'newMessagesFromRecruiters' && 'Notifications when recruiters message you'}
              </p>
            </div>
            <Switch
              checked={value}
              onCheckedChange={(checked) => setUserProfile(prev => ({
                ...prev,
                notifications: { ...prev.notifications, [key]: checked }
              }))}
            />
          </div>
        ))}
      </div>

      <Card className="p-4 bg-muted/50 border-warning">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground">Email & SMS Setup Required</h4>
            <p className="text-sm text-muted-foreground">
              To enable email and SMS notifications, connect your Supabase backend for full functionality.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Privacy & Security</h3>
      </div>

      <div className="space-y-4">
        {/* Profile Visibility */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Profile Visibility</label>
          <div className="flex gap-2">
            {[
              { value: 'public', label: 'Public' },
              { value: 'recruiters-only', label: 'Recruiters Only' },
              { value: 'private', label: 'Private' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={userProfile.privacy.profileVisibility === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setUserProfile(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, profileVisibility: option.value as any }
                }))}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Privacy Options */}
        {[
          { key: 'showSalary', label: 'Show Salary Expectations', desc: 'Display your salary range on your profile' },
          { key: 'showContactInfo', label: 'Show Contact Information', desc: 'Allow others to see your contact details' },
          { key: 'allowRecruiterContact', label: 'Allow Recruiter Contact', desc: 'Let recruiters message you directly' }
        ].map((option) => (
          <div key={option.key} className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-foreground">{option.label}</h4>
              <p className="text-sm text-muted-foreground">{option.desc}</p>
            </div>
            <Switch
              checked={userProfile.privacy[option.key as keyof typeof userProfile.privacy] as boolean}
              onCheckedChange={(checked) => setUserProfile(prev => ({
                ...prev,
                privacy: { ...prev.privacy, [option.key]: checked }
              }))}
            />
          </div>
        ))}
      </div>

      <Separator />

      {/* Data Management */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Data Management</h4>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export My Data
          </Button>
          <Button variant="destructive" onClick={deleteAccount}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Data export and account deletion require backend integration with Supabase.
        </p>
      </div>
    </div>
  );

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Job Preferences', icon: Briefcase },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings & Profile</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        <Button onClick={saveProfile} disabled={isLoading}>
          {isLoading ? (
            <Settings className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className="shrink-0 gap-2"
              size="sm"
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      <Card className="p-6">
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'preferences' && renderJobPreferences()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'privacy' && renderPrivacy()}
      </Card>
    </div>
  );
};
