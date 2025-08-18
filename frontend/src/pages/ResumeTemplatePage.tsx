import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Alert,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import ResumeTemplateForm, { ResumeTemplateData } from '../components/forms/ResumeTemplateForm';
import { resumeTemplateAPI } from '../services/api';

interface User {
  id: string;
  email: string;
}

const ResumeTemplatePage: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [resumeTemplate, setResumeTemplate] = useState<ResumeTemplateData | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getResumeTemplate = async () => {
    setIsFetching(true);
    const response = await resumeTemplateAPI.getById(id || '');
    const data = {
      name: response.resumeTemplate.name,
      description: response.resumeTemplate.description,
      imageUrl: response.resumeTemplate.imageUrl,
      isActive: response.resumeTemplate.status,
      latexCode: response.resumeTemplate.content,
      category: response.resumeTemplate.category || '',
      tags: response.resumeTemplate.tags || [],
    }
    setResumeTemplate(data);
    console.log('Response:', response);
    setIsFetching(false);
  }

  React.useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  useEffect(() => {
    if (id) {
      getResumeTemplate();
    }
  }, [id]);

  const handleFormSubmit = async (data: ResumeTemplateData) => {
    setIsLoading(true);
    setError('');

    try {
      // You can add API calls here later
      console.log('Template data:', data);

      if(id) {
        const response = await resumeTemplateAPI.update(id, data);
        console.log('Response:', response);
      } else {
        const response = await resumeTemplateAPI.create(data);
        console.log('Response:', response);
      }
      
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message and redirect
      alert('Template saved successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save template.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (isFetching) {
    return <div>Loading...</div>;
  }

  // useEffect(() => {
  //   if (id) {
  //     getResumeTemplate();
  //   }
  // }, [id]);

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
              <Typography color="text.primary">Add Template</Typography>
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
                  backgroundColor: '#8b5cf615',
                  color: '#8b5cf6',
                  mr: 2,
                }}
              >
                <CodeIcon />
              </Box>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  Add Resume Template
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Create a new resume template with LaTeX code and preview image
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

        {/* Template Form */}
        <ResumeTemplateForm
          initialData={resumeTemplate || {}}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          error={error}
        />
      </Container>
    </Box>
  );
};

export default ResumeTemplatePage;
