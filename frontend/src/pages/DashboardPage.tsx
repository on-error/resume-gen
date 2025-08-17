import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  AppBar, 
  Toolbar,
  Alert,
  IconButton
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  Folder as FolderIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import PersonalInfoForm from '../components/forms/PersonalInfoForm';
import ExperienceForm from '../components/forms/ExperienceForm';
import EducationForm from '../components/forms/EducationForm';
import SkillsForm from '../components/forms/SkillsForm';
import ProjectsForm from '../components/forms/ProjectsForm';
import { personalInfoAPI, experienceAPI, educationAPI, skillsAPI, projectsAPI } from '../services/api';

interface User {
  id: string;
  email: string;
}

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showSkillsForm, setShowSkillsForm] = useState(false);
  const [showProjectsForm, setShowProjectsForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    console.log('userdata', userData)
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handlePersonalInfoSubmit = async (data: any) => {
    if (!user) return;

    setIsLoading(true);
    setError('');

    try {
      await personalInfoAPI.update({
        userId: user.id,
        ...data,
      });
      setShowPersonalInfoForm(false);
      // You could show a success message here
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save personal information.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExperienceSubmit = async (data: any) => {
    if (!user) return;

    setIsLoading(true);
    setError('');

    try {
      await experienceAPI.create({
        userId: user.id,
        ...data,
      });
      setShowExperienceForm(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save experience.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEducationSubmit = async (data: any) => {
    if (!user) return;

    setIsLoading(true);
    setError('');

    try {
      await educationAPI.create({
        userId: user.id,
        ...data,
      });
      setShowEducationForm(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save education.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillsSubmit = async (data: any) => {
    if (!user) return;

    setIsLoading(true);
    setError('');

    try {
      await skillsAPI.create({
        userId: user.id,
        ...data,
      });
      setShowSkillsForm(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save skills.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectsSubmit = async (data: any) => {
    if (!user) return;

    setIsLoading(true);
    setError('');

    try {
      await projectsAPI.create({
        userId: user.id,
        ...data,
      });
      setShowProjectsForm(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save projects.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (showPersonalInfoForm) {
    return (
      <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setShowPersonalInfoForm(false)}
              sx={{ mb: 2 }}
            >
              Back to Dashboard
            </Button>
          </Box>
          <PersonalInfoForm
            onSubmit={handlePersonalInfoSubmit}
            isLoading={isLoading}
            error={error}
          />
        </Container>
      </Box>
    );
  }

  if (showExperienceForm) {
    return (
      <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setShowExperienceForm(false)}
              sx={{ mb: 2 }}
            >
              Back to Dashboard
            </Button>
          </Box>
          <ExperienceForm
            onSubmit={handleExperienceSubmit}
            isLoading={isLoading}
            error={error}
          />
        </Container>
      </Box>
    );
  }

  if (showEducationForm) {
    return (
      <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setShowEducationForm(false)}
              sx={{ mb: 2 }}
            >
              Back to Dashboard
            </Button>
          </Box>
          <EducationForm
            onSubmit={handleEducationSubmit}
            isLoading={isLoading}
            error={error}
          />
        </Container>
      </Box>
    );
  }

  if (showSkillsForm) {
    return (
      <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setShowSkillsForm(false)}
              sx={{ mb: 2 }}
            >
              Back to Dashboard
            </Button>
          </Box>
          <SkillsForm
            onSubmit={handleSkillsSubmit}
            isLoading={isLoading}
            error={error}
          />
        </Container>
      </Box>
    );
  }

  if (showProjectsForm) {
    return (
      <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setShowProjectsForm(false)}
              sx={{ mb: 2 }}
            >
              Back to Dashboard
            </Button>
          </Box>
          <ProjectsForm
            onSubmit={handleProjectsSubmit}
            isLoading={isLoading}
            error={error}
          />
        </Container>
      </Box>
    );
  }

  const dashboardCards = [
    {
      title: 'Personal Information',
      description: 'Add your basic information, contact details, and professional summary.',
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      action: () => setShowPersonalInfoForm(true),
      color: 'primary'
    },
    {
      title: 'Work Experience',
      description: 'Add your work history, job titles, and responsibilities.',
      icon: <WorkIcon sx={{ fontSize: 40 }} />,
      action: () => setShowExperienceForm(true),
      color: 'secondary'
    },
    {
      title: 'Education',
      description: 'Add your educational background and qualifications.',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      action: () => setShowEducationForm(true),
      color: 'success'
    },
    {
      title: 'Skills',
      description: 'Add your technical and soft skills with proficiency levels.',
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      action: () => setShowSkillsForm(true),
      color: 'info'
    },
    {
      title: 'Projects',
      description: 'Showcase your projects and achievements.',
      icon: <FolderIcon sx={{ fontSize: 40 }} />,
      action: () => setShowProjectsForm(true),
      color: 'warning'
    },
                {
              title: 'Build Resume',
              description: 'Create a professional resume based on your information.',
              icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
              action: () => navigate('/resume-builder'),
              color: 'error'
            },
            {
              title: 'Add Template',
              description: 'Create new resume templates with LaTeX code.',
              icon: <CodeIcon sx={{ fontSize: 40 }} />,
              action: () => navigate('/resume-template'),
              color: 'secondary'
            },
            {
              title: 'Job Description',
              description: 'Add job details to generate targeted resumes.',
              icon: <WorkIcon sx={{ fontSize: 40 }} />,
              action: () => navigate('/job-description'),
              color: 'info'
            }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Resume Generator
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome, {user.email}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {dashboardCards.map((card, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index} component="div">
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease-in-out'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ color: `${card.color}.main`, mb: 2 }}>
                    {card.icon}
                  </Box>
                  <Typography gutterBottom variant="h6" component="h2">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {card.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color={card.color as any}
                    fullWidth
                    onClick={card.action}
                  >
                    {card.title === 'Personal Information' ? 'Edit Personal Info' : 
                     card.title === 'Generate Resume' ? 'Generate Resume' : 
                     `Add ${card.title}`}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;
