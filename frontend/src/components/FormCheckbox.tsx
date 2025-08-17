import React from 'react';
import { FormControlLabel, Checkbox, CheckboxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  color: '#d1d5db',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#6366f110',
    color: '#6366f1',
  },
  '&.Mui-checked': {
    color: '#6366f1',
    '&:hover': {
      backgroundColor: '#6366f115',
    },
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  margin: 0,
  '& .MuiFormControlLabel-label': {
    fontSize: '0.95rem',
    color: '#374151',
    fontWeight: 500,
  },
  '&:hover': {
    '& .MuiFormControlLabel-label': {
      color: '#6366f1',
    },
  },
}));

interface FormCheckboxProps extends Omit<CheckboxProps, 'variant'> {
  label: string;
  required?: boolean;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({ 
  label, 
  required = false, 
  ...props 
}) => {
  return (
    <StyledFormControlLabel
      control={<StyledCheckbox {...props} />}
      label={label}
    />
  );
};

export default FormCheckbox;
