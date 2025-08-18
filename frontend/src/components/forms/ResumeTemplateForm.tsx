import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Alert,
  Fade,
  Slide,
  Grow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  Code as CodeIcon,
  Image as ImageIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import FormInput from '../FormInput';
import FormTextarea from '../FormTextarea';
import FormSelect from '../FormSelect';

export type ResumeTemplateData = {
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  latexCode: string;
  isActive: boolean;
  tags: string[];
};

interface ResumeTemplateFormProps {
  onSubmit: (data: ResumeTemplateData) => void;
  isLoading?: boolean;
  initialData?: Partial<ResumeTemplateData>;
  error?: string;
}

const schema = yup.object().shape({
  name: yup.string().required('Template name is required'),
  description: yup.string().required('Description is required'),
  category: yup.string().required('Category is required'),
  imageUrl: yup.string().url('Please enter a valid image URL').required('Image URL is required'),
  latexCode: yup.string().required('LaTeX code is required'),
  isActive: yup.boolean(),
  tags: yup.array().of(yup.string()),
});

const templateCategories = [
  { value: 'modern', label: 'Modern' },
  { value: 'classic', label: 'Classic' },
  { value: 'creative', label: 'Creative' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'professional', label: 'Professional' },
  { value: 'academic', label: 'Academic' },
  { value: 'executive', label: 'Executive' },
  { value: 'startup', label: 'Startup' },
];

const ResumeTemplateForm: React.FC<ResumeTemplateFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData = {},
  error,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState<string[]>(initialData.tags || []);

  console.log(initialData);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ResumeTemplateData>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...initialData,
      tags: initialData.tags || [],
      isActive: initialData.isActive ?? true,
    },
  });

  const watchedImageUrl = watch('imageUrl');
  const watchedLatexCode = watch('latexCode');

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      const newTags = [...tags, currentTag.trim()];
      setTags(newTags);
      setValue('tags', newTags);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setValue('tags', newTags);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
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
                backgroundColor: '#8b5cf615',
                color: '#8b5cf6',
                mr: 2,
              }}
            >
              <CodeIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
              Resume Template
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Create a new resume template with preview image and LaTeX code for professional resume generation.
          </Typography>
        </Box>
      </Fade>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid size={{xs:12, md:8}} component="div">
          <Fade in timeout={800}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: '#faf5ff',
                border: '1px solid #e9d5ff',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)',
                  borderColor: '#8b5cf6',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <EditIcon sx={{ color: '#8b5cf6', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                  Template Information
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }} component="div">
                  <Slide direction="up" in timeout={900}>
                    <FormInput
                      label="Template Name"
                      placeholder="e.g., Modern Professional"
                      error={!!errors.name?.message}
                      required
                      disabled={isLoading}
                      {...register('name')}
                    />
                  </Slide>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }} component="div">
                  <Slide direction="up" in timeout={1000}>
                    <FormSelect
                      label="Category"
                      options={templateCategories}
                      error={errors.category?.message}
                      required
                      disabled={isLoading}
                      placeholder="Select template category"
                      {...register('category')}
                    />
                  </Slide>
                </Grid>

                <Grid size={{ xs: 12 }} component="div">
                  <Slide direction="up" in timeout={1100}>
                    <FormTextarea
                      label="Description"
                      placeholder="Describe the template style, features, and target audience..."
                      error={!!errors.description?.message}
                      rows={3}
                      required
                      disabled={isLoading}
                      {...register('description')}
                    />
                  </Slide>
                </Grid>

                <Grid size={{ xs: 12 }} component="div">
                  <Slide direction="up" in timeout={1200}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#374151' }}>
                        Tags
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            onDelete={() => removeTag(tag)}
                            sx={{
                              backgroundColor: '#8b5cf615',
                              color: '#8b5cf6',
                              '& .MuiChip-deleteIcon': {
                                color: '#8b5cf6',
                                '&:hover': {
                                  color: '#7c3aed',
                                },
                              },
                            }}
                          />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          size="small"
                          placeholder="Add a tag..."
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyPress={handleKeyPress}
                          sx={{ flexGrow: 1 }}
                        />
                        <Button
                          variant="outlined"
                          onClick={addTag}
                          disabled={!currentTag.trim()}
                          sx={{
                            borderColor: '#8b5cf6',
                            color: '#8b5cf6',
                            '&:hover': {
                              borderColor: '#7c3aed',
                              backgroundColor: '#faf5ff',
                            },
                          }}
                        >
                          Add
                        </Button>
                      </Box>
                    </Box>
                  </Slide>
                </Grid>
              </Grid>
            </Paper>
          </Fade>

          {/* Image URL Section */}
          <Fade in timeout={1300}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mt: 3,
                borderRadius: 3,
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)',
                  borderColor: '#3b82f6',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ImageIcon sx={{ color: '#3b82f6', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                  Template Preview Image
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 8 }} component="div">
                  <Slide direction="up" in timeout={1400}>
                    <FormInput
                      label="Image URL"
                      placeholder="https://example.com/template-preview.jpg"
                      error={!!errors.imageUrl?.message}
                      required
                      disabled={isLoading}
                      {...register('imageUrl')}
                    />
                  </Slide>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }} component="div">
                  <Slide direction="up" in timeout={1500}>
                    <Button
                      variant="outlined"
                      startIcon={<PreviewIcon />}
                      onClick={() => setPreviewOpen(true)}
                      disabled={!watchedImageUrl}
                      fullWidth
                      sx={{
                        mt: 2,
                        borderColor: '#3b82f6',
                        color: '#3b82f6',
                        '&:hover': {
                          borderColor: '#2563eb',
                          backgroundColor: '#f0f9ff',
                        },
                      }}
                    >
                      Preview Image
                    </Button>
                  </Slide>
                </Grid>
              </Grid>
            </Paper>
          </Fade>

          {/* LaTeX Code Section */}
          <Fade in timeout={1600}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mt: 3,
                borderRadius: 3,
                backgroundColor: '#fef3c7',
                                 border: '1px solid #fbbf24',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(245, 158, 11, 0.1)',
                  borderColor: '#f59e0b',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CodeIcon sx={{ color: '#f59e0b', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                  LaTeX Template Code
                </Typography>
              </Box>

              <Slide direction="up" in timeout={1700}>
                <FormTextarea
                  label="LaTeX Code"
                  placeholder="Enter the LaTeX template code here..."
                  error={!!errors.latexCode?.message}
                  rows={12}
                  required
                  disabled={isLoading}
                  {...register('latexCode')}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                    },
                  }}
                />
              </Slide>

              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  disabled={!watchedLatexCode}
                  sx={{
                    borderColor: '#f59e0b',
                    color: '#f59e0b',
                    '&:hover': {
                      borderColor: '#d97706',
                      backgroundColor: '#fef3c7',
                    },
                  }}
                >
                  Preview LaTeX
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CodeIcon />}
                  sx={{
                    borderColor: '#6b7280',
                    color: '#6b7280',
                    '&:hover': {
                      borderColor: '#4b5563',
                      backgroundColor: '#f9fafb',
                    },
                  }}
                >
                  Validate Code
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Grid>

        {/* Preview Sidebar */}
        <Grid size={{xs:12, md:4}} component="div">
          <Fade in timeout={1800}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                position: 'sticky',
                top: 24,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1f2937' }}>
                Template Preview
              </Typography>

              {watchedImageUrl ? (
                <Box sx={{ mb: 3 }}>
                  <img
                    src={watchedImageUrl}
                    alt="Template Preview"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f1f5f9',
                    borderRadius: 2,
                    border: '2px dashed #cbd5e1',
                    mb: 3,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No preview image
                  </Typography>
                </Box>
              )}

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Template Details
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Category:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {templateCategories.find(cat => cat.value === watch('category'))?.label || 'Not selected'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Tags:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {tags.length} tag{tags.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Status:
                    </Typography>
                    <Chip
                      label={watch('isActive') ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        backgroundColor: watch('isActive') ? '#10b98115' : '#ef444415',
                        color: watch('isActive') ? '#10b981' : '#ef4444',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Template Status</InputLabel>
                <Select
                  value={watch('isActive') ? 'active' : 'inactive'}
                  onChange={(e) => setValue('isActive', e.target.value === 'active')}
                  label="Template Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
                <FormHelperText>Active templates are available for users</FormHelperText>
              </FormControl>
            </Paper>
          </Fade>
        </Grid>
      </Grid>

      <Grow in timeout={2000}>
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
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                boxShadow: '0 6px 20px rgba(139, 92, 246, 0.6)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            {isLoading ? 'Saving...' : 'Save Template'}
          </Button>
        </Box>
      </Grow>

      {/* Image Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ImageIcon sx={{ mr: 1, color: '#3b82f6' }} />
            Template Preview
          </Box>
        </DialogTitle>
        <DialogContent>
          {watchedImageUrl && (
            <img
              src={watchedImageUrl}
              alt="Template Preview"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: 8,
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResumeTemplateForm;
