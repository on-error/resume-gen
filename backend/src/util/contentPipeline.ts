import { getResponseFromGemini } from "./gemini";
import { getUserDetails } from "./resumeGen";

export class ContentGenerationPipeline {
  async generateResume(userId: string, jobDescription: string) {

    const keywords = await this.extractKeywords(jobDescription);
    console.log('Keywords: ', keywords);

    const analysis = await this.analyseContent(userId, keywords);
    console.log('Content Analysis: ', analysis);

    const optimisedContent = await this.generateOptimisedContent(analysis);
    console.log('Optimised Content generated');

    const atsValidated = await this.validateATS(optimisedContent || '', jobDescription);
    console.log('ATS Validated');

    const finalContent = await this.finalizeContent(atsValidated || '', jobDescription);
    console.log('Final Content generated');

    return finalContent;
  }

  private async extractKeywords(jobDescription: string) {
    const prompt = `
      Analyze this job description and extract:
      1. Required technical skills (programming languages, tools, frameworks)
      2. Required soft skills (leadership, communication, etc.)
      3. Industry-specific keywords
      4. Experience level indicators
      5. Quantifiable requirements (years of experience, team size, etc.)
      
      Return as JSON format:
      {
        "technicalSkills": ["skill1", "skill2"],
        "softSkills": ["skill1", "skill2"],
        "industryKeywords": ["keyword1", "keyword2"],
        "experienceLevel": "entry|mid|senior|executive",
        "quantifiableRequirements": ["requirement1", "requirement2"]
      }
      
      Job Description: ${jobDescription}

      DO NOT INCLUDE ANY MARKDOWN like "\`\`\`json" or "\`\`\`" or any other markdown syntax.
    `;

    const response = await getResponseFromGemini(prompt);
    return JSON.parse(response || '{}');
  }

  private async analyseContent(userId: string, keywords: string[]) {
    let userDetails = await getUserDetails(userId);

    const prompt = `
      Analyse this user's resume content against the extracted keywords:
      
      User Data: ${userDetails}
      Keywords: ${JSON.stringify(keywords)}

      Provide analysis in JSON format:
      {
      "keywordMatchScore": 85,
      "missingKeywords": ["Keyword1", "Keyword2"],
      "strongSections": ["experience", "projects"],
      "weakSections": ["skills", "summary"],
      "improvementOpportunities": ["Add more projects", "Improve skills section"],
      "contentGaps": ["No leadership experience mentioned", "Missing industry-specific certifications"]
      }

      DO NOT INCLUDE ANY MARKDOWN like "\`\`\`json" or "\`\`\`" or any other markdown syntax.
    `;

    const analysis = await getResponseFromGemini(prompt);
    return JSON.parse(analysis || '{}');
  }

  private async generateOptimisedContent(analysis: any) {
    const prompt = `
      Based on the content analysis, generate optimized resume content:
      
      Analysis: ${JSON.stringify(analysis)}
      
      Generate content that:
      1. Addresses missing keywords
      2. Strengthens weak sections
      3. Adds quantifiable achievements
      4. Fills content gaps
      5. Maintains one-page constraint
      
      Return the optimized content in HTML format.

      DO NOT INCLUDE ANY MARKDOWN like "\`\`\`json" or "\`\`\`" or any other markdown syntax.
    `;

    const response = await getResponseFromGemini(prompt);
    return response;
  }

  private async validateATS(content: string, jobDescription: string) {
    const prompt = `
      Validate this resume content for ATS compatibility:
      
      Content: ${content}
      Job Description: ${jobDescription}
      
      Check for:
      1. Standard job titles
      2. Proper keyword density (2-3%)
      3. Clean formatting (no tables, graphics)
      4. Action-oriented language
      5. Quantifiable achievements
      
      If issues found, provide corrected version.
      Return only the corrected HTML content.

      DO NOT INCLUDE ANY MARKDOWN like "\`\`\`json" or "\`\`\`" or any other markdown syntax.
    `;

    const response = await getResponseFromGemini(prompt);
    return response;
  }

  private async finalizeContent(content: string, jobDescription: string) {
    const prompt = `
      Perform final optimization and scoring:
      Content: ${content}
      Job Description: ${jobDescription}

      Optimize:
      1. Score content relevance (0-100)
      2. Ensure one-page constraint
      3. Optimize for maximum impact
      4. Final keyword density check
      5. Grammar and style polish

      DO NOT INCLUDE ANY MARKDOWN like "\`\`\`json" or "\`\`\`" or any other markdown syntax.
    `;

    const response = await getResponseFromGemini(prompt);
    return response;
  }
}