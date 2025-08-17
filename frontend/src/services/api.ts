import axios from 'axios';
import { ResumeTemplateData } from '../components/forms/ResumeTemplateForm';

const API_BASE_URL = 'http://localhost:3003/api'; // Adjust this to match your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    const response = await api.post('/user', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/login', data);
    return response.data;
  },
};

// Personal Info API
export const personalInfoAPI = {
  update: async (data: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    website?: string;
    summary?: string;
    objective?: string;
    dateOfBirth?: string;
    nationality?: string;
  }) => {
    const response = await api.post('/personal-info', data);
    return response.data;
  },
};

// Experience API
export const experienceAPI = {
  create: async (data: { userId: string; experiences: any[] }) => {
    const response = await api.post('/experience', data);
    return response.data;
  },
};

// Education API
export const educationAPI = {
  create: async (data: { userId: string; education: any[] }) => {
    const response = await api.post('/education', data);
    return response.data;
  },
};

// Skills API
export const skillsAPI = {
  create: async (data: { userId: string; skills: any[] }) => {
    const response = await api.post('/skills', data);
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  create: async (data: { userId: string; projects: any[] }) => {
    const response = await api.post('/projects', data);
    return response.data;
  },
};

// Certifications API
export const certificationsAPI = {
  create: async (data: { userId: string; certifications: any[] }) => {
    const response = await api.post('/certifications', data);
    return response.data;
  },
};

// Languages API
export const languagesAPI = {
  create: async (data: { userId: string; languages: any[] }) => {
    const response = await api.post('/languages', data);
    return response.data;
  },
};

// Resume API
export const resumeAPI = {
  generate: async (data: { userId: string; jobDescription: string }) => {
    const response = await api.post('/generate-resume', data);
    return response.data;
  },
};

export const resumeTemplateAPI = {
  create: async (data: ResumeTemplateData) => {
    const response = await api.post('/resume-templates', data);
    return response.data;
  },
};

export default api;
