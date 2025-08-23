import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Alert,
  Breadcrumbs,
  Link,
  Snackbar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Work as WorkIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import JobDescriptionForm from '../components/forms/JobDescriptionForm';
import ResumePreview from '../components/ResumePreview';
import { resumeAPI } from '../services/api';

interface User {
  id: string;
  email: string;
}

const JobDescriptionPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [generatedResume, setGeneratedResume] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');

    try {
      // You can add API calls here later
      console.log('Job description data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccessMessage('Job description saved successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save job description.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateResume = async (data: any) => {
    setIsGenerating(true);
    setError('');

    try {
      console.log('Generating resume for job:', data);
      
      const response = await resumeAPI.generate({ 
        userId: user?.id || '', 
        jobDescription: data.jobDescription 
      });
      
      setGeneratedResume(response.resume);
      setSuccessMessage('Targeted resume generated successfully!');
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate resume.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateResume = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    setError('');

    try {
      const response = await resumeAPI.generate({ 
        userId: user.id, 
        jobDescription: 'Regenerate with same job description' 
      });
      
      setGeneratedResume(response.resume);
      setSuccessMessage('Resume regenerated successfully!');
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to regenerate resume.');
    } finally {
      setIsGenerating(false);
    }
  };

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
            <Breadcrumbs sx={{ mb: 2 }}>
              <Link
                color="inherit"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/dashboard');
                }}
                sx={{ cursor: 'pointer' }}
              >
                Dashboard
              </Link>
              <Typography color="text.primary">Job Description</Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: '#06b6d415',
                  color: '#06b6d4',
                  mr: 2,
                }}
              >
                <WorkIcon />
              </Box>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  Job Description & Resume Generation
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Add job details to generate a targeted resume that matches the position
                </Typography>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Box>

        {/* Job Description Form */}
        <JobDescriptionForm
          onSubmit={handleFormSubmit}
          onGenerateResume={handleGenerateResume}
          isLoading={isLoading}
          isGenerating={isGenerating}
          error={error}
        />

        {/* Resume Preview */}
        {generatedResume && (
          <Box sx={{ mt: 4 }}>
            <ResumePreview
              resumeHtml={generatedResume}
              isLoading={isGenerating}
              onRegenerate={handleRegenerateResume}
            />
          </Box>
        )}
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSuccessMessage('')}
          severity="success"
          sx={{ width: '100%' }}
          icon={<AutoAwesomeIcon />}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default JobDescriptionPage;
