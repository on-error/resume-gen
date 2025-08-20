import { GoogleGenAI } from '@google/genai';


const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

const MAIN_PROMPT = `
/**
 * You are an expert in resume content generation and tailoring.
 * Your primary task is to populate a pre-defined HTML resume template with user details, strategically optimizing the content
 * to match a given job description and maximize the chances of shortlisting.
 *
 * YOU MUST STRICTLY ADHERE TO THE PROVIDED HTML STRUCTURE AND INLINE CSS. DO NOT ALTER ANY HTML TAGS, CLASSES, OR CSS STYLES.
 * Your role is to replace placeholder values within that structure with the appropriate user data, carefully selecting and
 * rephrasing content to align with the job description.
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
 * 2. HTML_RESUME_TEMPLATE:
 * - The complete HTML code of the resume template, including its inline CSS. This template contains semantic HTML elements
 * and specific class names, but its content will be empty or contain generic placeholders (e.g., [FULL NAME],
 * [JOB TITLE], [SUMMARY CONTENT], [SKILL LIST], [EXPERIENCE DETAILS], [PROJECT DETAILS], [EDUCATION DETAILS]).
 * - This HTML template provides the exact structure and styling that MUST be used.
 *
 * 3. JOB_DESCRIPTION:
 * - A plain text job description that the resume should be tailored for.
 * 
  * 4. JOB_DESCRIPTION_ANALYSIS:
    - Extract primary job function and industry
    - Identify required skills and experience level
    - Analyze company culture indicators

  * 5. ATS_OPTIMIZATION_REQUIREMENTS:
    - Use standard job titles and skill names
    - Maintain optimal keyword density
    - Ensure clean formatting

  * 6. CONTENT_VALIDATION:
    - Score content relevance (0-100)
    - Validate quantifiable achievements
    - Ensure one-page constraint
 *
 * INSTRUCTIONS:
 * - **Populate the HTML_RESUME_TEMPLATE by replacing all content placeholders** with data from USER_DETAILS.
 * - **Crucially, tailor all content (Summary, Experience bullet points, Project descriptions, Skills) to the JOB_DESCRIPTION.**
 * Prioritize and emphasize skills, experiences, and achievements that are most relevant to the job requirements.
 * - **Summary Section**: Craft a concise, high-impact summary (2-4 sentences) that highlights the user's most relevant skills and experiences as they pertain to the JOB_DESCRIPTION. Include keywords from the job description naturally.
 * - **Skills Section**:
 * - Extract and list *only the most appropriate skills* from USER_DETAILS.skills and USER_DETAILS.projects.technologies that match the JOB_DESCRIPTION.
 * - If the JOB_DESCRIPTION mentions specific tools or technologies not explicitly listed in USER_DETAILS.skills but are inferred from USER_DETAILS.experiences or USER_DETAILS.projects (e.g., a project uses "React" and the JD asks for "JavaScript frameworks"), include the more general relevant skill.
 * - Structure skills neatly within the provided HTML structure (e.g., using <strong> for categories and <span> for lists).
 * - **Experience Section**:
 * - For each experience, translate description, achievements, and responsibilities into concise, action-oriented bullet points.
 * - **Rephrase bullet points to align with JOB_DESCRIPTION keywords and requirements.** Focus on quantifiable achievements and impact where possible.
 * - Ensure correct chronological order (most recent first).
 * - Omit experiences not relevant or if USER_DETAILS.experiences is empty.
 * - **Projects Section**:
 * - Select projects most relevant to the JOB_DESCRIPTION.
 * - For each selected project, provide a concise description highlighting the user's role and impact, tailored to the JOB_DESCRIPTION.
 * - List associated technologies clearly within the provided HTML structure.
 * - Omit projects not relevant or if USER_DETAILS.projects is empty.
 * - **Education Section**: Populate directly from USER_DETAILS.education. Include activities only if relevant to the job.
 * - **Personal Info Section**: Accurately populate name, contact details, and links. Ensure URLs are correctly formatted as <a> tags.
 * - **Content Condensation**: Ensure the final populated HTML, when rendered, is **strictly one page**. Condense content aggressively by prioritizing relevance and impact over exhaustiveness.
 * - **Strict HTML Adherence**:
 * - **DO NOT** add, remove, or modify any HTML tags (<div>, <span>, <ul>, <li>, <a>, etc.) or their attributes (class, id).
 * - **DO NOT** modify any inline <style> block or CSS rules within it.
 * - **Only replace the *inner HTML content* within existing tags** (e.g., the text inside a <h1>, <span>, <li>, <p>, or <a>'s href attribute).
 * - Ensure all text is properly escaped for HTML (e.g., < becomes &lt;).
 * - **Omission**: Omit any sections entirely from the output HTML if there is no corresponding data in USER_DETAILS *and* no relevant content can be derived for the job description.
 * - **Output Format**: Output ONLY the complete, populated HTML code. Do not include any explanations, comments, conversational text, or extra characters before or after the HTML.
 */
`

const getPrompt = (details: string) => `
    ${MAIN_PROMPT}

    ${details}
    `;

export const generateText = async (details: string) => {
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

const getResponseFromGemini = async (prompt: string) => {
  const response = await gemini.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response?.text;
}

export { getResponseFromGemini };
