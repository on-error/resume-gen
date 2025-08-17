import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Chip,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  Folder as FolderIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import PersonalInfoForm from '../components/forms/PersonalInfoForm';
import ExperienceForm from '../components/forms/ExperienceForm';
import EducationForm from '../components/forms/EducationForm';
import SkillsForm from '../components/forms/SkillsForm';
import ProjectsForm from '../components/forms/ProjectsForm';
import { personalInfoAPI } from '../services/api';
import { getResponseFromKey } from './utils';
import { getUser } from '../utils/auth';

interface User {
  id: string;
  email: string;
}

interface FormData {
  personalInfo: any;
  experience: any;
  education: any;
  skills: any;
  projects: any;
}

const ResumeBuilderPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | false>('personal-info');
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {},
    experience: { experiences: [] },
    education: { education: [] },
    skills: { skills: [] },
    projects: { projects: [] },
  });
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  React.useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleSectionChange = (section: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? section : false);
  };

  const handleFormSubmit = (section: string) => async (data: any) => {
    setIsLoading(true);
    setError('');

    try {
      // Update local form data
      setFormData(prev => ({
        ...prev,
        [section]: data,
      }));

      // Mark section as completed
      setCompletedSections(prev => new Set([...prev, section]));

      // Auto-expand next section
      const sections = ['personal-info', 'experience', 'education', 'skills', 'projects'];
      const currentIndex = sections.indexOf(section);
      if (currentIndex < sections.length - 1) {
        setExpandedSection(sections[currentIndex + 1]);
      }

      const user = getUser();

      // You can add API calls here later
      console.log(`${section} data:`, data);
      const response = await getResponseFromKey(section, { ...data, userId: user?.id });
      console.log('response', response);
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to save ${section}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const getCompletionPercentage = () => {
    const totalSections = 5;
    return (completedSections.size / totalSections) * 100;
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'personal-info': return <PersonIcon />;
      case 'experience': return <WorkIcon />;
      case 'education': return <SchoolIcon />;
      case 'skills': return <CodeIcon />;
      case 'projects': return <FolderIcon />;
      default: return <PersonIcon />;
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'personal-info': return '#6366f1'; // Indigo
      case 'experience': return '#ec4899'; // Pink
      case 'education': return '#10b981'; // Emerald
      case 'skills': return '#3b82f6'; // Blue
      case 'projects': return '#f59e0b'; // Amber
      default: return '#6366f1';
    }
  };

  const sections = [
    {
      key: 'personal-info',
      title: 'Personal Information',
      description: 'Basic details, contact information, and professional summary',
      component: PersonalInfoForm,
    },
    {
      key: 'experience',
      title: 'Work Experience',
      description: 'Your professional work history and achievements',
      component: ExperienceForm,
    },
    {
      key: 'education',
      title: 'Education',
      description: 'Academic background and qualifications',
      component: EducationForm,
    },
    {
      key: 'skills',
      title: 'Skills',
      description: 'Technical and soft skills with proficiency levels',
      component: SkillsForm,
    },
    {
      key: 'projects',
      title: 'Projects',
      description: 'Showcase your projects and achievements',
      component: ProjectsForm,
    },
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4 
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ 
              mb: 2, 
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Back to Dashboard
          </Button>
          
          <Paper elevation={8} sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  Resume Builder
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Complete your professional resume step by step
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" gutterBottom>
                  {Math.round(getCompletionPercentage())}% Complete
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={getCompletionPercentage()} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    }
                  }}
                />
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Box>

        {/* Form Sections */}
        <Grid container spacing={3}>
          <Grid size={{xs:12, md:8}} component="div">
            {sections.map((section) => {
              const Component = section.component;
              const isCompleted = completedSections.has(section.key);
              const sectionColor = getSectionColor(section.key);

              return (
                <Accordion
                  key={section.key}
                  expanded={expandedSection === section.key}
                  onChange={handleSectionChange(section.key)}
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    overflow: 'hidden',
                    '&:before': { display: 'none' },
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    '&.Mui-expanded': {
                      margin: '16px 0',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: isCompleted ? `${sectionColor}15` : 'white',
                      borderLeft: `4px solid ${sectionColor}`,
                      '&:hover': {
                        backgroundColor: isCompleted ? `${sectionColor}20` : '#f8fafc',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          backgroundColor: `${sectionColor}15`,
                          color: sectionColor,
                          mr: 2,
                        }}
                      >
                        {getSectionIcon(section.key)}
                      </Box>
                      
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {section.title}
                          </Typography>
                          {isCompleted && (
                            <CheckCircleIcon sx={{ color: sectionColor, fontSize: 20 }} />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {section.description}
                        </Typography>
                      </Box>

                      {isCompleted && (
                        <Chip
                          label="Completed"
                          size="small"
                          sx={{
                            backgroundColor: `${sectionColor}15`,
                            color: sectionColor,
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Box>
                  </AccordionSummary>
                  
                  <AccordionDetails sx={{ p: 0 }}>
                    <Box sx={{ p: 3, backgroundColor: '#fafbfc' }}>
                      <Component
                        onSubmit={handleFormSubmit(section.key)}
                        isLoading={isLoading}
                        initialData={formData[section.key as keyof FormData]}
                        error={error}
                      />
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Grid>

          {/* Progress Sidebar */}
          <Grid size={{xs:12, md:4}} component="div">
            <Paper elevation={8} sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 24 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Progress Overview
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                  {Math.round(getCompletionPercentage())}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Resume completion
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                {sections.map((section) => {
                  const isCompleted = completedSections.has(section.key);
                  const sectionColor = getSectionColor(section.key);
                  
                  return (
                    <Box
                      key={section.key}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 1,
                        px: 2,
                        mb: 1,
                        borderRadius: 2,
                        backgroundColor: isCompleted ? `${sectionColor}10` : '#f1f5f9',
                        border: isCompleted ? `1px solid ${sectionColor}30` : '1px solid #e2e8f0',
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: isCompleted ? sectionColor : '#cbd5e1',
                          mr: 2,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          flexGrow: 1,
                          fontWeight: isCompleted ? 600 : 400,
                          color: isCompleted ? 'text.primary' : 'text.secondary',
                        }}
                      >
                        {section.title}
                      </Typography>
                      {isCompleted && (
                        <CheckCircleIcon sx={{ color: sectionColor, fontSize: 16 }} />
                      )}
                    </Box>
                  );
                })}
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<PreviewIcon />}
                  fullWidth
                  sx={{ borderRadius: 2 }}
                >
                  Preview
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  fullWidth
                  sx={{ 
                    borderRadius: 2,
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #5a67d8 0%, #6b46c1 100%)',
                    }
                  }}
                >
                  Save
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ResumeBuilderPage;
