// ✏️ CUSTOMIZE THIS FILE
// AI model configuration and behavior settings

import dotenv from 'dotenv';
dotenv.config();

export const AI_CONFIG = {
  // OpenAI Model Configuration
  model: process.env.AI_MODEL || "gpt-4o-mini",
  temperature: 0.7,        // 0-1: Higher = more creative, Lower = more focused
  maxTokens: 2500,
  
  // Embedding Configuration
  embeddingModel: process.env.EMBEDDING_MODEL || "text-embedding-3-small",
  
  // Vector Store Settings
  vectorStore: {
    type: "hnswlib",
    topK: parseInt(process.env.TOP_K_RESULTS) || 5,  // Number of similar documents to retrieve
    path: process.env.VECTOR_STORE_PATH || "./vectorstore"
  },
  
  // Chain-specific temperatures for different use cases
  chains: {
    skillExtraction: {
      temperature: 0.3,    // Very factual - extracting concrete skills
      maxTokens: 1000
    },
    gapAnalysis: {
      temperature: 0.5,    // Factual but some interpretation
      maxTokens: 1500
    },
    roadmapGeneration: {
      temperature: 0.7,    // Balanced - creative but structured
      maxTokens: 2500
    },
    courseRecommendation: {
      temperature: 0.4,    // Factual - matching courses to skills
      maxTokens: 1500
    },
    strategyGeneration: {
      temperature: 0.8,    // Creative - personalized advice
      maxTokens: 2000
    }
  },
  
  // Roadmap Configuration
  roadmap: {
    defaultMonths: 6,
    defaultHoursPerWeek: 10,
    projectsRequired: 2
  },
  
  // Career Transition Settings
  transition: {
    minTransferableSkills: 3,
    minNewSkills: 5,
    maxCourseRecommendations: 12
  }
};

// Prompt Templates (✏️ Customize these for different tone/style)
export const PROMPT_TEMPLATES = {
  systemRole: `You are an expert career coach with 15+ years of experience helping professionals transition careers. You provide:
- Realistic, actionable advice
- Honest assessment of time and effort required
- Encouragement balanced with practical considerations
- Specific, concrete recommendations (not generic advice)`,

  toneGuidelines: `TONE:
- Professional but warm and encouraging
- Honest about challenges without being discouraging
- Specific and actionable (no vague advice)
- Acknowledges the user's existing strengths
- Shows empathy for career transition anxiety`,

  outputFormat: `OUTPUT FORMAT:
- Use clear structure and headings
- Be specific: Name actual courses, not "take a course"
- Include realistic timelines (not "learn X quickly")
- Provide concrete next steps
- JSON format for structured data`
};

export default AI_CONFIG;