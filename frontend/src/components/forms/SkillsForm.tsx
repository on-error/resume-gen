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
  Code as CodeIcon,
  Save as SaveIcon,
  Star as StarIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import FormInput from '../FormInput';
import FormSelect from '../FormSelect';

type SkillData = {
  skills: Array<{
    name: string;
    category: string;
    proficiency: string;
  }>;
};

interface SkillsFormProps {
  onSubmit: (data: SkillData) => void;
  isLoading?: boolean;
  initialData?: Partial<SkillData>;
  error?: string;
}

const schema = yup.object().shape({
  skills: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Skill name is required'),
      category: yup.string().required('Category is required'),
      proficiency: yup.string().required('Proficiency level is required'),
    })
  ),
});

const skillCategories = [
  { value: 'technical', label: 'Technical Skills' },
  { value: 'soft', label: 'Soft Skills' },
  { value: 'languages', label: 'Programming Languages' },
  { value: 'frameworks', label: 'Frameworks & Libraries' },
  { value: 'tools', label: 'Tools & Technologies' },
  { value: 'databases', label: 'Databases' },
  { value: 'cloud', label: 'Cloud & DevOps' },
  { value: 'design', label: 'Design & Creative' },
];

const proficiencyLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const SkillsForm: React.FC<SkillsFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData = { skills: [] },
  error,
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillData>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  const addSkill = () => {
    append({
      name: '',
      category: '',
      proficiency: '',
    });
  };

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#ef4444';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#10b981';
      case 'expert': return '#6366f1';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <CodeIcon />;
      case 'soft': return <PsychologyIcon />;
      case 'languages': return <CodeIcon />;
      case 'frameworks': return <CodeIcon />;
      case 'tools': return <CodeIcon />;
      case 'databases': return <CodeIcon />;
      case 'cloud': return <CodeIcon />;
      case 'design': return <CodeIcon />;
      default: return <CodeIcon />;
    }
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
                backgroundColor: '#3b82f615',
                color: '#3b82f6',
                mr: 2,
              }}
            >
              <CodeIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
              Skills & Expertise
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Showcase your technical and soft skills with proficiency levels to highlight your expertise.
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
                borderColor: '#3b82f6',
                backgroundColor: '#eff6ff',
              },
            }}
          >
            <CodeIcon sx={{ fontSize: 48, color: '#3b82f6', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: '#374151' }}>
              No skills added yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start building your skills profile by adding your technical and soft skills.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addSkill}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  boxShadow: '0 6px 20px rgba(59, 130, 246, 0.6)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Add First Skill
            </Button>
          </Paper>
        </Fade>
      ) : (
        <Box>
          {fields.map((field, index) => {
            const skillErrors = errors.skills?.[index];
            const watchedSkill = field;

            return (
              <Slide direction="up" in timeout={600 + index * 200} key={field.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)',
                      borderColor: '#3b82f6',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CodeIcon sx={{ color: '#3b82f6', mr: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                        Skill #{index + 1}
                      </Typography>
                    </Box>
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

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <FormInput
                        label="Skill Name"
                        placeholder="e.g., React, Leadership, Python"
                        error={skillErrors?.name?.message}
                        required
                        disabled={isLoading}
                        {...register(`skills.${index}.name`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <FormSelect
                        label="Category"
                        options={skillCategories}
                        error={skillErrors?.category?.message}
                        required
                        disabled={isLoading}
                        placeholder="Select skill category"
                        {...register(`skills.${index}.category`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <FormSelect
                        label="Proficiency Level"
                        options={proficiencyLevels}
                        error={skillErrors?.proficiency?.message}
                        required
                        disabled={isLoading}
                        placeholder="Select proficiency level"
                        {...register(`skills.${index}.proficiency`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} component="div">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Proficiency:
                        </Typography>
                        {watchedSkill.proficiency && (
                          <Chip
                            label={proficiencyLevels.find(p => p.value === watchedSkill.proficiency)?.label}
                            size="small"
                            sx={{
                              backgroundColor: `${getProficiencyColor(watchedSkill.proficiency)}15`,
                              color: getProficiencyColor(watchedSkill.proficiency),
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
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
                onClick={addSkill}
                disabled={isLoading}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#2563eb',
                    backgroundColor: '#eff6ff',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Add Another Skill
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
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.6)',
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

export default SkillsForm;
