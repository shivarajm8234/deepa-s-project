import jsPDF from 'jspdf';
import { Resume } from '../types/resume';

export const generateResumePDF = (resume: Resume): void => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;
  const margin = 20;
  const lineHeight = 6;
  const sectionSpacing = 10;

  // Helper function to add text with word wrapping and custom line height
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10, lineHeightMultiplier = 1.5): number => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    const lineHeight = fontSize * lineHeightMultiplier;
    
    lines.forEach((line: string, index: number) => {
      pdf.text(line, x, y + (index * lineHeight));
    });
    
    return y + (lines.length * lineHeight);
  };
  
  // Helper function to draw a section divider line
  const drawSectionDivider = (y: number): number => {
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, pageWidth - margin, y);
    return y + 10; // Return new y position after divider
  };

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number): number => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      return 20;
    }
    return yPosition;
  };

  // Header - Personal Information
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(resume.personalInfo.fullName || 'Your Name', margin, yPosition);
  yPosition += 12;

  // Contact Information
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  // Create two lines for contact info
  const contactLine1 = [
    resume.personalInfo.email,
    resume.personalInfo.phone
  ].filter(Boolean).join('  •  ');
  
  const contactLine2 = [
    resume.personalInfo.location,
    resume.personalInfo.linkedin ? 'linkedin.com/in/' + resume.personalInfo.linkedin.split('/').pop() : '',
    resume.personalInfo.github ? 'github.com/' + resume.personalInfo.github.split('/').pop() : ''
  ].filter(Boolean).join('  •  ');
  
  if (contactLine1) {
    pdf.text(contactLine1, margin, yPosition);
    yPosition += lineHeight + 2;
  }
  
  if (contactLine2) {
    pdf.text(contactLine2, margin, yPosition);
    yPosition += lineHeight + 6; // Extra space before first section
  }

  yPosition += sectionSpacing;

  // Professional Summary
  if (resume.personalInfo.summary) {
    yPosition = checkNewPage(20);
    
    // Section header with underline
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    const sectionTitle = 'PROFESSIONAL SUMMARY';
    pdf.text(sectionTitle, margin, yPosition);
    
    // Underline the section title
    const textWidth = pdf.getTextWidth(sectionTitle);
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition + 2, margin + textWidth, yPosition + 2);
    
    yPosition += 12; // Space after section header
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    yPosition = addText(resume.personalInfo.summary, margin, yPosition, pageWidth - 2 * margin);
    yPosition += sectionSpacing;
  }

  // Experience
  if (resume.experience.length > 0) {
    yPosition = drawSectionDivider(yPosition);
    yPosition = checkNewPage(30);
    
    // Section header with underline
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    const sectionTitle = 'PROFESSIONAL EXPERIENCE';
    pdf.text(sectionTitle, margin, yPosition);
    
    // Underline the section title
    const textWidth = pdf.getTextWidth(sectionTitle);
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition + 2, margin + textWidth, yPosition + 2);
    
    yPosition += 12; // Space after section header

    resume.experience.forEach((exp) => {
      yPosition = checkNewPage(25);
      
      // Position and Company
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${exp.position}`, margin, yPosition);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${exp.company}`, margin + 100, yPosition);
      yPosition += lineHeight;

      // Dates and Location
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text(`${exp.startDate} - ${exp.endDate}`, margin, yPosition);
      pdf.text(exp.location, pageWidth - margin - 50, yPosition);
      yPosition += lineHeight + 2;

      // Description
      pdf.setFont('helvetica', 'normal');
      exp.description.forEach((desc) => {
        yPosition = checkNewPage(10);
        yPosition = addText(`• ${desc}`, margin + 5, yPosition, pageWidth - 2 * margin - 10);
        yPosition += 2;
      });

      yPosition += 5;
    });
    yPosition += sectionSpacing;
  }

  // Projects
  if (resume.projects.length > 0) {
    yPosition = drawSectionDivider(yPosition);
    yPosition = checkNewPage(30);
    
    // Section header with underline
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    const sectionTitle = 'PROJECTS';
    pdf.text(sectionTitle, margin, yPosition);
    
    // Underline the section title
    const textWidth = pdf.getTextWidth(sectionTitle);
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition + 2, margin + textWidth, yPosition + 2);
    
    yPosition += 12; // Space after section header

    resume.projects.forEach((project) => {
      yPosition = checkNewPage(20);
      
      // Project Name
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(project.name, margin, yPosition);
      yPosition += lineHeight;

      // Technologies
      if (project.technologies.length > 0) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        yPosition = addText(`Technologies: ${project.technologies.join(', ')}`, margin, yPosition, pageWidth - 2 * margin);
        yPosition += 2;
      }

      // Description
      pdf.setFont('helvetica', 'normal');
      yPosition = addText(project.description, margin, yPosition, pageWidth - 2 * margin);
      
      // Highlights
      project.highlights.forEach((highlight) => {
        yPosition = checkNewPage(8);
        yPosition = addText(`• ${highlight}`, margin + 5, yPosition, pageWidth - 2 * margin - 10);
      });

      yPosition += 5;
    });
    yPosition += sectionSpacing;
  }

  // Education
  if (resume.education.length > 0) {
    yPosition = drawSectionDivider(yPosition);
    yPosition = checkNewPage(30);
    
    // Section header with underline
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    const sectionTitle = 'EDUCATION';
    pdf.text(sectionTitle, margin, yPosition);
    
    // Underline the section title
    const textWidth = pdf.getTextWidth(sectionTitle);
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition + 2, margin + textWidth, yPosition + 2);
    
    yPosition += 12; // Space after section header

    resume.education.forEach((edu) => {
      yPosition = checkNewPage(15);
      
      // Degree and Field
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${edu.degree} in ${edu.field}`, margin, yPosition);
      yPosition += lineHeight;

      // Institution and Dates
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(edu.institution, margin, yPosition);
      pdf.text(`${edu.startDate} - ${edu.endDate}`, pageWidth - margin - 50, yPosition);
      yPosition += lineHeight;

      // GPA
      if (edu.gpa) {
        pdf.setFont('helvetica', 'italic');
        pdf.text(`GPA: ${edu.gpa}`, margin, yPosition);
        yPosition += lineHeight;
      }

      yPosition += 3;
    });
    yPosition += sectionSpacing;
  }

  // Skills
  if (resume.skills.length > 0) {
    yPosition = drawSectionDivider(yPosition);
    yPosition = checkNewPage(20);
    
    // Section header with underline
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    const sectionTitle = 'TECHNICAL SKILLS';
    pdf.text(sectionTitle, margin, yPosition);
    
    // Underline the section title
    const textWidth = pdf.getTextWidth(sectionTitle);
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition + 2, margin + textWidth, yPosition + 2);
    
    yPosition += 12; // Space after section header

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const skillsText = resume.skills.join(' • ');
    yPosition = addText(skillsText, margin, yPosition, pageWidth - 2 * margin);
    yPosition += sectionSpacing;
  }

  // Certifications
  if (resume.certifications.length > 0) {
    yPosition = checkNewPage(20);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CERTIFICATIONS', margin, yPosition);
    yPosition += 8;

    resume.certifications.forEach((cert) => {
      yPosition = checkNewPage(10);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(cert.name, margin, yPosition);
      yPosition += lineHeight;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${cert.issuer} - ${cert.date}`, margin, yPosition);
      yPosition += lineHeight + 2;
    });
    yPosition += sectionSpacing;
  }

  // Languages
  if (resume.languages.length > 0) {
    yPosition = checkNewPage(15);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LANGUAGES', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const languagesText = resume.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' • ');
    yPosition = addText(languagesText, margin, yPosition, pageWidth - 2 * margin);
    yPosition += sectionSpacing;
  }

  // Achievements
  if (resume.achievements.length > 0) {
    yPosition = checkNewPage(20);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ACHIEVEMENTS', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    resume.achievements.forEach((achievement) => {
      yPosition = checkNewPage(8);
      yPosition = addText(`• ${achievement}`, margin, yPosition, pageWidth - 2 * margin);
      yPosition += 2;
    });
  }

  // Save the PDF
  const fileName = `${resume.personalInfo.fullName || 'Resume'}_Resume.pdf`;
  pdf.save(fileName);
};

export const generateATSFriendlyPDF = (resume: Resume): void => {
  // Create a simple, ATS-friendly version
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPosition = 20;
  const margin = 20;
  const lineHeight = 5;

  // Use only standard fonts and simple formatting
  pdf.setFont('helvetica', 'normal');

  // Header
  pdf.setFontSize(16);
  pdf.text(resume.personalInfo.fullName || 'Your Name', margin, yPosition);
  yPosition += 10;

  // Contact
  pdf.setFontSize(10);
  const contact = [
    resume.personalInfo.email,
    resume.personalInfo.phone,
    resume.personalInfo.location,
    resume.personalInfo.linkedin
  ].filter(Boolean).join(' | ');
  
  pdf.text(contact, margin, yPosition);
  yPosition += 15;

  // Summary
  if (resume.personalInfo.summary) {
    pdf.setFontSize(12);
    pdf.text('SUMMARY', margin, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(10);
    const summaryLines = pdf.splitTextToSize(resume.personalInfo.summary, pageWidth - 2 * margin);
    pdf.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * lineHeight + 10;
  }

  // Experience
  if (resume.experience.length > 0) {
    pdf.setFontSize(12);
    pdf.text('EXPERIENCE', margin, yPosition);
    yPosition += 8;

    resume.experience.forEach((exp) => {
      pdf.setFontSize(11);
      pdf.text(`${exp.position} | ${exp.company} | ${exp.startDate} - ${exp.endDate}`, margin, yPosition);
      yPosition += 6;
      
      pdf.setFontSize(10);
      exp.description.forEach((desc) => {
        const lines = pdf.splitTextToSize(`• ${desc}`, pageWidth - 2 * margin);
        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * lineHeight + 2;
      });
      yPosition += 5;
    });
  }

  // Education
  if (resume.education.length > 0) {
    pdf.setFontSize(12);
    pdf.text('EDUCATION', margin, yPosition);
    yPosition += 8;

    resume.education.forEach((edu) => {
      pdf.setFontSize(10);
      pdf.text(`${edu.degree} in ${edu.field} | ${edu.institution} | ${edu.startDate} - ${edu.endDate}`, margin, yPosition);
      yPosition += 6;
      if (edu.gpa) {
        pdf.text(`GPA: ${edu.gpa}`, margin, yPosition);
        yPosition += 6;
      }
      yPosition += 3;
    });
  }

  // Skills
  if (resume.skills.length > 0) {
    pdf.setFontSize(12);
    pdf.text('SKILLS', margin, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(10);
    const skillsText = resume.skills.join(', ');
    const skillsLines = pdf.splitTextToSize(skillsText, pageWidth - 2 * margin);
    pdf.text(skillsLines, margin, yPosition);
    yPosition += skillsLines.length * lineHeight + 10;
  }

  // Save ATS-friendly version
  const fileName = `${resume.personalInfo.fullName || 'Resume'}_ATS_Resume.pdf`;
  pdf.save(fileName);
};