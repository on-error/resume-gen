import { getResponseFromGemini } from "./gemini";
import { industryData } from "../data/industry";

interface IndustryRules {
  name: string;
  prioritySections: string[];
  requiredKeywords: string[];
  preferredFormat: string;
  emphasisAreas: string[];
  quantifiableMetrics: string[];
  certifications: string[];
  softSkills: string[];
  technicalSkills: string[];
  contentStyle: 'formal' | 'creative' | 'executive' | 'technical';
  maxContentLength: number;
}

export class IndustryRulesService {
  private industryConfigs: Map<string, IndustryRules>;

  constructor() {
    this.industryConfigs = new Map();
    this.loadIndustryConfigs();
  }

  private loadIndustryConfigs() {
    this.industryConfigs = new Map(industryData as [string, IndustryRules][]);
  }

  async applyIndustryRules(content: string, industry: string) {
    const config = this.getIndustryConfig(industry);

    if (!config) {
      throw new Error(`No industry config found for ${industry}`);
    }

    const prioritizedContent = await this.prioritizeSections(content, config);

    if (!prioritizedContent) {
      throw new Error('Failed to prioritize sections');
    }

    const keywordEnhanced = await this.addIndustryKeywords(prioritizedContent, config);

    if (!keywordEnhanced) {
      throw new Error('Failed to add industry keywords');
    }

    const styleOptimized = await this.optimizedContentStyle(keywordEnhanced, config);

    if (!styleOptimized) {
      throw new Error('Failed to optimize content style');
    }

    const metricsEnhanced = await this.addIndustryMetrics(styleOptimized, config);

    if (!metricsEnhanced) {
      throw new Error('Failed to add industry metrics');
    }

    // const finalContent = await this.applyLengthConstraints(metricsEnhanced, config);

    // if (!finalContent) {
    //   throw new Error('Failed to apply length constraints');
    // }

    return metricsEnhanced;
  }

  private getIndustryConfig(industry: string) {
    return this.industryConfigs.get(industry) || this.industryConfigs.get('technology');
  }

  private async prioritizeSections(content: string, config: IndustryRules) {
    const prompt = `
      Reorganize this resume content to prioritize sections based on industry requirements:
      
      Content: ${content}
      Industry: ${config.name}
      Priority Sections: ${config.prioritySections.join(', ')}
      
      Reorganize the content to emphasize the priority sections while maintaining the HTML structure.
      Return the reorganized HTML content.

      DO NOT INCLUDE ANY MARKDOWN like "\`\`\`json" or "\`\`\`" or any other markdown syntax.
    `;

    const response = await getResponseFromGemini(prompt);
    return response;
  }

  private async addIndustryKeywords(content: string, config: IndustryRules) {
    const prompt = `
      Optimize the content style for this industry:
      
      Content: ${content}
      Industry: ${config.name}
      Content Style: ${config.contentStyle}
      Emphasis Areas: ${config.emphasisAreas.join(', ')}
      
      Adjust the tone, language, and emphasis to match industry expectations.
      Return the style-optimized HTML content.

      DO NOT INCLUDE ANY MARKDOWN like "\`\`\`json" or "\`\`\`" or any other markdown syntax.
    `;

    const response = await getResponseFromGemini(prompt);
    return response;
  }

  private async optimizedContentStyle(content: string, config: IndustryRules) {
    const prompt = `
      Optimize the content style for this industry:
      
      Content: ${content}
      Industry: ${config.name}
      Content Style: ${config.contentStyle}
      Emphasis Areas: ${config.emphasisAreas.join(', ')}
      
      Adjust the tone, language, and emphasis to match industry expectations.
      Return the style-optimized HTML content.

      DO NOT INCLUDE ANY MARKDOWN like "\`\`\`json" or "\`\`\`" or any other markdown syntax.
    `;

    const response = await getResponseFromGemini(prompt);
    return response;
  }

  private async addIndustryMetrics(content: string, config: IndustryRules) {
    const prompt = `
      Add industry-specific quantifiable metrics to this content:
      
      Content: ${content}
      Industry: ${config.name}
      Quantifiable Metrics: ${config.quantifiableMetrics.join(', ')}
      
      Add relevant metrics and achievements that matter in this industry.
      Return the metrics-enhanced HTML content.

      DO NOT INCLUDE ANY MARKDOWN like "\`\`\`json" or "\`\`\`" or any other markdown syntax.
    `;

    const response = await getResponseFromGemini(prompt);
    return response;
  }

  private async applyLengthConstraints(content: string, config: IndustryRules) {
    const prompt = `
      Ensure this content meets industry length constraints:
      
      Content: ${content}
      Industry: ${config.name}
      Max Content Length: ${config.maxContentLength} characters
      
      Condense the content while maintaining quality and relevance.
      Return the length-optimized HTML content. 

      DO NOT INCLUDE ANY MARKDOWN like "\`\`\`json" or "\`\`\`" or any other markdown syntax.
    `;

    const response = await getResponseFromGemini(prompt);
    return response;
  }
}
