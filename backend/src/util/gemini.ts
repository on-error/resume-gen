import { GoogleGenAI } from '@google/genai';


const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

const getPrompt = (details: string) => `
    /**
     * You are an expert in resume generation and LaTeX formatting.
     * Your task is to generate a one-page resume in LaTeX, strictly following the provided template and using only the user details and job description given.
     * 
     * The input will be provided in the following order:
     * 
     * 1. USER DETAILS (in JSON format, matching this structure):
     *    {
     *      "personalInfo": {
     *        "firstName": string,
     *        "lastName": string,
     *        "phone": string,
     *        "email": string,
     *        "address": string,
     *        "city": string,
     *        "state": string,
     *        "zipCode": string,
     *        "country": string,
     *        "linkedin": string,
     *        "github": string,
     *        "portfolio": string,
     *        "website": string,
     *        "summary": string,
     *        "objective": string,
     *        "dateOfBirth": string,
     *        "nationality": string
     *      },
     *      "experiences": [
     *        {
     *          "jobTitle": string,
     *          "company": string,
     *          "location": string,
     *          "startDate": string,
     *          "endDate": string,
     *          "isCurrent": boolean,
     *          "description": string,
     *          "achievements": string,
     *          "responsibilities": string
     *        },
     *        ...
     *      ],
     *      "education": [
     *        {
     *          "institution": string,
     *          "degree": string,
     *          "fieldOfStudy": string,
     *          "location": string,
     *          "startDate": string,
     *          "endDate": string,
     *          "isCurrent": boolean,
     *          "gpa": number,
     *          "description": string
     *        },
     *        ...
     *      ],
     *      "skills": [
     *        {
     *          "name": string,
     *          "proficiency": string
     *        },
     *        ...
     *      ],
     *      "projects": [
     *        {
     *          "title": string,
     *          "description": string,
     *          "technologies": [string, ...],
     *          "role": string,
     *          "githubUrl": string,
     *          "liveUrl": string,
     *          "demoUrl": string,
     *          "impact": string
     *        },
     *        ...
     *      ],
     *      "certifications": [
     *        {
     *          "name": string,
     *          "issuingOrganization": string,
     *          "issueDate": string,
     *          "expiryDate": string,
     *          "credentialId": string,
     *          "description": string,
     *          "url": string,
     *          "isExpired": boolean
     *        },
     *        ...
     *      ],
     *      "languages": [
     *        {
     *          "language": string,
     *          "proficiency": string,
     *          "isNative": boolean
     *        },
     *        ...
     *      ]
     *    }
     * 
     * 2. RESUME TEMPLATE:
     *    - The LaTeX code of the example resume template (as a string). 
     *    - The image data (base64) of the template (for reference, not for output).
     *    - The image data should be included as a field in the details string/object.
     *    - Image base64 string will be included in the details with a key "templateImageBase64".
     * 
     * 
     * 3. JOB DESCRIPTION:
     *    - A plain text job description.
     * 
     * INSTRUCTIONS:
     * - Generate a resume in LaTeX format, strictly following the provided template's structure and style.
     * - The resume must be only one page.
     * - Use only the user details provided. Do not invent or hallucinate any information.
     * - Tailor the resume content to best match the requirements and keywords of the job description, prioritizing relevant experiences, skills, and projects.
     * - Omit any sections for which the user has no data.
     * - Output only the LaTeX code for the completed resume, formatted cleanly and ready for compilation.
     * - Do not include any explanations, comments, or extra text—only the LaTeX code.
     */

    ${details}
    `;

const generateText = async (details: string) => {
  try {
    // If you want to send the base64 string of an image along with the other prompt details,
    // you can include it as part of the prompt content (as a field in your details string/object).
    // Gemini's API does not support sending binary/image data directly in the prompt for text-only models,
    // but you can embed the base64 string in the prompt for reference.

    // Example: details should include a field like "templateImageBase64": "<base64string>"
    // and your getPrompt(details) should format it accordingly.

    const response = await gemini.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: getPrompt(details), // details should include the base64 string as part of the prompt
    });

    return response?.text;
  } catch (error) {
    console.log('error', error);
    return '';
  }
};

export { generateText };
