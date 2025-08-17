export type Experience = {
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  responsibilities: string[];
};

export type Education = {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  gpa: number;
};

export type Skill = {
  name: string;
  proficiency: string;
};

export type Project = {
  title: string;
  description: string;
  technologies: string;
  role: string;
};

export type Certification = {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
};

export type Language = {
  name: string;
  proficiency: string;
};
