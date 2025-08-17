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
  School as SchoolIcon,
  Save as SaveIcon,
  Grade as GradeIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import FormInput from '../FormInput';
import FormTextarea from '../FormTextarea';
import FormSelect from '../FormSelect';
import FormDate from '../FormDate';

type EducationData = {
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa: string;
    description: string;
  }>;
};

interface EducationFormProps {
  onSubmit: (data: EducationData) => void;
  isLoading?: boolean;
  initialData?: Partial<EducationData>;
  error?: string;
}

const schema = yup.object().shape({
  education: yup.array().of(
    yup.object().shape({
      institution: yup.string().required('Institution name is required'),
      degree: yup.string().required('Degree is required'),
      fieldOfStudy: yup.string().required('Field of study is required'),
      location: yup.string().required('Location is required'),
      startDate: yup.string().required('Start date is required'),
      endDate: yup.string().when('current', {
        is: (current: boolean) => current === true,
        then: () => yup.string().optional(),
        otherwise: () => yup.string().required('End date is required'),
      }),
      current: yup.boolean(),
      gpa: yup.string().optional(),
      description: yup.string().optional(),
    })
  ),
});

const degreeTypes = [
  { value: 'high-school', label: 'High School Diploma' },
  { value: 'associate', label: 'Associate Degree' },
  { value: 'bachelor', label: 'Bachelor\'s Degree' },
  { value: 'master', label: 'Master\'s Degree' },
  { value: 'phd', label: 'Ph.D.' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'other', label: 'Other' },
];

const EducationForm: React.FC<EducationFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData = { education: [] },
  error,
}) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EducationData>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  const watchedEducation = watch('education');

  const addEducation = () => {
    append({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
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
                backgroundColor: '#10b98115',
                color: '#10b981',
                mr: 2,
              }}
            >
              <SchoolIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
              Education & Qualifications
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add your educational background, degrees, and academic achievements to showcase your qualifications.
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
                borderColor: '#10b981',
                backgroundColor: '#f0fdf4',
              },
            }}
          >
            <SchoolIcon sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: '#374151' }}>
              No education added yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start building your educational profile by adding your degrees and qualifications.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addEducation}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.6)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Add First Education
            </Button>
          </Paper>
        </Fade>
      ) : (
        <Box>
          {fields.map((field, index) => {
            const isCurrent = watchedEducation?.[index]?.current;
            const educationErrors = errors.education?.[index];

            return (
              <Slide direction="up" in timeout={600 + index * 200} key={field.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)',
                      borderColor: '#10b981',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SchoolIcon sx={{ color: '#10b981', mr: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                        Education #{index + 1}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {isCurrent && (
                        <Chip
                          label="Current"
                          size="small"
                          sx={{
                            backgroundColor: '#10b98115',
                            color: '#10b981',
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
                        label="Institution"
                        placeholder="Enter institution name"
                        error={!!educationErrors?.institution?.message}
                        helperText={educationErrors?.institution?.message || ''}
                        required
                        disabled={isLoading}
                        {...register(`education.${index}.institution`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <FormSelect
                        label="Degree Type"
                        options={degreeTypes}
                        error={!!educationErrors?.degree?.message}
                        helperText={educationErrors?.degree?.message || ''}
                        required
                        disabled={isLoading}
                        placeholder="Select degree type"
                        {...register(`education.${index}.degree`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <FormInput
                        label="Field of Study"
                        placeholder="e.g., Computer Science, Business Administration"
                        error={!!educationErrors?.fieldOfStudy?.message}
                        helperText={educationErrors?.fieldOfStudy?.message || ''}
                        required
                        disabled={isLoading}
                        {...register(`education.${index}.fieldOfStudy`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <FormInput
                        label="Location"
                        placeholder="City, State/Country"
                        error={!!educationErrors?.location?.message}
                        helperText={educationErrors?.location?.message || ''}
                        required
                        disabled={isLoading}
                        {...register(`education.${index}.location`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <FormDate
                        label="Start Date"
                        error={!!educationErrors?.startDate?.message}
                        helperText={educationErrors?.startDate?.message || ''}
                        required
                        disabled={isLoading}
                        {...register(`education.${index}.startDate`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <FormDate
                        label="End Date"
                        error={!!educationErrors?.endDate?.message}
                        helperText={educationErrors?.endDate?.message || ''}
                        required={!isCurrent}
                        disabled={isLoading || isCurrent}
                        {...register(`education.${index}.endDate`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <FormInput
                        label="GPA (Optional)"
                        placeholder="e.g., 3.8/4.0"
                        error={!!educationErrors?.gpa?.message}
                        helperText={educationErrors?.gpa?.message || ''}
                        disabled={isLoading}
                        {...register(`education.${index}.gpa`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                        <FormInput
                          label="Currently Studying"
                          type="checkbox"
                          {...register(`education.${index}.current`)}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12 }} component="div">
                      <FormTextarea
                        label="Additional Information"
                        placeholder="Describe your academic achievements, honors, relevant coursework, or thesis..."
                        error={!!educationErrors?.description?.message}
                        helperText={educationErrors?.description?.message || ''}
                        rows={3}
                        disabled={isLoading}
                        {...register(`education.${index}.description`)}
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
                onClick={addEducation}
                disabled={isLoading}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  borderColor: '#10b981',
                  color: '#10b981',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#059669',
                    backgroundColor: '#f0fdf4',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Add Another Education
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
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.6)',
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

export default EducationForm;
