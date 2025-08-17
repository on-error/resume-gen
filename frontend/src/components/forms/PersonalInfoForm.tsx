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
  Grid,
  Divider,
  Alert,
  Fade,
  Slide,
  Grow,
} from '@mui/material';
import {
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Link as LinkIcon,
  Description as DescriptionIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import FormInput from '../FormInput';
import FormTextarea from '../FormTextarea';
import FormSelect from '../FormSelect';
import FormDate from '../FormDate';

type PersonalInfoData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | undefined;
  address: string | undefined;
  city: string | undefined;
  state: string | undefined;
  zipCode: string | undefined;
  country: string | undefined;
  linkedin: string | undefined;
  github: string | undefined;
  portfolio: string | undefined;
  website: string | undefined;
  summary: string | undefined;
  objective: string | undefined;
  dateOfBirth: string | undefined;
  nationality: string | undefined;
};

interface PersonalInfoFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  initialData?: Partial<PersonalInfoData>;
  error?: string;
}

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  phone: yup.string().optional(),
  address: yup.string().optional(),
  city: yup.string().optional(),
  state: yup.string().optional(),
  zipCode: yup.string().optional(),
  country: yup.string().optional(),
  linkedin: yup.string().url('Please enter a valid LinkedIn URL').optional(),
  github: yup.string().url('Please enter a valid GitHub URL').optional(),
  portfolio: yup.string().url('Please enter a valid portfolio URL').optional(),
  website: yup.string().url('Please enter a valid website URL').optional(),
  summary: yup.string().optional(),
  objective: yup.string().optional(),
  dateOfBirth: yup.string().optional(),
  nationality: yup.string().optional(),
});

const countries = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'IN', label: 'India' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'CN', label: 'China' },
  { value: 'BR', label: 'Brazil' },
];

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData = {},
  error,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {/* Basic Information */}
      <Fade in timeout={600}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#6366f115',
                color: '#6366f1',
                mr: 2,
              }}
            >
              <PersonIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
              Basic Information
            </Typography>
          </Box>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)',
                borderColor: '#6366f1',
              }
            }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }} component="div">
                <Slide direction="up" in timeout={800}>
                  <FormInput
                    label="First Name"
                    placeholder="Enter your first name"
                    error={!!errors.firstName?.message}
                    required
                    helperText={errors.firstName?.message || ''}
                    disabled={isLoading}
                    {...register('firstName')}
                  />
                </Slide>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }} component="div">
                <Slide direction="up" in timeout={900}>
                  <FormInput
                    label="Last Name"
                    placeholder="Enter your last name"
                    error={!!errors.lastName?.message}
                    required
                    helperText={errors.lastName?.message || ''}
                    disabled={isLoading}
                    {...register('lastName')}
                  />
                </Slide>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }} component="div">
                <Slide direction="up" in timeout={1000}>
                  <FormInput
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    error={!!errors.email?.message}
                    required
                    helperText={errors.email?.message || ''}
                    disabled={isLoading}
                    {...register('email')}
                  />
                </Slide>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }} component="div">
                <Slide direction="up" in timeout={1100}>
                  <FormInput
                    label="Phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    error={!!errors.phone?.message}
                    helperText={errors.phone?.message || ''}
                    disabled={isLoading}
                    {...register('phone')}
                  />
                </Slide>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }} component="div">
                <Slide direction="up" in timeout={1200}>
                  <FormDate
                    label="Date of Birth"
                    error={!!errors.dateOfBirth?.message}
                    helperText={errors.dateOfBirth?.message || ''}
                    disabled={isLoading}
                    {...register('dateOfBirth')}
                  />
                </Slide>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }} component="div">
                <Slide direction="up" in timeout={1300}>
                  <FormInput
                    label="Nationality"
                    placeholder="Enter your nationality"
                    error={!!errors.nationality?.message}
                    helperText={errors.nationality?.message || ''}
                    disabled={isLoading}
                    {...register('nationality')}
                  />
                </Slide>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Fade>

      {/* Address Information */}
      <Fade in timeout={800}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#10b98115',
                color: '#10b981',
                mr: 2,
              }}
            >
              <LocationIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
              Address Information
            </Typography>
          </Box>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              backgroundColor: '#f0fdf415',
              border: '1px solid #bbf7d0',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)',
                borderColor: '#10b981',
              }
            }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }} component="div">
                <Slide direction="up" in timeout={1400}>
                  <FormInput
                    label="Address"
                    placeholder="Enter your address"
                    error={!!errors.address?.message}
                    disabled={isLoading}
                    {...register('address')}
                  />
                </Slide>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }} component="div">
                <Slide direction="up" in timeout={1500}>
                  <FormInput
                    label="City"
                    placeholder="Enter your city"
                    error={!!errors.city?.message}
                    disabled={isLoading}
                    {...register('city')}
                  />
                </Slide>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }} component="div">
                <Slide direction="up" in timeout={1600}>
                  <FormInput
                    label="State/Province"
                    placeholder="Enter your state or province"
                    error={!!errors.state?.message}
                    disabled={isLoading}
                    {...register('state')}
                  />
                </Slide>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }} component="div">
                <Slide direction="up" in timeout={1700}>
                  <FormInput
                    label="ZIP/Postal Code"
                    placeholder="Enter your ZIP or postal code"
                    error={!!errors.zipCode?.message}
                    helperText={errors.zipCode?.message || ''}
                    disabled={isLoading}
                    {...register('zipCode')}
                  />
                </Slide>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }} component="div">
                <Slide direction="up" in timeout={1800}>
                  <FormSelect
                    label="Country"
                    options={countries}
                    error={errors.country?.message || ''}
                    disabled={isLoading}
                    placeholder="Select your country"
                    {...register('country')}
                  />
                </Slide>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Fade>

      {/* Professional Links */}
      <Fade in timeout={1000}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#3b82f615',
                color: '#3b82f6',
                mr: 2,
              }}
            >
              <LinkIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
              Professional Links
            </Typography>
          </Box>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              backgroundColor: '#eff6ff15',
              border: '1px solid #bfdbfe',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)',
                borderColor: '#3b82f6',
              }
            }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }} component="div">
                <Slide direction="up" in timeout={1900}>
                  <FormInput
                    label="LinkedIn Profile"
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    error={!!errors.linkedin?.message}
                    disabled={isLoading}
                    {...register('linkedin')}
                  />
                </Slide>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }} component="div">
                <Slide direction="up" in timeout={2000}>
                  <FormInput
                    label="GitHub Profile"
                    type="url"
                    placeholder="https://github.com/yourusername"
                    error={!!errors.github?.message}
                    disabled={isLoading}
                    {...register('github')}
                  />
                </Slide>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }} component="div">
                <Slide direction="up" in timeout={2100}>
                  <FormInput
                    label="Portfolio Website"
                    type="url"
                    placeholder="https://yourportfolio.com"
                    error={!!errors.portfolio?.message}
                    helperText={errors.portfolio?.message}
                    disabled={isLoading}
                    {...register('portfolio')}
                  />
                </Slide>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }} component="div">
                <Slide direction="up" in timeout={2200}>
                  <FormInput
                    label="Personal Website"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    error={!!errors.website?.message}
                    helperText={errors.website?.message}
                    disabled={isLoading}
                    {...register('website')}
                  />
                </Slide>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Fade>

      {/* Summary and Objective */}
      <Fade in timeout={1200}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#f59e0b15',
                color: '#f59e0b',
                mr: 2,
              }}
            >
              <DescriptionIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
              Professional Summary
            </Typography>
          </Box>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              backgroundColor: '#fffbeb15',
              border: '1px solid #fed7aa',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.1)',
                borderColor: '#f59e0b',
              }
            }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }} component="div">
                <Slide direction="up" in timeout={2300}>
                  <FormTextarea
                    label="Professional Summary"
                    placeholder="Write a brief professional summary about yourself..."
                    error={!!errors.summary?.message}
                    helperText={errors.summary?.message}
                    rows={4}
                    disabled={isLoading}
                    {...register('summary')}
                  />
                </Slide>
              </Grid>

              <Grid size={{ xs: 12 }} component="div">
                <Slide direction="up" in timeout={2400}>
                  <FormTextarea
                    label="Career Objective"
                    placeholder="Write your career objective..."
                    error={!!errors.objective?.message}
                    helperText={errors.objective?.message}
                    rows={4}
                    disabled={isLoading}
                    {...register('objective')}
                  />
                </Slide>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Fade>

      <Grow in timeout={1500}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            startIcon={<SaveIcon />}
            sx={{ 
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              }
            }}
          >
            {isLoading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </Box>
      </Grow>
    </Box>
  );
};

export default PersonalInfoForm;
