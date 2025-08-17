import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container,
  Alert,
  Grid
} from '@mui/material';
import FormInput from '../FormInput';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void;
  isLoading?: boolean;
  error?: string;
}

const schema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
});

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, isLoading = false, error }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(schema),
  });

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormInput
                label="First Name"
                placeholder="Enter your first name"
                error={errors.firstName?.message}
                required
                disabled={isLoading}
                {...register('firstName')}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormInput
                label="Last Name"
                placeholder="Enter your last name"
                error={errors.lastName?.message}
                required
                disabled={isLoading}
                {...register('lastName')}
              />
            </Grid>
          </Grid>

          <FormInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            required
            disabled={isLoading}
            {...register('email')}
          />
          
          <FormInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            required
            disabled={isLoading}
            {...register('password')}
          />

          <FormInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            required
            disabled={isLoading}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignupForm;
