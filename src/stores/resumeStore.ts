import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Resume, Education, Experience, Project, Certification, Language } from '../types/resume';

interface ResumeState {
  resume: Resume;
  updateResume: (updates: Partial<Resume>) => void;
  atsScore: number;
  atsAnalysis: {
    strengths: string[];
    improvements: string[];
    keywords: string[];
  };
  generateATSScore: () => void;
  addEducation: (education: Education) => void;
  removeEducation: (index: number) => void;
  addExperience: (experience: Experience) => void;
  removeExperience: (index: number) => void;
  addProject: (project: Project) => void;
  removeProject: (index: number) => void;
  addSkill: (skill: string) => void;
  removeSkill: (index: number) => void;
  addCertification: (certification: Certification) => void;
  removeCertification: (index: number) => void;
  addLanguage: (language: Language) => void;
  removeLanguage: (index: number) => void;
  addAchievement: (achievement: string) => void;
  removeAchievement: (index: number) => void;
  addInterest: (interest: string) => void;
  removeInterest: (index: number) => void;
}

const INITIAL_RESUME: Resume = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    github: '',
    summary: '',
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  languages: [],
  achievements: [],
  interests: [],
};

const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resume: INITIAL_RESUME,
      atsScore: 0,
      atsAnalysis: {
        strengths: [],
        improvements: [],
        keywords: [],
      },

      updateResume: (updates) =>
        set((state) => ({
          resume: { ...state.resume, ...updates },
        })),

      addEducation: (education) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: [...state.resume.education, education],
          },
        })),

      removeEducation: (index) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: state.resume.education.filter((_, i) => i !== index),
          },
        })),

      addExperience: (experience) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: [...state.resume.experience, experience],
          },
        })),

      removeExperience: (index) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.filter((_, i) => i !== index),
          },
        })),

      addProject: (project) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: [...state.resume.projects, project],
          },
        })),

      removeProject: (index) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: state.resume.projects.filter((_, i) => i !== index),
          },
        })),

      addSkill: (skill) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: [...state.resume.skills, skill],
          },
        })),

      removeSkill: (index) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: state.resume.skills.filter((_, i) => i !== index),
          },
        })),

      addCertification: (certification) =>
        set((state) => ({
          resume: {
            ...state.resume,
            certifications: [...state.resume.certifications, certification],
          },
        })),

      removeCertification: (index) =>
        set((state) => ({
          resume: {
            ...state.resume,
            certifications: state.resume.certifications.filter((_, i) => i !== index),
          },
        })),

      addLanguage: (language) =>
        set((state) => ({
          resume: {
            ...state.resume,
            languages: [...state.resume.languages, language],
          },
        })),

      removeLanguage: (index) =>
        set((state) => ({
          resume: {
            ...state.resume,
            languages: state.resume.languages.filter((_, i) => i !== index),
          },
        })),

      addAchievement: (achievement) =>
        set((state) => ({
          resume: {
            ...state.resume,
            achievements: [...state.resume.achievements, achievement],
          },
        })),

      removeAchievement: (index) =>
        set((state) => ({
          resume: {
            ...state.resume,
            achievements: state.resume.achievements.filter((_, i) => i !== index),
          },
        })),

      addInterest: (interest) =>
        set((state) => ({
          resume: {
            ...state.resume,
            interests: [...state.resume.interests, interest],
          },
        })),

      removeInterest: (index) =>
        set((state) => ({
          resume: {
            ...state.resume,
            interests: state.resume.interests.filter((_, i) => i !== index),
          },
        })),

      generateATSScore: () =>
        set((state) => {
          const resume = state.resume;
          let score = 0;
          const strengths: string[] = [];
          const improvements: string[] = [];
          const keywords: string[] = [];

          // Personal info completeness (20 points max)
          const personalInfoFields = Object.values(resume.personalInfo).filter(Boolean);
          const personalScore = Math.min(personalInfoFields.length * 3, 20);
          score += personalScore;

          if (personalScore >= 15) {
            strengths.push('Complete contact information');
          } else {
            improvements.push('Add missing contact details (LinkedIn, summary, etc.)');
          }

          // Professional summary (10 points)
          if (resume.personalInfo.summary && resume.personalInfo.summary.length > 50) {
            score += 10;
            strengths.push('Professional summary included');
          } else {
            improvements.push('Add a compelling professional summary');
          }

          // Education (15 points max)
          if (resume.education.length > 0) {
            score += 10;
            const completeEducation = resume.education.filter(
              edu => edu.institution && edu.degree && edu.field && edu.startDate && edu.endDate
            );
            score += Math.min(completeEducation.length * 5, 5);
            
            if (completeEducation.length > 0) {
              strengths.push('Education section complete');
            }
          } else {
            improvements.push('Add education information');
          }

          // Experience (25 points max)
          if (resume.experience.length > 0) {
            score += 15;
            const completeExperience = resume.experience.filter(
              exp => exp.company && exp.position && exp.startDate && exp.endDate && exp.description.length > 0
            );
            score += Math.min(completeExperience.length * 5, 10);
            
            if (completeExperience.length > 0) {
              strengths.push('Work experience documented');
            }

            // Check for quantified achievements
            const quantifiedExp = resume.experience.some(exp => 
              exp.description.some(desc => /\d+/.test(desc))
            );
            if (quantifiedExp) {
              strengths.push('Quantified achievements included');
            } else {
              improvements.push('Add numbers and metrics to achievements');
            }
          } else {
            improvements.push('Add work experience');
          }

          // Skills (15 points max)
          if (resume.skills.length >= 5) {
            score += 10;
            strengths.push('Comprehensive skills list');
          } else if (resume.skills.length >= 3) {
            score += 5;
            improvements.push('Add more relevant skills');
          } else {
            improvements.push('Add technical and soft skills');
          }

          if (resume.skills.length >= 8) {
            score += 5;
          }

          // Projects (10 points max)
          if (resume.projects.length > 0) {
            score += 5;
            const completeProjects = resume.projects.filter(
              proj => proj.name && proj.description && proj.technologies.length > 0
            );
            score += Math.min(completeProjects.length * 2, 5);
            
            if (completeProjects.length > 0) {
              strengths.push('Projects showcase technical skills');
            }
          } else {
            improvements.push('Add relevant projects');
          }

          // Certifications bonus (5 points max)
          if (resume.certifications.length > 0) {
            score += Math.min(resume.certifications.length * 2, 5);
            strengths.push('Professional certifications included');
          }

          // Languages bonus (3 points max)
          if (resume.languages.length > 1) {
            score += Math.min(resume.languages.length, 3);
            strengths.push('Multilingual capabilities');
          }

          // Achievements bonus (2 points max)
          if (resume.achievements.length > 0) {
            score += Math.min(resume.achievements.length, 2);
            strengths.push('Notable achievements highlighted');
          }

          // Extract keywords from content
          const allText = [
            resume.personalInfo.summary || '',
            ...resume.experience.flatMap(exp => exp.description),
            ...resume.projects.flatMap(proj => [proj.description, ...proj.highlights]),
            ...resume.skills,
            ...resume.achievements
          ].join(' ').toLowerCase();

          const commonKeywords = [
            'leadership', 'management', 'team', 'project', 'development', 'analysis',
            'communication', 'problem-solving', 'innovation', 'strategy', 'results',
            'collaboration', 'efficiency', 'optimization', 'implementation'
          ];

          keywords.push(...commonKeywords.filter(keyword => allText.includes(keyword)));

          // Professional formatting checks
          let formatBonus = 0;
          
          if (resume.personalInfo.email && resume.personalInfo.email.includes('@')) {
            formatBonus += 2;
          }

          if (resume.personalInfo.linkedin && resume.personalInfo.linkedin.includes('linkedin')) {
            formatBonus += 3;
          }

          if (resume.experience.some(exp => exp.description.length >= 3)) {
            formatBonus += 3;
          }

          if (resume.skills.length >= 10) {
            formatBonus += 2;
          }

          score += formatBonus;

          // Normalize to 0-100
          score = Math.min(Math.round(score), 100);

          // Final recommendations
          if (score < 60) {
            improvements.push('Focus on completing all sections');
            improvements.push('Add more detailed descriptions');
          } else if (score < 80) {
            improvements.push('Enhance with more specific achievements');
            improvements.push('Include relevant keywords for your industry');
          }

          return { 
            atsScore: score,
            atsAnalysis: {
              strengths: [...new Set(strengths)],
              improvements: [...new Set(improvements)],
              keywords: [...new Set(keywords)]
            }
          };
        }),
    }),
    {
      name: 'resume-storage',
      partialize: (state) => ({ resume: state.resume }),
      merge: (persistedState, currentState) => {
        const merged = { ...currentState, ...persistedState };
        
        // Ensure resume object exists and has all required array properties
        if (merged.resume) {
          merged.resume = {
            ...INITIAL_RESUME,
            ...merged.resume,
            education: Array.isArray(merged.resume.education) ? merged.resume.education : [],
            experience: Array.isArray(merged.resume.experience) ? merged.resume.experience : [],
            projects: Array.isArray(merged.resume.projects) ? merged.resume.projects : [],
            skills: Array.isArray(merged.resume.skills) ? merged.resume.skills : [],
            certifications: Array.isArray(merged.resume.certifications) ? merged.resume.certifications : [],
            languages: Array.isArray(merged.resume.languages) ? merged.resume.languages : [],
            achievements: Array.isArray(merged.resume.achievements) ? merged.resume.achievements : [],
            interests: Array.isArray(merged.resume.interests) ? merged.resume.interests : [],
            personalInfo: {
              ...INITIAL_RESUME.personalInfo,
              ...merged.resume.personalInfo,
            },
          };
        } else {
          merged.resume = INITIAL_RESUME;
        }
        
        return merged;
      },
    }
  )
);

export default useResumeStore;