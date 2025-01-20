import React, { useState, useRef, useEffect } from 'react';
import { User, Briefcase, GraduationCap, Award, Mail, Phone, Globe, Github, Linkedin, Download, 
         AlignCenterVertical as Certificate, FolderGit2, Languages, Users, MapPin, Calendar, Link, Code, Star, Eye, Plus, X } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Toaster, toast } from 'react-hot-toast';

interface ResumeData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
    summary: string;
  };
  experience: Array<{
    id: number;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    bullets: string[];
  }>;
  education: Array<{
    id: number;
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  skills: Array<{
    id: number;
    category: string;
    items: string[];
  }>;
  certifications: Array<{
    id: number;
    name: string;
    issuer: string;
    date: string;
  }>;
  references: Array<{
    id: number;
    name: string;
    position: string;
    company: string;
    email: string;
    phone: string;
  }>;
}

const initialResumeData: ResumeData = {
  personal: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
  },
  experience: [{
    id: 1,
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    bullets: []
  }],
  education: [],
  skills: [
    {
      id: 1,
      category: 'Technical Skills',
      items: [],
    },
    {
      id: 2,
      category: 'Soft Skills',
      items: [],
    },
  ],
  certifications: [],
  references: [],
};

function App() {
  const [activeSection, setActiveSection] = useState('personal');
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  // Handle print/download
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setLoading(true);
      toast.loading('Preparing PDF...');
    },
    onAfterPrint: () => {
      setLoading(false);
      toast.success('PDF generated successfully!');
    },
  });

  const handleDownloadPDF = async () => {
    setLoading(true);
    toast.loading('Generating PDF...');
    
    try {
      const element = componentRef.current;
      const canvas = await html2canvas(element as HTMLElement);
      const data = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF();
      const imgProperties = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
      
      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('resume.pdf');
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error('PDF generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'personal', icon: '👤', label: 'Personal Info' },
    { id: 'experience', icon: '💼', label: 'Experience' },
    { id: 'education', icon: '🎓', label: 'Education' },
    { id: 'skills', icon: '⚡', label: 'Skills' },
    { id: 'certifications', icon: '🏆', label: 'Certifications' },
    { id: 'references', icon: '👥', label: 'References' }
  ];

  // Smooth scroll function
  const smoothScrollTo = (element: HTMLElement) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const relativeTop = elementRect.top - containerRect.top + container.scrollTop;

    container.scrollTo({
      top: relativeTop - 80, // Offset for the sticky header
      behavior: 'smooth'
    });
  };

  // Section visibility observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-80px 0px -20% 0px'
      }
    );

    document.querySelectorAll('.section').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header-fixed">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">
                Resume Builder
              </h1>
              <span className="pro-badge px-3 py-1 rounded-full text-white text-sm font-medium">
                Pro
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.print()}
                className="btn-secondary flex items-center gap-2"
                disabled={loading}
              >
                <Eye size={20} />
                Preview
              </button>
              <button
                onClick={handleDownloadPDF}
                className="btn-primary flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner" />
                ) : (
                  <Download size={20} />
                )}
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="content-wrapper">
        <div className="main-container">
          {/* Form Section */}
          <div className="form-section">
            <div className="form-container">
              <div className="nav-container">
                <nav className="flex gap-2 overflow-x-auto hide-scrollbar">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        const element = document.getElementById(section.id);
                        if (element) {
                          smoothScrollTo(element);
                        }
                      }}
                      className={`nav-button ${activeSection === section.id ? 'active' : ''}`}
                    >
                      <span className="whitespace-nowrap">{section.icon} {section.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div 
                ref={scrollContainerRef}
                className="smooth-scroll-container hide-scrollbar"
              >
                <div className="space-y-6">
                  <section id="personal" className="section">
                    <PersonalInfoForm resumeData={resumeData} setResumeData={setResumeData} />
                  </section>
                  <section id="experience" className="section">
                    <ExperienceForm resumeData={resumeData} setResumeData={setResumeData} />
                  </section>
                  <section id="education" className="section">
                    <EducationForm resumeData={resumeData} setResumeData={setResumeData} />
                  </section>
                  <section id="skills" className="section">
                    <SkillsForm resumeData={resumeData} setResumeData={setResumeData} />
                  </section>
                  <section id="certifications" className="section">
                    <CertificationsForm resumeData={resumeData} setResumeData={setResumeData} />
                  </section>
                  <section id="references" className="section">
                    <ReferencesForm resumeData={resumeData} setResumeData={setResumeData} />
                  </section>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="preview-section">
            <div className="preview-scroll">
              <div ref={componentRef}>
                <ResumePreview data={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <Toaster position="top-center" />
    </div>
  );
}

// Personal Info Form
function PersonalInfoForm({ resumeData, setResumeData }: { resumeData: ResumeData, setResumeData: (data: ResumeData) => void }) {
  const updatePersonal = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  return (
    <div className="section card">
      <h2 className="section-title flex items-center gap-2">
        <User size={24} className="text-blue-600" />
        Personal Information
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={resumeData.personal.name}
            onChange={(e) => updatePersonal('name', e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Job Title"
            value={resumeData.personal.title}
            onChange={(e) => updatePersonal('title', e.target.value)}
            className="input-field"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Mail size={20} className="text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={resumeData.personal.email}
              onChange={(e) => updatePersonal('email', e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Phone size={20} className="text-gray-400" />
            <input
              type="tel"
              placeholder="Phone"
              value={resumeData.personal.phone}
              onChange={(e) => updatePersonal('phone', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Linkedin size={20} className="text-gray-400" />
            <input
              type="url"
              placeholder="LinkedIn URL"
              value={resumeData.personal.linkedin}
              onChange={(e) => updatePersonal('linkedin', e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Github size={20} className="text-gray-400" />
            <input
              type="url"
              placeholder="GitHub URL"
              value={resumeData.personal.github}
              onChange={(e) => updatePersonal('github', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Globe size={20} className="text-gray-400" />
            <input
              type="url"
              placeholder="Portfolio Website"
              value={resumeData.personal.portfolio}
              onChange={(e) => updatePersonal('portfolio', e.target.value)}
              className="input-field"
            />
          </div>
          <input
            type="text"
            placeholder="Location"
            value={resumeData.personal.location}
            onChange={(e) => updatePersonal('location', e.target.value)}
            className="input-field"
          />
        </div>
        <textarea
          placeholder="Professional Summary"
          value={resumeData.personal.summary}
          onChange={(e) => updatePersonal('summary', e.target.value)}
          className="input-field min-h-[100px]"
        />
      </div>
    </div>
  );
}

// Experience Form
function ExperienceForm({ resumeData, setResumeData }: { resumeData: ResumeData, setResumeData: (data: ResumeData) => void }) {
  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: prev.experience.length + 1,
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        bullets: []
      }]
    }));
  };

  const addBullet = (experienceId: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === experienceId) {
          return {
            ...exp,
            bullets: [...exp.bullets, '']
          };
        }
        return exp;
      })
    }));
  };

  const updateBullet = (experienceId: number, bulletIndex: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === experienceId) {
          const newBullets = [...exp.bullets];
          newBullets[bulletIndex] = value;
          return {
            ...exp,
            bullets: newBullets
          };
        }
        return exp;
      })
    }));
  };

  const removeBullet = (experienceId: number, bulletIndex: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === experienceId) {
          return {
            ...exp,
            bullets: exp.bullets.filter((_, index) => index !== bulletIndex)
          };
        }
        return exp;
      })
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Work Experience</h2>
      {resumeData.experience.map((exp) => (
        <div key={exp.id} className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Company"
              value={exp.company}
              onChange={(e) => {
                const updatedExperience = resumeData.experience.map(item =>
                  item.id === exp.id ? { ...item, company: e.target.value } : item
                );
                setResumeData({ ...resumeData, experience: updatedExperience });
              }}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Position"
              value={exp.position}
              onChange={(e) => {
                const updatedExperience = resumeData.experience.map(item =>
                  item.id === exp.id ? { ...item, position: e.target.value } : item
                );
                setResumeData({ ...resumeData, experience: updatedExperience });
              }}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Start Date"
              value={exp.startDate}
              onChange={(e) => {
                const updatedExperience = resumeData.experience.map(item =>
                  item.id === exp.id ? { ...item, startDate: e.target.value } : item
                );
                setResumeData({ ...resumeData, experience: updatedExperience });
              }}
              className="input-field"
            />
            <input
              type="text"
              placeholder="End Date"
              value={exp.endDate}
              onChange={(e) => {
                const updatedExperience = resumeData.experience.map(item =>
                  item.id === exp.id ? { ...item, endDate: e.target.value } : item
                );
                setResumeData({ ...resumeData, experience: updatedExperience });
              }}
              className="input-field"
            />
          </div>
          <textarea
            placeholder="Description"
            value={exp.description}
            onChange={(e) => {
              const updatedExperience = resumeData.experience.map(item =>
                item.id === exp.id ? { ...item, description: e.target.value } : item
              );
              setResumeData({ ...resumeData, experience: updatedExperience });
            }}
            className="input-field h-24"
          />
          
          {/* Bullet Points Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Key Achievements/Responsibilities</label>
              <button
                type="button"
                onClick={() => addBullet(exp.id)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus size={16} /> Add Bullet
              </button>
            </div>
            {exp.bullets.map((bullet, index) => (
              <div key={index} className="bullet-point-row">
                <span className="mt-2.5">•</span>
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => updateBullet(exp.id, index, e.target.value)}
                  placeholder="Enter achievement or responsibility"
                  className="bullet-input"
                />
                <button
                  type="button"
                  onClick={() => removeBullet(exp.id, index)}
                  className="remove-button"
                  aria-label="Remove bullet point"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addExperience}
        className="btn-secondary w-full"
      >
        Add Experience
      </button>
    </div>
  );
}

// Education Form
function EducationForm({ resumeData, setResumeData }: { resumeData: ResumeData, setResumeData: (data: ResumeData) => void }) {
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now(),
        school: '',
        degree: '',
        startDate: '',
        endDate: '',
        gpa: '',
      }]
    }));
  };

  const removeEducation = (id: number) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    });
  };

  return (
    <div className="section card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title flex items-center gap-2 mb-0">
          <GraduationCap size={24} className="text-blue-600" />
          Education
        </h2>
        <button
          onClick={addEducation}
          className="btn-secondary"
        >
          Add Education
        </button>
      </div>
      {resumeData.education.map((edu, index) => (
        <div key={edu.id} className="space-y-4 p-4 bg-gray-50 rounded-lg mb-4">
          <div className="flex justify-between">
            <h3 className="font-medium">Education #{index + 1}</h3>
            <button
              onClick={() => removeEducation(edu.id)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="School"
              value={edu.school}
              onChange={(e) => {
                const updatedEducation = resumeData.education.map(item =>
                  item.id === edu.id ? { ...item, school: e.target.value } : item
                );
                setResumeData({ ...resumeData, education: updatedEducation });
              }}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => {
                const updatedEducation = resumeData.education.map(item =>
                  item.id === edu.id ? { ...item, degree: e.target.value } : item
                );
                setResumeData({ ...resumeData, education: updatedEducation });
              }}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Start Date"
              value={edu.startDate}
              onChange={(e) => {
                const updatedEducation = resumeData.education.map(item =>
                  item.id === edu.id ? { ...item, startDate: e.target.value } : item
                );
                setResumeData({ ...resumeData, education: updatedEducation });
              }}
              className="input-field"
            />
            <input
              type="text"
              placeholder="End Date"
              value={edu.endDate}
              onChange={(e) => {
                const updatedEducation = resumeData.education.map(item =>
                  item.id === edu.id ? { ...item, endDate: e.target.value } : item
                );
                setResumeData({ ...resumeData, education: updatedEducation });
              }}
              className="input-field"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Skills Form
function SkillsForm({ resumeData, setResumeData }: { resumeData: ResumeData, setResumeData: (data: ResumeData) => void }) {
  const addSkill = (categoryId: number) => {
    const skill = prompt('Enter new skill:');
    if (skill) {
      setResumeData({
        ...resumeData,
        skills: resumeData.skills.map(cat =>
          cat.id === categoryId
            ? { ...cat, items: [...cat.items, skill] }
            : cat
        ),
      });
    }
  };

  const removeSkill = (categoryId: number, skillIndex: number) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map(cat =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter((_, index) => index !== skillIndex) }
          : cat
      ),
    });
  };

  return (
    <div className="section card slide-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">
          <Code size={24} className="text-blue-600" />
          Skills
        </h2>
      </div>
      {resumeData.skills.map((category) => (
        <div key={category.id} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700">{category.category}</h3>
            <button
              onClick={() => addSkill(category.id)}
              className="btn-secondary"
            >
              Add Skill
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {category.items.map((skill, index) => (
              <div
                key={index}
                className="skill-tag group"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(category.id, index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Certifications Form
function CertificationsForm({ resumeData, setResumeData }: { resumeData: ResumeData, setResumeData: (data: ResumeData) => void }) {
  const addCertification = () => {
    setResumeData({
      ...resumeData,
      certifications: [
        ...resumeData.certifications,
        {
          id: Date.now(),
          name: '',
          issuer: '',
          date: '',
        },
      ],
    });
  };

  const removeCertification = (id: number) => {
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.filter(cert => cert.id !== id),
    });
  };

  return (
    <div className="section card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title flex items-center gap-2 mb-0">
          <Award size={24} className="text-blue-600" />
          Certifications
        </h2>
        <button
          onClick={addCertification}
          className="btn-secondary"
        >
          Add Certification
        </button>
      </div>
      {resumeData.certifications.map((cert) => (
        <div key={cert.id} className="space-y-4 p-4 bg-gray-50 rounded-lg mb-4">
          <div className="flex justify-between">
            <h3 className="font-medium">Certification Details</h3>
            <button
              onClick={() => removeCertification(cert.id)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Certification Name"
              value={cert.name}
              onChange={(e) => {
                const updatedCerts = resumeData.certifications.map(c =>
                  c.id === cert.id ? { ...c, name: e.target.value } : c
                );
                setResumeData({ ...resumeData, certifications: updatedCerts });
              }}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Issuing Organization"
              value={cert.issuer}
              onChange={(e) => {
                const updatedCerts = resumeData.certifications.map(c =>
                  c.id === cert.id ? { ...c, issuer: e.target.value } : c
                );
                setResumeData({ ...resumeData, certifications: updatedCerts });
              }}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Date"
              value={cert.date}
              onChange={(e) => {
                const updatedCerts = resumeData.certifications.map(c =>
                  c.id === cert.id ? { ...c, date: e.target.value } : c
                );
                setResumeData({ ...resumeData, certifications: updatedCerts });
              }}
              className="input-field"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// References Form
function ReferencesForm({ resumeData, setResumeData }: { resumeData: ResumeData, setResumeData: (data: ResumeData) => void }) {
  const addReference = () => {
    setResumeData({
      ...resumeData,
      references: [
        ...resumeData.references,
        {
          id: Date.now(),
          name: '',
          position: '',
          company: '',
          email: '',
          phone: '',
        },
      ],
    });
  };

  const removeReference = (id: number) => {
    setResumeData({
      ...resumeData,
      references: resumeData.references.filter(ref => ref.id !== id),
    });
  };

  return (
    <div className="section card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title flex items-center gap-2 mb-0">
          <Users size={24} className="text-blue-600" />
          References
        </h2>
        <button
          onClick={addReference}
          className="btn-secondary"
        >
          Add Reference
        </button>
      </div>
      {resumeData.references.map((ref) => (
        <div key={ref.id} className="space-y-4 p-4 bg-gray-50 rounded-lg mb-4">
          <div className="flex justify-between">
            <h3 className="font-medium">Reference Details</h3>
            <button
              onClick={() => removeReference(ref.id)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Reference Name"
              value={ref.name}
              onChange={(e) => {
                const updatedRefs = resumeData.references.map(r =>
                  r.id === ref.id ? { ...r, name: e.target.value } : r
                );
                setResumeData({ ...resumeData, references: updatedRefs });
              }}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Position"
              value={ref.position}
              onChange={(e) => {
                const updatedRefs = resumeData.references.map(r =>
                  r.id === ref.id ? { ...r, position: e.target.value } : r
                );
                setResumeData({ ...resumeData, references: updatedRefs });
              }}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Company"
              value={ref.company}
              onChange={(e) => {
                const updatedRefs = resumeData.references.map(r =>
                  r.id === ref.id ? { ...r, company: e.target.value } : r
                );
                setResumeData({ ...resumeData, references: updatedRefs });
              }}
              className="input-field"
            />
            <input
              type="email"
              placeholder="Email"
              value={ref.email}
              onChange={(e) => {
                const updatedRefs = resumeData.references.map(r =>
                  r.id === ref.id ? { ...r, email: e.target.value } : r
                );
                setResumeData({ ...resumeData, references: updatedRefs });
              }}
              className="input-field"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={ref.phone}
              onChange={(e) => {
                const updatedRefs = resumeData.references.map(r =>
                  r.id === ref.id ? { ...r, phone: e.target.value } : r
                );
                setResumeData({ ...resumeData, references: updatedRefs });
              }}
              className="input-field"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ResumePreview({ data }: { data: ResumeData }) {
  return (
    <div className="resume-preview">
      <div className="resume-header flex justify-center items-center flex-col">
        <h1 className="text-3xl font-bold">{data.personal.name}</h1>
        <div className="title">{data.personal.title}</div>
        
        {/* Contact Info - Horizontal Layout */}
        <div className="contact-info flex gap-6 items-center mt-4">
          <div className="contact-item">
            <Mail size={16} />
            {data.personal.email}
          </div>
          <span className="text-gray-300">|</span>
          <div className="contact-item">
            <Phone size={16} />
            {data.personal.phone}
          </div>
          <span className="text-gray-300">|</span>
          <div className="contact-item">
            <MapPin size={16} />
            {data.personal.location}
          </div>
        </div>

        {/* Social Links */}
        <div className="social-links flex gap-4 mt-4">
          {data.personal.linkedin && (
            <a
              href={data.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="tooltip social-link"
              data-tooltip="LinkedIn Profile"
            >
              <Linkedin size={20} />
            </a>
          )}
          {data.personal.github && (
            <a
              href={data.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="tooltip social-link"
              data-tooltip="GitHub Profile"
            >
              <Github size={20} />
            </a>
          )}
          {data.personal.portfolio && (
            <a
              href={data.personal.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="tooltip social-link"
              data-tooltip="Portfolio Website"
            >
              <Globe size={20} />
            </a>
          )}
        </div>

        {data.personal.summary && (
          <p className="mt-6 text-sm text-gray-600 text-center max-w-2xl mx-auto">{data.personal.summary}</p>
        )}
      </div>

      {data.experience.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">Professional Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="experience-item">
              <h3>{exp.company}</h3>
              <div className="experience-meta">
                <span className="font-medium">{exp.position}</span>
                <span>•</span>
                <span>{exp.startDate} - {exp.endDate || 'Present'}</span>
              </div>
              {exp.description && (
                <p className="experience-description mb-2">{exp.description}</p>
              )}
              {exp.bullets.length > 0 && (
                <ul className="list-disc pl-4 space-y-1">
                  {exp.bullets.map((bullet, index) => (
                    <li key={index} className="text-sm text-gray-700">{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="education-item">
              <h3>{edu.school}</h3>
              <div className="education-meta">
                <span className="font-medium">{edu.degree}</span>
                <span>•</span>
                <span>{edu.startDate} - {edu.endDate || 'Present'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">Skills</h2>
          <div className="skills-section">
            {data.skills.map((category) => (
              <div key={category.id} className="skills-category">
                <h3>{category.category}</h3>
                <div className="skills-list">
                  {category.items.map((skill) => (
                    <span key={skill} className="skill-item">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.certifications.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">Certifications</h2>
          <div className="certifications-grid">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="certification-item">
                <h3 className="font-medium text-gray-900">{cert.name}</h3>
                <div className="text-sm text-gray-600">
                  <p>{cert.issuer}</p>
                  <p>{cert.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.references.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title">References</h2>
          <div className="references-grid">
            {data.references.map((ref) => (
              <div key={ref.id} className="reference-item">
                <h3 className="font-medium text-gray-900">{ref.name}</h3>
                <div className="text-sm text-gray-600">
                  <p>{ref.position}</p>
                  <p>{ref.company}</p>
                  <div className="mt-2">
                    <p className="flex items-center gap-2">
                      <Mail size={14} />
                      {ref.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={14} />
                      {ref.phone}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
