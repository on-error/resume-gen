import { GoogleGenAI } from '@google/genai';


const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

const getPrompt = (details: string) => `
    /**
     * You are an expert in resume generation and LaTeX formatting.
     * Your task is to generate a one-page resume in LaTeX, strictly following the provided template and using only the user details and job description given.
     * The generated LaTeX code must be fully functional and compile without errors.
     *
     * The input will be provided in the following order:
     *
     * 1. USER_DETAILS (in JSON format, matching this structure):
     * {
     * "personalInfo": {
     * "firstName": string,
     * "lastName": string,
     * "phone": string,
     * "email": string,
     * "address": string,
     * "city": string,
     * "state": string,
     * "zipCode": string,
     * "country": string,
     * "linkedin": string,
     * "github": string,
     * "portfolio": string,
     * "website": string,
     * "summary": string,
     * "objective": string,
     * "dateOfBirth": string,
     * "nationality": string
     * },
     * "experiences": [
     * {
     * "jobTitle": string,
     * "company": string,
     * "location": string,
     * "startDate": string,
     * "endDate": string,
     * "isCurrent": boolean,
     * "description": string,
     * "achievements": string,
     * "responsibilities": string
     * },
     * ...
     * ],
     * "education": [
     * {
     * "institution": string,
     * "degree": string,
     * "fieldOfStudy": string,
     * "location": string,
     * "startDate": string,
     * "endDate": string,
     * "isCurrent": boolean,
     * "gpa": number,
     * "description": string
     * },
     * ...
     * ],
     * "skills": [
     * {
     * "name": string,
     * "proficiency": string
     * },
     * ...
     * ],
     * "projects": [
     * {
     * "title": string,
     * "description": string,
     * "technologies": [string, ...],
     * "role": string,
     * "githubUrl": string,
     * "liveUrl": string,
     * "demoUrl": string,
     * "impact": string
     * },
     * ...
     * ],
     * "certifications": [
     * {
     * "name": string,
     * "issuingOrganization": string,
     * "issueDate": string,
     * "expiryDate": string,
     * "credentialId": string,
     * "description": string,
     * "url": string,
     * "isExpired": boolean
     * },
     * ...
     * ],
     * "languages": [
     * {
     * "language": string,
     * "proficiency": string,
     * "isNative": boolean
     * },
     * ...
     * ]
     * }
     *
     * 2. RESUME_TEMPLATE:
     * - The LaTeX code of the example resume template (as a string). This template contains placeholder data that MUST be replaced.
     * - The image data (base64) of the template for visual reference, included as a field "templateImageBase64" within the details string/object. This image is for reference only and should not be processed or included in the output.
     *
     *
     * 3. JOB_DESCRIPTION:
     * - A plain text job description.
     *
     * INSTRUCTIONS:
     * - Generate a resume in **LaTeX format**, strictly adhering to the provided "RESUME_TEMPLATE"'s structure, styling, and commands.
     * - **Crucially, completely replace all placeholder data** in the RESUME_TEMPLATE with the actual USER_DETAILS provided. Do not retain any example data from the template.
     * - The resume must be **only one page** in length. Condense content as necessary to fit, prioritizing impact.
     * - **Use only the "USER_DETAILS" provided.** Do not invent, hallucinate, or infer any information not explicitly given.
     * - **Tailor the resume content** to best match the requirements and keywords found in the "JOB_DESCRIPTION". Prioritize the inclusion and phrasing of relevant experiences, skills, and projects that align with the job's demands.
     * - **Omit any sections for which the user has no data** in their "USER_DETAILS". For instance, if there are no "certifications", do not include a certifications section in the output LaTeX.
     * - Ensure the generated LaTeX code is **syntactically correct and ready for compilation** without any errors. Pay close attention to escaping special LaTeX characters (e.g., #, $, %, &, _, {, }, ~, ^, \, <, >) within the user's data if they appear.
     * - **Output only the LaTeX code for the completed resume.** Do not include any explanations, comments, conversational text, or extra characters before or after the LaTeX code.
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
