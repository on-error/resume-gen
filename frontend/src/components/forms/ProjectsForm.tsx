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
  Folder as FolderIcon,
  Save as SaveIcon,
  Link as LinkIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import FormInput from '../FormInput';
import FormTextarea from '../FormTextarea';
import FormDate from '../FormDate';

type ProjectData = {
  projects: Array<{
    title: string;
    description: string;
    technologies: string;
    startDate?: string;
    endDate?: string;
    current: boolean;
    githubUrl: string;
    liveUrl: string;
    imageUrl: string;
  }>;
};

interface ProjectsFormProps {
  onSubmit: (data: ProjectData) => void;
  isLoading?: boolean;
  initialData?: Partial<ProjectData>;
  error?: string;
}

const schema = yup.object().shape({
  projects: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Project title is required'),
      description: yup.string().required('Project description is required'),
      technologies: yup.string().required('Technologies used is required'),
      startDate: yup.string().optional(),
      endDate: yup.string().optional(),
      current: yup.boolean(),
      githubUrl: yup.string().url('Please enter a valid GitHub URL').optional(),
      liveUrl: yup.string().url('Please enter a valid live URL').optional(),
      imageUrl: yup.string().url('Please enter a valid image URL').optional(),
    })
  ),
});

const ProjectsForm: React.FC<ProjectsFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData = { projects: [] },
  error,
}) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProjectData>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects',
  });

  const watchedProjects = watch('projects');

  const addProject = () => {
    append({
      title: '',
      description: '',
      technologies: '',
      startDate: '',
      endDate: '',
      current: false,
      githubUrl: '',
      liveUrl: '',
      imageUrl: '',
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
                backgroundColor: '#f59e0b15',
                color: '#f59e0b',
                mr: 2,
              }}
            >
              <FolderIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
              Projects & Portfolio
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Showcase your projects, achievements, and technical capabilities with detailed descriptions and links.
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
                borderColor: '#f59e0b',
                backgroundColor: '#fffbeb',
              },
            }}
          >
            <FolderIcon sx={{ fontSize: 48, color: '#f59e0b', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: '#374151' }}>
              No projects added yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start building your portfolio by adding your projects and achievements.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addProject}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #ea580c 0%, #b45309 100%)',
                  boxShadow: '0 6px 20px rgba(245, 158, 11, 0.6)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Add First Project
            </Button>
          </Paper>
        </Fade>
      ) : (
        <Box>
          {fields.map((field, index) => {
            const isCurrent = watchedProjects?.[index]?.current;
            const projectErrors = errors.projects?.[index];

            return (
              <Slide direction="up" in timeout={600 + index * 200} key={field.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fed7aa',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 20px rgba(245, 158, 11, 0.1)',
                      borderColor: '#f59e0b',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FolderIcon sx={{ color: '#f59e0b', mr: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                        Project #{index + 1}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {isCurrent && (
                        <Chip
                          label="In Progress"
                          size="small"
                          sx={{
                            backgroundColor: '#f59e0b15',
                            color: '#f59e0b',
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
                        label="Project Title"
                        placeholder="Enter project name"
                        error={!!projectErrors?.title?.message}
                        helperText={projectErrors?.title?.message || ''}
                        required
                        disabled={isLoading}
                        {...register(`projects.${index}.title`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <FormInput
                        label="Technologies Used"
                        placeholder="e.g., React, Node.js, MongoDB"
                        error={!!projectErrors?.technologies?.message}
                        helperText={projectErrors?.technologies?.message || ''}
                        required
                        disabled={isLoading}
                        {...register(`projects.${index}.technologies`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <FormDate
                        label="Start Date"
                        error={!!projectErrors?.startDate?.message}
                        helperText={projectErrors?.startDate?.message || ''}
                        disabled={isLoading}
                        {...register(`projects.${index}.startDate`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <FormDate
                        label="End Date"
                        error={!!projectErrors?.endDate?.message}
                        helperText={projectErrors?.endDate?.message || ''}
                        disabled={isLoading || isCurrent}
                        {...register(`projects.${index}.endDate`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                        <FormInput
                          label="GitHub Repository"
                          type="url"
                          placeholder="https://github.com/username/project"
                          error={!!projectErrors?.githubUrl?.message}
                          helperText={projectErrors?.githubUrl?.message || ''}
                          disabled={isLoading}
                          {...register(`projects.${index}.githubUrl`)}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <FormInput
                        label="Live Demo URL"
                        type="url"
                        placeholder="https://your-project.com"
                        error={!!projectErrors?.liveUrl?.message}
                        helperText={projectErrors?.liveUrl?.message || ''}
                        disabled={isLoading}
                        {...register(`projects.${index}.liveUrl`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }} component="div">
                      <FormInput
                        label="Project Image URL"
                        type="url"
                        placeholder="https://example.com/project-image.jpg"
                        error={!!projectErrors?.imageUrl?.message}
                        helperText={projectErrors?.imageUrl?.message || ''}
                        disabled={isLoading}
                        {...register(`projects.${index}.imageUrl`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }} component="div">
                      <FormTextarea
                        label="Project Description"
                        placeholder="Describe your project, its features, challenges overcome, and your role..."
                        error={!!projectErrors?.description?.message}
                        helperText={projectErrors?.description?.message || ''}
                        rows={4}
                        required
                        disabled={isLoading}
                        {...register(`projects.${index}.description`)}
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
                onClick={addProject}
                disabled={isLoading}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  borderColor: '#f59e0b',
                  color: '#f59e0b',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#d97706',
                    backgroundColor: '#fffbeb',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Add Another Project
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
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #ea580c 0%, #b45309 100%)',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.6)',
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

export default ProjectsForm;
