import { getResponseFromGemini } from './gemini';
import { standardJobTitles as titles, keywords, actVerbs, synonyms } from '../data/ats';

export class ATSOptimizationService {
  private standardJobTitles: Map<string, string[]>;
  private atsKeywords: Map<string, string[]>;
  private actionVerbs: string[];
  private skillSynonyms: Map<string, string[]>;

  constructor() {
    this.standardJobTitles = new Map();
    this.atsKeywords = new Map();
    this.actionVerbs = [];
    this.skillSynonyms = new Map();
    this.loadData();
  }

  private async loadData() {
    this.standardJobTitles = new Map(titles as [string, string[]][]);

    this.atsKeywords = new Map(keywords as [string, string[]][]);

    this.actionVerbs = actVerbs;

    this.skillSynonyms = new Map(synonyms as [string, string[]][]);
  }

  async preprocessForATS(content: string, jobDescription: string) {
    const jobTitle = await this.extractJobTitle(jobDescription);
    const standardisedJobTitle = this.standardiseJobTitle(jobTitle);

    const optimizedContent = this.optimiseActionVerbs(content);
    const skills = await this.extractSkills(jobDescription);
    const standardisedSkills = this.standardiseSkills(skills);

    const keywordsOptimized = this.optimiseKeywordsDensity(
      optimizedContent,
      standardisedSkills
    );
    return keywordsOptimized;
  }

  private async extractJobTitle(jobDescription: string) {
    const prompt = `
      Extract the primary job title from this job description. Return only the job title, nothing else.
      
      Job Description: ${jobDescription}
      
      Job Title:
      DO NOT INCLUDE ANY MARKDOWN like "\`\`\`json" or "\`\`\`" or any other markdown syntax.
      `;
    const jobTitle = await getResponseFromGemini(prompt);

    return jobTitle?.trim() || '';
  }

  private async extractSkills(jobDescription: string) {
    const prompt = `
      Extract all technical skills, tools, and technologies mentioned in this job description. 
      Return as a comma-separated list.
      
      Job Description: ${jobDescription}
      
      Skills:

      DO NOT INCLUDE ANY MARKDOWN like "\`\`\`json" or "\`\`\`" or any other markdown syntax.
      `;
    const skills = await getResponseFromGemini(prompt);

    return skills?.trim() || '';
  }

  private standardiseJobTitle(jobTitle: string) {
    const lowerTitle = jobTitle.toLowerCase();

    for (const [key, variations] of this.standardJobTitles) {
      if (lowerTitle.includes(key)) {
        return variations[0];
      }
    }

    return jobTitle;
  }

  private standardiseSkills(skills: string) {
    const skillList = skills
      .split(',')
      .map((skill) => skill.trim().toLowerCase());

    const standardisedSkills = skillList.map((skill) => {
      for (const [key, synonyms] of this.skillSynonyms) {
        if (
          synonyms.some((synonym) =>
            skill.toLowerCase().includes(synonym.toLowerCase())
          )
        ) {
          return key;
        }
      }

      return skill;
    });

    return standardisedSkills;
  }

  private optimiseActionVerbs(content: string) {
    const verbReplacements = {
      did: 'performed',
      created: 'developed',
      designed: 'created',
      implemented: 'developed',
      managed: 'led',
      led: 'led',
      made: 'created',
      'worked on': 'developed',
      'worked with': 'collaborated with',
      helped: 'assisted',
      used: 'utilised',
      'did stuff': 'executed'
    };

    let optimised = content;

    for(const [weak, strong] of Object.entries(verbReplacements)) {
      optimised = optimised.replace(new RegExp(weak, 'gi'), strong);
    }

    return optimised;
  }

  private optimiseKeywordsDensity(content: string, keywords: string[]) {
    let optimised = content;

    for (const keyword of keywords) {
      const count = (optimised.match(new RegExp(keyword, 'gi')) || []).length;

      if (count > 1) {
        optimised = this.addKeywordNaturally(optimised, keyword);
      }
    }

    return optimised;
  }


  private addKeywordNaturally(content: string, keyword: string) {
    const sentences = content.split('.');
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];

    if(randomSentence && (!randomSentence.toLowerCase().includes(keyword.toLowerCase()))) {
      const enhancedSentence = `${randomSentence} Utilised ${keyword} to enhance the project outcomes`;
      
      return content.replace(randomSentence, enhancedSentence);
    }

    return content;
  }
}
