import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
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
  '& .MuiSelect-select': {
    color: '#1f2937',
    fontSize: '0.95rem',
    padding: '16px 20px',
    '&.Mui-disabled': {
      color: '#9ca3af',
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
  '& .MuiSvgIcon-root': {
    color: '#6366f1',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: '0.95rem',
  padding: '12px 20px',
  '&:hover': {
    backgroundColor: '#f1f5f9',
  },
  '&.Mui-selected': {
    backgroundColor: '#6366f115',
    color: '#6366f1',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: '#6366f120',
    },
  },
}));

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps extends Omit<SelectProps, 'variant' | 'error'> {
  label: string;
  options: Option[];
  error?: string;
  placeholder?: string;
  required?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  error,
  placeholder,
  required = false,
  disabled = false,
  ...props
}) => {
  return (
    <StyledFormControl fullWidth error={!!error} required={required}>
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-label`}
        id={label}
        label={label}
        disabled={disabled}
        displayEmpty
        {...props}
      >
        {placeholder && (
          <StyledMenuItem value="" disabled>
            {placeholder}
          </StyledMenuItem>
        )}
        {options.map((option) => (
          <StyledMenuItem key={option.value} value={option.value}>
            {option.label}
          </StyledMenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </StyledFormControl>
  );
};

export default FormSelect;
