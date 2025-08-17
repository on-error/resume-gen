import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
  Alert,
  Fade,
  Slide,
  Grow,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Work as WorkIcon,
  Save as SaveIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import FormInput from '../FormInput';
import FormTextarea from '../FormTextarea';
import FormDate from '../FormDate';
import FormCheckbox from '../FormCheckbox';

type ExperienceData = {
  experiences: Array<{
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
};

interface ExperienceFormProps {
  onSubmit: (data: ExperienceData) => void;
  isLoading?: boolean;
  initialData?: Partial<ExperienceData>;
  error?: string;
}

const schema = yup.object().shape({
  experiences: yup.array().of(
    yup.object().shape({
      company: yup.string().required('Company name is required'),
      position: yup.string().required('Position is required'),
      location: yup.string().required('Location is required'),
      startDate: yup.string().required('Start date is required'),
      endDate: yup.string().when('current', {
        is: (current: boolean) => current === true,
        then: () => yup.string().optional(),
        otherwise: () => yup.string().required('End date is required'),
      }),
      current: yup.boolean(),
      description: yup.string().required('Description is required'),
    })
  ),
});

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData = { experiences: [] },
  error,
}) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ExperienceData>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experiences',
  });

  const watchedExperiences = watch('experiences');

  const addExperience = () => {
    append({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Fade in timeout={600}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#ec489915',
                color: '#ec4899',
                mr: 2,
              }}
            >
              <WorkIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
              Work Experience
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add your professional work history, including job titles, companies, and key achievements.
          </Typography>
        </Box>
      </Fade>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {fields.length === 0 ? (
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              backgroundColor: '#f8fafc',
              border: '2px dashed #e2e8f0',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#ec4899',
                backgroundColor: '#fdf2f8',
              },
            }}
          >
            <WorkIcon sx={{ fontSize: 48, color: '#ec4899', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: '#374151' }}>
              No work experience added yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start building your professional profile by adding your work experience.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addExperience}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #db2777 0%, #9d174d 100%)',
                  boxShadow: '0 6px 20px rgba(236, 72, 153, 0.6)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Add First Experience
            </Button>
          </Paper>
        </Fade>
      ) : (
        <Box>
          {fields.map((field, index) => {
            const isCurrent = watchedExperiences?.[index]?.current;
            const experienceErrors = errors.experiences?.[index];

            return (
              <Slide direction="up" in timeout={600 + index * 200} key={field.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    backgroundColor: '#fdf2f8',
                    border: '1px solid #fbcfe8',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 20px rgba(236, 72, 153, 0.1)',
                      borderColor: '#ec4899',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BusinessIcon sx={{ color: '#ec4899', mr: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                        Experience #{index + 1}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {isCurrent && (
                        <Chip
                          label="Current"
                          size="small"
                          sx={{
                            backgroundColor: '#ec489915',
                            color: '#ec4899',
                            fontWeight: 600,
                          }}
                        />
                      )}
                      <IconButton
                        onClick={() => remove(index)}
                        sx={{
                          color: '#ef4444',
                          '&:hover': {
                            backgroundColor: '#fef2f2',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <FormInput
                        label="Company"
                        placeholder="Enter company name"
                        error={!!experienceErrors?.company?.message}
                        helperText={experienceErrors?.company?.message || ''}
                        required
                        disabled={isLoading}
                        {...register(`experiences.${index}.company`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <FormInput
                        label="Position"
                        placeholder="Enter job title"
                        error={!!experienceErrors?.position?.message}
                        helperText={experienceErrors?.position?.message || ''}
                        required
                        disabled={isLoading}
                        {...register(`experiences.${index}.position`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <FormInput
                        label="Location"
                        placeholder="City, State/Country"
                        error={!!experienceErrors?.location?.message}
                        helperText={experienceErrors?.location?.message || ''}
                        required
                        disabled={isLoading}
                        {...register(`experiences.${index}.location`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FormCheckbox
                          label="I currently work here"
                          {...register(`experiences.${index}.current`)}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <FormDate
                        label="Start Date"
                        error={!!experienceErrors?.startDate?.message}
                        helperText={experienceErrors?.startDate?.message || ''}
                        required
                        disabled={isLoading}
                        {...register(`experiences.${index}.startDate`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <FormDate
                        label="End Date"
                        error={!!experienceErrors?.endDate?.message}
                        helperText={experienceErrors?.endDate?.message || ''}
                        required={!isCurrent}
                        disabled={isLoading || isCurrent}
                        {...register(`experiences.${index}.endDate`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }} component="div">
                      <FormTextarea
                        label="Job Description"
                        placeholder="Describe your responsibilities, achievements, and key contributions..."
                        error={!!experienceErrors?.description?.message}
                        rows={4}
                        required
                        disabled={isLoading}
                        {...register(`experiences.${index}.description`)}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Slide>
            );
          })}

          <Fade in timeout={1000}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addExperience}
                disabled={isLoading}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  borderColor: '#ec4899',
                  color: '#ec4899',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#db2777',
                    backgroundColor: '#fdf2f8',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Add Another Experience
              </Button>
            </Box>
          </Fade>
        </Box>
      )}

      <Grow in timeout={1200}>
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
              background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
              boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #db2777 0%, #9d174d 100%)',
                boxShadow: '0 6px 20px rgba(236, 72, 153, 0.6)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            {isLoading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </Box>
      </Grow>
    </Box>
  );
};

export default ExperienceForm;
