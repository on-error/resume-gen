import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container
} from '@mui/material';
import SignupForm from '../components/auth/SignupForm';
import { authAPI } from '../services/api';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

const SignupPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const { confirmPassword, ...signupData } = data;
      const response = await authAPI.signup(signupData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: 'grey.50',
        py: 3
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Resume Generator
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create your account
          </Typography>
        </Box>

        <SignupForm onSubmit={handleSignup} isLoading={isLoading} error={error} />

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ color: '#1976d2', textDecoration: 'none' }}
            >
              Sign in here
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default SignupPage;
