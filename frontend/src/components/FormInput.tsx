import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: '#e2e8f0',
      borderWidth: 2,
      transition: 'all 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: '#6366f1',
      borderWidth: 2,
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6366f1',
      borderWidth: 2,
    },
    '&.Mui-focused': {
      backgroundColor: '#f8fafc',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#64748b',
    fontWeight: 500,
    '&.Mui-focused': {
      color: '#6366f1',
      fontWeight: 600,
    },
  },
  '& .MuiInputBase-input': {
    color: '#1f2937',
    fontSize: '0.95rem',
    padding: '16px 20px',
    '&::placeholder': {
      color: '#9ca3af',
      opacity: 1,
    },
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 4,
    fontSize: '0.875rem',
    '&.Mui-error': {
      color: '#ef4444',
      fontWeight: 500,
    },
  },
}));

interface FormInputProps extends Omit<TextFieldProps, 'variant'> {
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ required, ...props }) => {
  return (
    <StyledTextField
      variant="outlined"
      fullWidth
      required={required}
      {...props}
    />
  );
};

export default FormInput;
