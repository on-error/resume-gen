import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error('GOOGLE_AI_API_KEY environment variable is required');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Initialize the model
export const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export default genAI;
