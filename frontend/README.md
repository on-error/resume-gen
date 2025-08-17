# Resume Generator Frontend

A React-based frontend application for creating and managing professional resumes. Built with Vite, TypeScript, and Material UI.

## Features

- **User Authentication**: Sign up and login functionality
- **Personal Information Form**: Comprehensive form for personal details, contact information, and professional summary
- **Modular Form Components**: Reusable form components for inputs, textareas, selects, dates, and checkboxes
- **Form Validation**: Client-side validation using Yup and React Hook Form
- **Responsive Design**: Mobile-friendly interface using Material UI
- **Protected Routes**: Authentication-based routing
- **API Integration**: Ready to connect with the backend API

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form management
- **Yup** - Form validation
- **Axios** - HTTP client
- **Material UI** - UI component library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── forms/
│   │   └── PersonalInfoForm.tsx
│   ├── FormInput.tsx
│   ├── FormTextarea.tsx
│   ├── FormSelect.tsx
│   ├── FormDate.tsx
│   └── FormCheckbox.tsx
├── pages/
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   └── DashboardPage.tsx
├── services/
│   └── api.ts
├── App.tsx
└── main.tsx
```

## Form Components

### FormInput
Reusable input component built with Material UI TextField.

### FormTextarea
Multi-line text input component built with Material UI TextField.

### FormSelect
Dropdown selection component built with Material UI Select.

### FormDate
Date picker component built with Material UI TextField.

### FormCheckbox
Boolean input component built with Material UI Checkbox.

## Material UI Components Used

- **TextField** - Text inputs and textareas
- **Select** - Dropdown selections
- **Button** - Action buttons
- **Card** - Content containers
- **Grid** - Layout system
- **Typography** - Text styling
- **Paper** - Elevated surfaces
- **Container** - Content width constraints
- **AppBar** - Top navigation
- **Alert** - Status messages
- **Divider** - Visual separators

## API Integration

The application is configured to connect with the backend API. Update the `API_BASE_URL` in `src/services/api.ts` to match your backend server URL.

## Authentication Flow

1. Users can sign up with email, password, first name, and last name
2. Users can log in with email and password
3. Authentication tokens are stored in localStorage
4. Protected routes require authentication
5. Automatic redirect to login page for unauthenticated users

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
