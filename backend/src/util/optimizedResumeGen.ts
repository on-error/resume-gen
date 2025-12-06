import prisma from "../config/database";
import { getResponseFromGemini } from "./gemini";
import { ATSOptimizationService } from "./atsOptimization";
import { ContentGenerationPipeline } from "./contentPipeline";
import { IndustryRulesService } from "./industryRules";

// Helper function to clean markdown from responses
const cleanResponse = (response: string): string => {
  if (!response) return '';
  
  // Remove markdown code blocks
  let cleaned = response.replace(/```(?:json|html|javascript|typescript|text)?\s*\n?/gi, '');
  cleaned = cleaned.replace(/```\s*$/gi, '');
  
  // Remove any remaining markdown syntax
  cleaned = cleaned.replace(/^\s*`\s*/gi, '').replace(/\s*`\s*$/gi, '');
  
  // Trim whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
};

export const optimizedResumeGen = async (userId: string, jobDescription: string) => {
  // Initialize services
  const atsService = new ATSOptimizationService();
  const contentPipeline = new ContentGenerationPipeline();
  const industryService = new IndustryRulesService();

  // Get user details and template in parallel
  const [userDetails, resumeTemplate] = await Promise.all([
    getUserDetails(userId),
    getResumeTemplate()
  ]);

  // Step 1: Extract job information and analyze (1 LLM call)
  const jobAnalysis = await analyzeJobAndExtractInfo(jobDescription || '');
  
  // Step 2: Generate optimized content with ATS and industry optimization (1 LLM call)
  const optimizedContent = await generateOptimizedContent(
    userDetails, 
    resumeTemplate, 
    jobDescription, 
    jobAnalysis,
    atsService,
    industryService
  );

  // Step 3: Final ATS validation and polish (1 LLM call)
  const finalResume = await finalizeAndValidateATS(optimizedContent, jobDescription, atsService);

  return finalResume;
};

const getUserDetails = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const getResumeTemplate = async () => {
  const templates = await prisma.resumeTemplate.findMany();
  
  if (templates.length === 0) {
    throw new Error('No resume templates found in database');
  }

  return templates[0];
};

const analyzeJobAndExtractInfo = async (jobDescription: string) => {
  const prompt = `
    Analyze this job description comprehensively and extract key information for resume optimization and content filtering:
    
    Job Description: ${jobDescription}
    
    Return a JSON object with:
    {
      "jobTitle": "extracted job title",
      "industry": "technology|marketing|finance|healthcare|general",
      "requiredSkills": ["skill1", "skill2", "skill3"],
      "softSkills": ["skill1", "skill2"],
      "experienceLevel": "entry|mid|senior|executive",
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "quantifiableRequirements": ["requirement1", "requirement2"],
      "atsKeywords": ["ats_keyword1", "ats_keyword2"],
      "standardJobTitle": "standardized job title for ATS",
      "relevantTechnologies": ["tech1", "tech2", "tech3"],
      "experienceKeywords": ["keyword1", "keyword2", "keyword3"],
      "projectKeywords": ["keyword1", "keyword2", "keyword3"],
      "certificationKeywords": ["keyword1", "keyword2", "keyword3"]
    }
    
    Focus on:
    1. Standard job titles that ATS systems recognize
    2. Technical and soft skills mentioned
    3. Industry-specific keywords
    4. Experience level indicators
    5. Quantifiable requirements
    6. Technologies and tools for filtering relevant experience
    7. Keywords to identify relevant projects and certifications
    8. Experience-related terms for filtering work history
    
    IMPORTANT: Return ONLY the JSON object. Do NOT include any markdown formatting like \`\`\`json or \`\`\` or any other markdown syntax. Return pure JSON only.
  `;

  const response = await getResponseFromGemini(prompt);
  const cleanedResponse = cleanResponse(response || '');
  
  try {
    return JSON.parse(cleanedResponse || '{}');
  } catch (error) {
    console.error('Failed to parse job analysis:', error);
    console.error('Raw response:', response);
    console.error('Cleaned response:', cleanedResponse);
    return {
      jobTitle: '',
      industry: 'general',
      requiredSkills: [],
      softSkills: [],
      experienceLevel: 'mid',
      keywords: [],
      quantifiableRequirements: [],
      atsKeywords: [],
      standardJobTitle: '',
      relevantTechnologies: [],
      experienceKeywords: [],
      projectKeywords: [],
      certificationKeywords: []
    };
  }
};

const generateOptimizedContent = async (
  userDetails: any, 
  template: any, 
  jobDescription: string, 
  jobAnalysis: any,
  atsService: ATSOptimizationService,
  industryService: IndustryRulesService
) => {
  const prompt = `
    You are an expert resume generator with deep knowledge of ATS optimization and industry-specific requirements.
    Create a targeted, ATS-friendly resume using the provided HTML template and user data.

    USER DATA:
    ${JSON.stringify(userDetails, null, 2)}

    HTML TEMPLATE:
    ${template.content}

    JOB DESCRIPTION:
    ${jobDescription}

    JOB ANALYSIS:
    ${JSON.stringify(jobAnalysis, null, 2)}

    ATS OPTIMIZATION REQUIREMENTS:
    - Use standard job titles: ${jobAnalysis.standardJobTitle || jobAnalysis.jobTitle}
    - Include required skills: ${jobAnalysis.requiredSkills.join(', ')}
    - Use action verbs: developed, implemented, led, managed, created, optimized, increased, improved
    - Maintain 2-3% keyword density for: ${jobAnalysis.atsKeywords.join(', ')}
    - Quantify achievements with numbers, percentages, and metrics
    - Use clean, simple formatting (no tables, graphics, or complex layouts)

    INDUSTRY OPTIMIZATION (${jobAnalysis.industry}):
    - Prioritize sections based on industry: ${jobAnalysis.industry === 'technology' ? 'experience, skills, projects' : 'experience, education, skills'}
    - Use industry-specific terminology and metrics
    - Emphasize relevant achievements for the industry
    - Match industry content style and tone

    CRITICAL INSTRUCTIONS:
    1. Replace ALL placeholder content in the HTML template with ACTUAL user data
    2. Use the user's REAL name: ${userDetails.personalInfo?.firstName || ''} ${userDetails.personalInfo?.lastName || ''}
    3. Use the user's REAL contact information: ${userDetails.personalInfo?.email || ''}, ${userDetails.personalInfo?.phone || ''}
    4. Use the user's REAL location: ${userDetails.personalInfo?.city || ''}, ${userDetails.personalInfo?.state || ''}
    5. Use the user's REAL LinkedIn: ${userDetails.personalInfo?.linkedin || ''}
    6. Use the user's REAL GitHub: ${userDetails.personalInfo?.github || ''}

    EXPERIENCE FILTERING RULES (CRITICAL):
    - ONLY include work experience that is RELEVANT to the job description
    - Filter experiences based on: ${jobAnalysis.requiredSkills.join(', ')} and ${jobAnalysis.relevantTechnologies.join(', ')}
    - Include experiences that demonstrate: ${jobAnalysis.experienceKeywords.join(', ')}
    - Skip experiences that don't align with the job requirements
    - Prioritize recent and relevant experiences over older, less relevant ones
    - Maximum 3-4 most relevant experiences to fit on one page

    EDUCATION FILTERING:
    - Include only relevant education for the position
    - Emphasize degrees/certifications that match job requirements
    - Skip irrelevant coursework or certifications

    SKILLS FILTERING:
    - Prioritize skills that match: ${jobAnalysis.requiredSkills.join(', ')}
    - Include only relevant technical and soft skills
    - Skip skills that don't align with job requirements
    - Maximum 8-10 most relevant skills

    PROJECTS FILTERING:
    - Include only projects that demonstrate: ${jobAnalysis.requiredSkills.join(', ')} and ${jobAnalysis.projectKeywords.join(', ')}
    - Focus on projects relevant to the job description
    - Skip projects that don't align with job requirements
    - Maximum 2-3 most relevant projects

    ONE-PAGE CONSTRAINT (CRITICAL):
    - Ensure the resume fits on exactly ONE page
    - Use concise, bullet-point format for all sections
    - Limit each experience to 3-4 bullet points maximum
    - Keep descriptions brief but impactful
    - Use quantifiable achievements (numbers, percentages)
    - Avoid verbose descriptions or unnecessary details
    - If content is too long, prioritize the most relevant items

    TEMPLATE PLACEHOLDERS TO REPLACE:
    - [FULL_NAME] → User's actual full name
    - [JOB_TITLE] → ${jobAnalysis.standardJobTitle || jobAnalysis.jobTitle}
    - [EMAIL] → User's actual email
    - [PHONE] → User's actual phone
    - [LOCATION] → User's actual location (city, state)
    - [LINKEDIN] → User's actual LinkedIn URL
    - [GITHUB] → User's actual GitHub URL
    - [EXPERIENCE_SECTION] → User's RELEVANT work experience only (filtered for job description)
    - [EDUCATION_SECTION] → User's RELEVANT education only
    - [SKILLS_SECTION] → User's RELEVANT skills only (prioritized for job)
    - [PROJECTS_SECTION] → User's RELEVANT projects only (filtered for job description)
    - [CERTIFICATIONS_SECTION] → User's RELEVANT certifications only
    - [LANGUAGES_SECTION] → User's RELEVANT languages only

    CONTENT RULES:
    - ONLY include sections that have RELEVANT user data (omit empty sections)
    - Filter ALL content based on job description relevance
    - Use action verbs and quantifiable achievements (increased by X%, led team of Y, etc.)
    - Ensure the resume fits on exactly ONE page
    - Maintain the exact HTML structure and CSS styling
    - DO NOT use example/placeholder names or data
    - DO NOT add sections that don't exist in the template
    - DO NOT modify HTML structure or CSS
    - Optimize for ATS scanning and human readability
    - Use industry-specific language and metrics
    - Be selective and concise - quality over quantity

    IMPORTANT: Return ONLY the complete HTML resume with RELEVANT user data populated and ATS-optimized. Do NOT include any markdown formatting like \`\`\`html or \`\`\` or any other markdown syntax. Return pure HTML only.
  `;

  const response = await getResponseFromGemini(prompt);
  return cleanResponse(response || '');
};

const finalizeAndValidateATS = async (content: string, jobDescription: string, atsService: ATSOptimizationService) => {
  const prompt = `
    Perform final ATS validation and optimization on this resume:
    
    Resume Content: ${content}
    Job Description: ${jobDescription}
    
    CRITICAL VALIDATION REQUIREMENTS:
    1. ONE-PAGE CONSTRAINT: Ensure resume fits on exactly one page
    2. RELEVANCE FILTERING: Verify all content is relevant to the job description
    3. ATS compatibility (standard job titles, clean formatting)
    4. Keyword density optimization (2-3% for important keywords)
    5. Action verb usage (replace weak verbs with strong ones)
    6. Quantifiable achievements (add numbers where possible)
    7. Grammar and style polish
    8. Industry-specific terminology accuracy
    
    ONE-PAGE ENFORCEMENT:
    - If content exceeds one page, remove least relevant items
    - Prioritize recent and job-relevant experiences
    - Keep only the most impactful bullet points
    - Ensure concise, scannable format
    - Remove any redundant or verbose content
    
    RELEVANCE VALIDATION:
    - Verify all experiences relate to job requirements
    - Confirm skills match job description keywords
    - Ensure projects demonstrate relevant technologies
    - Remove any content that doesn't align with the position
    
    ATS Optimization Rules:
    - Use standard job titles that ATS systems recognize
    - Maintain clean, simple formatting (no tables, graphics)
    - Ensure proper keyword density without stuffing
    - Use action-oriented language throughout
    - Quantify achievements with specific numbers
    - Avoid fancy formatting, colors, or graphics
    
    IMPORTANT: Return ONLY the final optimized HTML resume content that fits on ONE page with RELEVANT content only. Do NOT include any markdown formatting like \`\`\`html or \`\`\` or any other markdown syntax. Return pure HTML only.
  `;

  const response = await getResponseFromGemini(prompt);
  return cleanResponse(response || '');
};
