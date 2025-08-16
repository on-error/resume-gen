type Experience = {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  responsibilities: string[];
};

type Education = {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
};

type Skill = {
  name: string;
  proficiency: string;
};

type Project = {
  title: string;
  description: string;
  technologies: string[];
  role: string;
};

type Certification = {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
};

type Language = {
  name: string;
  proficiency: string;
};
