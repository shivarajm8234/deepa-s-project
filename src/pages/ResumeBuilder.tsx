import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Download, Save, Eye, Award, CheckCircle, AlertCircle, 
  Trash2, Edit3, Globe, Github, Linkedin, Mail, Phone, MapPin,
  Briefcase, GraduationCap, Code, Star, Languages, Trophy, Heart
} from 'lucide-react';
import useResumeStore from '../stores/resumeStore';
import { generateResumePDF, generateATSFriendlyPDF } from '../utils/pdfGenerator';

const ResumeBuilder = () => {
  const { 
    resume, 
    updateResume, 
    atsScore, 
    atsAnalysis,
    generateATSScore, 
    addEducation, 
    addExperience, 
    addProject,
    addSkill, 
    addCertification,
    addLanguage,
    addAchievement,
    addInterest,
    removeEducation, 
    removeExperience, 
    removeProject,
    removeSkill,
    removeCertification,
    removeLanguage,
    removeAchievement,
    removeInterest
  } = useResumeStore();
  
  const [activeSection, setActiveSection] = useState('personal');
  const [isEditing, setIsEditing] = useState(true);
  
  // Toggle between edit and preview mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Auto-generate ATS score when resume changes
  useEffect(() => {
    generateATSScore();
  }, [resume, generateATSScore]);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateResume({
      personalInfo: {
        ...resume.personalInfo,
        [name]: value,
      },
    });
  };

  const handleAddEducation = () => {
    addEducation({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      location: '',
      achievements: []
    });
  };

  const handleEducationChange = (index: number, field: string, value: string | string[]) => {
    const updatedEducation = [...resume.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    updateResume({ education: updatedEducation });
  };

  const handleAddExperience = () => {
    addExperience({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: [],
      achievements: [],
      technologies: []
    });
  };

  const handleExperienceChange = (index: number, field: string, value: string | string[]) => {
    const updatedExperience = [...resume.experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    updateResume({ experience: updatedExperience });
  };

  const handleAddProject = () => {
    addProject({
      name: '',
      description: '',
      technologies: [],
      url: '',
      github: '',
      startDate: '',
      endDate: '',
      highlights: []
    });
  };

  const handleProjectChange = (index: number, field: string, value: string | string[]) => {
    const updatedProjects = [...resume.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    updateResume({ projects: updatedProjects });
  };

  const handleAddSkill = () => {
    const skillInput = document.getElementById('newSkill') as HTMLInputElement;
    if (skillInput && skillInput.value.trim()) {
      addSkill(skillInput.value.trim());
      skillInput.value = '';
    }
  };

  const handleAddCertification = () => {
    addCertification({
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      url: ''
    });
  };

  const handleCertificationChange = (index: number, field: string, value: string) => {
    const updatedCertifications = [...resume.certifications];
    updatedCertifications[index] = { ...updatedCertifications[index], [field]: value };
    updateResume({ certifications: updatedCertifications });
  };

  const handleAddLanguage = () => {
    addLanguage({
      name: '',
      proficiency: 'Intermediate'
    });
  };

  const handleLanguageChange = (index: number, field: string, value: string) => {
    const updatedLanguages = [...resume.languages];
    updatedLanguages[index] = { ...updatedLanguages[index], [field]: value };
    updateResume({ languages: updatedLanguages });
  };

  const handleAddAchievement = () => {
    const achievementInput = document.getElementById('newAchievement') as HTMLInputElement;
    if (achievementInput && achievementInput.value.trim()) {
      addAchievement(achievementInput.value.trim());
      achievementInput.value = '';
    }
  };

  const handleAddInterest = () => {
    const interestInput = document.getElementById('newInterest') as HTMLInputElement;
    if (interestInput && interestInput.value.trim()) {
      addInterest(interestInput.value.trim());
      interestInput.value = '';
    }
  };

  const getATSScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getATSScoreStroke = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getATSFeedback = (score: number) => {
    if (score >= 80) return { icon: CheckCircle, text: 'Excellent! Your resume is ATS-optimized.', color: 'text-green-600' };
    if (score >= 60) return { icon: AlertCircle, text: 'Good, but could be improved.', color: 'text-yellow-600' };
    return { icon: AlertCircle, text: 'Needs improvement for ATS compatibility.', color: 'text-red-600' };
  };

  const downloadPDF = () => {
    generateResumePDF(resume);
  };

  const feedback = getATSFeedback(atsScore);
  const FeedbackIcon = feedback.icon;

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: Mail },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Star },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'languages', label: 'Languages', icon: Languages },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'interests', label: 'Interests', icon: Heart }
  ];

  // Show preview mode
  if (!isEditing) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Resume Preview</h1>
          <div className="flex gap-4">
            <button
              onClick={toggleEditMode}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <Edit3 className="w-4 h-4" />
              Edit Resume
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
        
        {/* Resume Content */}
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 print:shadow-none">
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-gray-200 pb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{resume.personalInfo.fullName || 'Your Name'}</h1>
            
            <div className="flex justify-center items-center gap-6 text-gray-600 mb-3">
              {resume.personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{resume.personalInfo.email}</span>
                </div>
              )}
              {resume.personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{resume.personalInfo.phone}</span>
                </div>
              )}
              {resume.personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{resume.personalInfo.location}</span>
                </div>
              )}
            </div>

            <div className="flex justify-center items-center gap-6 text-blue-600">
              {resume.personalInfo.linkedin && (
                <div className="flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />
                  <span className="text-sm">{resume.personalInfo.linkedin}</span>
                </div>
              )}
              {resume.personalInfo.website && (
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">{resume.personalInfo.website}</span>
                </div>
              )}
              {resume.personalInfo.github && (
                <div className="flex items-center gap-1">
                  <Github className="w-4 h-4" />
                  <span className="text-sm">{resume.personalInfo.github}</span>
                </div>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {resume.personalInfo.summary && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Professional Summary</h2>
              <p className="text-gray-700 leading-relaxed">{resume.personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {resume.experience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Professional Experience</h2>
              {resume.experience.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-gray-700 font-medium">{exp.company}</p>
                    </div>
                    <div className="text-right text-gray-600">
                      <p className="font-medium">{exp.startDate} - {exp.endDate}</p>
                      <p>{exp.location}</p>
                    </div>
                  </div>
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-600">Technologies: </span>
                      <span className="text-sm text-gray-700">{exp.technologies.join(', ')}</span>
                    </div>
                  )}
                  {exp.description.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      {exp.description.map((desc, descIndex) => (
                        <li key={descIndex}>{desc}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {resume.projects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Projects</h2>
              {resume.projects.map((project, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <span className="text-gray-600 text-sm">{project.startDate} - {project.endDate}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-600">Technologies: </span>
                      <span className="text-sm text-gray-700">{project.technologies.join(', ')}</span>
                    </div>
                  )}
                  {project.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      {project.highlights.map((highlight, highlightIndex) => (
                        <li key={highlightIndex}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                  <div className="flex gap-4 mt-2">
                    {project.url && (
                      <a href={project.url} className="text-blue-600 text-sm hover:underline">Live Demo</a>
                    )}
                    {project.github && (
                      <a href={project.github} className="text-blue-600 text-sm hover:underline">GitHub</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Education</h2>
              {resume.education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                      <p className="text-gray-700">{edu.institution}</p>
                      {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-right text-gray-600">
                      <p>{edu.startDate} - {edu.endDate}</p>
                      {edu.location && <p>{edu.location}</p>}
                    </div>
                  </div>
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
                      {edu.achievements.map((achievement, achIndex) => (
                        <li key={achIndex}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {resume.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Technical Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resume.certifications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Certifications</h2>
              {resume.certifications.map((cert, index) => (
                <div key={index} className="mb-3">
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-gray-700">{cert.issuer} - {cert.date}</p>
                  {cert.credentialId && (
                    <p className="text-gray-600 text-sm">Credential ID: {cert.credentialId}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {resume.languages.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Languages</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {resume.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="font-medium text-gray-900">{lang.name}</span>
                    <span className="text-gray-600">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {resume.achievements.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Achievements</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {resume.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Interests */}
          {resume.interests.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {resume.interests.map((interest, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show edit mode
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Edit Resume</h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={toggleEditMode}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Resume
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Section Navigation */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {sections.map(section => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal Information */}
          {activeSection === 'personal' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={resume.personalInfo.fullName}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={resume.personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={resume.personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={resume.personalInfo.location}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mumbai, India"
                  />
                </div>
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={resume.personalInfo.linkedin || ''}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                    Website/Portfolio
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={resume.personalInfo.website || ''}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://johndoe.com"
                  />
                </div>
                <div>
                  <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    id="github"
                    name="github"
                    value={resume.personalInfo.github || ''}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://github.com/johndoe"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Summary
                  </label>
                  <textarea
                    id="summary"
                    name="summary"
                    value={resume.personalInfo.summary || ''}
                    onChange={handlePersonalInfoChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write a compelling professional summary that highlights your key skills, experience, and career objectives..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Experience Section */}
          {activeSection === 'experience' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Professional Experience</h2>
                <button
                  onClick={handleAddExperience}
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </button>
              </div>
              {resume.experience.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No experience entries yet. Click "Add Experience" to begin.</p>
              ) : (
                <div className="space-y-6">
                  {resume.experience.map((exp, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium text-gray-900">Experience {index + 1}</h3>
                        <button
                          onClick={() => removeExperience(index)}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Software Engineer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tech Corp"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                          <input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                          <input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Mumbai, India"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
                          <input
                            type="text"
                            value={exp.technologies?.join(', ') || ''}
                            onChange={(e) => handleExperienceChange(index, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="React, Node.js, MongoDB, AWS"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Job Description (one per line)</label>
                          <textarea
                            value={exp.description.join('\n')}
                            onChange={(e) => handleExperienceChange(index, 'description', e.target.value.split('\n').filter(line => line.trim()))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            placeholder="• Developed web applications using React and Node.js&#10;• Collaborated with cross-functional teams to deliver projects on time&#10;• Improved application performance by 30% through optimization"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Projects Section */}
          {activeSection === 'projects' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
                <button
                  onClick={handleAddProject}
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              </div>
              {resume.projects.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No projects yet. Click "Add Project" to showcase your work.</p>
              ) : (
                <div className="space-y-6">
                  {resume.projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium text-gray-900">Project {index + 1}</h3>
                        <button
                          onClick={() => removeProject(index)}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                          <input
                            type="text"
                            value={project.name}
                            onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="E-commerce Platform"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Technologies *</label>
                          <input
                            type="text"
                            value={project.technologies.join(', ')}
                            onChange={(e) => handleProjectChange(index, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="React, Node.js, MongoDB"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <input
                            type="month"
                            value={project.startDate}
                            onChange={(e) => handleProjectChange(index, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <input
                            type="month"
                            value={project.endDate}
                            onChange={(e) => handleProjectChange(index, 'endDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Live URL</label>
                          <input
                            type="url"
                            value={project.url || ''}
                            onChange={(e) => handleProjectChange(index, 'url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://project-demo.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                          <input
                            type="url"
                            value={project.github || ''}
                            onChange={(e) => handleProjectChange(index, 'github', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://github.com/username/project"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                          <textarea
                            value={project.description}
                            onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Brief description of the project and its purpose..."
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Key Highlights (one per line)</label>
                          <textarea
                            value={project.highlights.join('\n')}
                            onChange={(e) => handleProjectChange(index, 'highlights', e.target.value.split('\n').filter(line => line.trim()))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="• Implemented user authentication and authorization&#10;• Integrated payment gateway for secure transactions&#10;• Achieved 99% uptime with proper error handling"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Education Section */}
          {activeSection === 'education' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Education</h2>
                <button
                  onClick={handleAddEducation}
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Education
                </button>
              </div>
              {resume.education.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No education entries yet. Click "Add Education" to begin.</p>
              ) : (
                <div className="space-y-6">
                  {resume.education.map((edu, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium text-gray-900">Education {index + 1}</h3>
                        <button
                          onClick={() => removeEducation(index)}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="University of Mumbai"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Degree *</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Bachelor of Engineering"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study *</label>
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Computer Science"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                          <input
                            type="text"
                            value={edu.location || ''}
                            onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Mumbai, India"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                          <input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                          <input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">GPA/Percentage (Optional)</label>
                          <input
                            type="text"
                            value={edu.gpa || ''}
                            onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="8.5/10 or 85%"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Achievements (one per line)</label>
                          <textarea
                            value={edu.achievements?.join('\n') || ''}
                            onChange={(e) => handleEducationChange(index, 'achievements', e.target.value.split('\n').filter(line => line.trim()))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="• Dean's List for academic excellence&#10;• President of Computer Science Society&#10;• Winner of inter-college coding competition"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Skills Section */}
          {activeSection === 'skills' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Technical Skills</h2>
              </div>
              
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="newSkill"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a skill (e.g., JavaScript, Project Management, Adobe Photoshop)"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                  <button
                    onClick={handleAddSkill}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {resume.skills.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No skills added yet. Add your first skill above.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Certifications Section */}
          {activeSection === 'certifications' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Certifications</h2>
                <button
                  onClick={handleAddCertification}
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Certification
                </button>
              </div>
              {resume.certifications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No certifications yet. Click "Add Certification" to showcase your credentials.</p>
              ) : (
                <div className="space-y-6">
                  {resume.certifications.map((cert, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium text-gray-900">Certification {index + 1}</h3>
                        <button
                          onClick={() => removeCertification(index)}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name *</label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="AWS Certified Solutions Architect"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization *</label>
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Amazon Web Services"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label>
                          <input
                            type="month"
                            value={cert.date}
                            onChange={(e) => handleCertificationChange(index, 'date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                          <input
                            type="month"
                            value={cert.expiryDate || ''}
                            onChange={(e) => handleCertificationChange(index, 'expiryDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Credential ID</label>
                          <input
                            type="text"
                            value={cert.credentialId || ''}
                            onChange={(e) => handleCertificationChange(index, 'credentialId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ABC123XYZ"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Credential URL</label>
                          <input
                            type="url"
                            value={cert.url || ''}
                            onChange={(e) => handleCertificationChange(index, 'url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://verify.certification.com"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Languages Section */}
          {activeSection === 'languages' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Languages</h2>
                <button
                  onClick={handleAddLanguage}
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Language
                </button>
              </div>
              {resume.languages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No languages added yet. Click "Add Language" to showcase your linguistic skills.</p>
              ) : (
                <div className="space-y-4">
                  {resume.languages.map((lang, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={lang.name}
                          onChange={(e) => handleLanguageChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Language name (e.g., English, Hindi, Spanish)"
                        />
                      </div>
                      <div className="flex-1">
                        <select
                          value={lang.proficiency}
                          onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Basic">Basic</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Native">Native</option>
                        </select>
                      </div>
                      <button
                        onClick={() => removeLanguage(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Achievements Section */}
          {activeSection === 'achievements' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Achievements</h2>
              </div>
              
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="newAchievement"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter an achievement (e.g., Won first place in hackathon, Published research paper)"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAchievement()}
                  />
                  <button
                    onClick={handleAddAchievement}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {resume.achievements.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No achievements added yet. Add your first achievement above.</p>
              ) : (
                <div className="space-y-2">
                  {resume.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-800">{achievement}</span>
                      <button
                        onClick={() => removeAchievement(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Interests Section */}
          {activeSection === 'interests' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Interests & Hobbies</h2>
              </div>
              
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="newInterest"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter an interest (e.g., Photography, Traveling, Reading)"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                  />
                  <button
                    onClick={handleAddInterest}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {resume.interests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No interests added yet. Add your first interest above.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {resume.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {interest}
                      <button
                        onClick={() => removeInterest(index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ATS Score and Analysis */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">ATS Score</h2>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getATSScoreColor(atsScore)}`}>{atsScore}</span>
                </div>
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    fill="none"
                    stroke={getATSScoreStroke(atsScore)}
                    strokeWidth="8"
                    strokeDasharray={`${(atsScore / 100) * 377} 377`}
                    className="transition-all duration-500"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <div className={`flex items-center justify-center gap-2 ${feedback.color} mb-2`}>
                <FeedbackIcon className="w-5 h-5" />
                <span className="font-medium">{feedback.text}</span>
              </div>
            </div>
          </div>

          {/* ATS Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ATS Analysis</h3>
            
            {/* Strengths */}
            {atsAnalysis.strengths.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Strengths
                </h4>
                <ul className="space-y-1 text-sm">
                  {atsAnalysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-green-600">
                      <span className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {atsAnalysis.improvements.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-yellow-700 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Improvements
                </h4>
                <ul className="space-y-1 text-sm">
                  {atsAnalysis.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2 text-yellow-600">
                      <span className="w-1 h-1 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Keywords */}
            {atsAnalysis.keywords.length > 0 && (
              <div>
                <h4 className="font-medium text-blue-700 mb-2">Detected Keywords</h4>
                <div className="flex flex-wrap gap-1">
                  {atsAnalysis.keywords.slice(0, 10).map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Resume Completeness */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Completeness</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Personal Info</span>
                <div className="flex items-center gap-2">
                  {Object.values(resume.personalInfo).filter(Boolean).length >= 6 ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  )}
                  <span className="text-sm font-medium">
                    {Object.values(resume.personalInfo).filter(Boolean).length}/8
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Experience</span>
                <div className="flex items-center gap-2">
                  {resume.experience.length > 0 ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  )}
                  <span className="text-sm font-medium">{resume.experience.length}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Projects</span>
                <div className="flex items-center gap-2">
                  {resume.projects.length > 0 ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  )}
                  <span className="text-sm font-medium">{resume.projects.length}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Education</span>
                <div className="flex items-center gap-2">
                  {resume.education.length > 0 ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  )}
                  <span className="text-sm font-medium">{resume.education.length}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Skills</span>
                <div className="flex items-center gap-2">
                  {resume.skills.length >= 5 ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  )}
                  <span className="text-sm font-medium">{resume.skills.length}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Certifications</span>
                <div className="flex items-center gap-2">
                  {resume.certifications.length > 0 ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm font-medium">{resume.certifications.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Use action verbs (developed, implemented, managed)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Quantify achievements with numbers and percentages</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Tailor keywords to match job descriptions</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Keep formatting simple and consistent</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Proofread for spelling and grammar errors</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;