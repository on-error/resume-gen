import { optimizedResumeGen } from "./optimizedResumeGen";

export const resumeGen = async (userId: string, jobDescription: string) => {
  try {
    const resume = await optimizedResumeGen(userId, jobDescription);
    console.log('Resume generated successfully');
    return resume;
  } catch (error) {
    console.error('Error generating resume:', error);
    throw error;
  }
};

// Keep the getUserDetails function for backward compatibility
export const getUserDetails = async (userId: string) => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      personalInfo: true,
      experiences: true,
      education: true,
      skills: true,
      projects: true,
      certifications: true,
      languages: true,
    },
  });

  return JSON.stringify(user);
};

export const getResumeTemplate = async (templateName?: string) => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  const templates = await prisma.resumeTemplate.findMany();

  if(templates.length === 0) {
    throw new Error('No resume templates found');
  }

  const resumeTemplate = templates[0];

  const imageData = await fetchAsBase64(resumeTemplate.imageUrl || '');

  return {
    ...resumeTemplate,
    imageData,
  };
}

const fetchAsBase64 = async (url: string) => {
  try {
    // Extract file ID from Google Drive URL
    // https://drive.google.com/file/d/FILE_ID/view?usp=sharing - gdrive url
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)\//);
    const fileId = match ? match[1] : null;
    console.log('fileid', fileId);
    // You can now use fileId as needed
    const imageUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString('base64');
  } catch (error) {
    console.log('error', error);
    return null;
  }
}
