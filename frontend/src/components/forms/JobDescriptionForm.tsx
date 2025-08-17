import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Fade,
  Slide,
  Grow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Work as WorkIcon,
  Save as SaveIcon,
  AutoAwesome as AutoAwesomeIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import FormTextarea from '../FormTextarea';

type JobDescriptionData = {
  jobDescription: string;
};

interface JobDescriptionFormProps {
  onSubmit: (data: JobDescriptionData) => void;
  onGenerateResume?: (data: JobDescriptionData) => void;
  isLoading?: boolean;
  isGenerating?: boolean;
  initialData?: Partial<JobDescriptionData>;
  error?: string;
}

const schema = yup.object().shape({
  jobDescription: yup.string().required('Job description is required'),
});

const JobDescriptionForm: React.FC<JobDescriptionFormProps> = ({
  onSubmit,
  onGenerateResume,
  isLoading = false,
  isGenerating = false,
  initialData = {},
  error,
}) => {
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<JobDescriptionData>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  const handleGenerateResume = (data: JobDescriptionData) => {
    if (onGenerateResume) {
      setShowGenerateDialog(true);
    }
  };

  const confirmGenerateResume = () => {
    const formData = watch();
    if (onGenerateResume) {
      onGenerateResume(formData);
    }
    setShowGenerateDialog(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Fade in timeout={600}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                color: 'white',
                mr: 3,
                boxShadow: '0 8px 32px rgba(6, 182, 212, 0.3)',
              }}
            >
              <WorkIcon />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>
                Job Description
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Paste the job description to generate a targeted resume
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Fade in timeout={800}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '1px solid #e2e8f0',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 20px 40px rgba(6, 182, 212, 0.1)',
              borderColor: '#06b6d4',
              transform: 'translateY(-2px)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#06b6d415',
                color: '#06b6d4',
                mr: 2,
              }}
            >
              <DescriptionIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
              Paste Job Description
            </Typography>
          </Box>

          <Slide direction="up" in timeout={1000}>
            <FormTextarea
              label="Job Description"
              placeholder="Paste the complete job description here. Include requirements, responsibilities, and any specific keywords that should be highlighted in your resume..."
              error={!!errors.jobDescription?.message}
              helperText={errors.jobDescription?.message || 'The system will analyze this description to optimize your resume for this specific position.'}
              rows={12}
              required
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'white',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#06b6d4',
                    },
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#06b6d4',
                      borderWidth: 2,
                    },
                  },
                },
              }}
              {...register('jobDescription')}
            />
          </Slide>

          <Grow in timeout={1200}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 4 }}>
              {onGenerateResume && (
                <Button
                  variant="contained"
                  startIcon={isGenerating ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
                  onClick={handleSubmit(handleGenerateResume)}
                  disabled={isGenerating}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                    boxShadow: '0 8px 25px rgba(6, 182, 212, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
                      boxShadow: '0 12px 35px rgba(6, 182, 212, 0.6)',
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  {isGenerating ? 'Generating...' : 'Generate Targeted Resume'}
                </Button>
              )}

              <Button
                variant="outlined"
                startIcon={<SaveIcon />}
                type="submit"
                disabled={isLoading}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderColor: '#06b6d4',
                  color: '#06b6d4',
                  borderWidth: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#0891b2',
                    backgroundColor: '#ecfeff',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                {isLoading ? 'Saving...' : 'Save Description'}
              </Button>
            </Box>
          </Grow>
        </Paper>
      </Fade>

      {/* Generate Resume Confirmation Dialog */}
      <Dialog
        open={showGenerateDialog}
        onClose={() => setShowGenerateDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#06b6d415',
                color: '#06b6d4',
                mr: 2,
              }}
            >
              <AutoAwesomeIcon />
            </Box>
            Generate Targeted Resume
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            This will generate a resume specifically tailored to the job description you've provided. 
            The system will:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#06b6d4',
                  mr: 2,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Analyze the job requirements and extract key skills
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#06b6d4',
                  mr: 2,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Highlight relevant experiences and achievements
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#06b6d4',
                  mr: 2,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Optimize your professional summary
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#06b6d4',
                  mr: 2,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Suggest keyword-optimized content
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              p: 2,
              backgroundColor: '#fef3c7',
              borderRadius: 2,
              border: '1px solid #fbbf24',
            }}
          >
            <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600 }}>
              Note: This will create a new version of your resume. Your existing data will be preserved.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowGenerateDialog(false)}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmGenerateResume}
            variant="contained"
            startIcon={<AutoAwesomeIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            }}
          >
            Generate Resume
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobDescriptionForm;
