// ✏️ CUSTOMIZE THIS FILE
// LangChain chains for career analysis and roadmap generation

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import { AI_CONFIG, PROMPT_TEMPLATES } from './config.js';

// Initialize OpenAI models with different temperatures for different tasks
const models = {
  factual: new ChatOpenAI({
    modelName: AI_CONFIG.model,
    temperature: AI_CONFIG.chains.skillExtraction.temperature,
    maxTokens: AI_CONFIG.chains.skillExtraction.maxTokens
  }),
  balanced: new ChatOpenAI({
    modelName: AI_CONFIG.model,
    temperature: AI_CONFIG.chains.roadmapGeneration.temperature,
    maxTokens: AI_CONFIG.chains.roadmapGeneration.maxTokens
  }),
  creative: new ChatOpenAI({
    modelName: AI_CONFIG.model,
    temperature: AI_CONFIG.chains.strategyGeneration.temperature,
    maxTokens: AI_CONFIG.chains.strategyGeneration.maxTokens
  })
};

// ✏️ CHAIN 1: Extract Skills from User Input
export const createSkillExtractionChain = () => {
  const template = `${PROMPT_TEMPLATES.systemRole}

Extract structured information from the user's career description.

USER INPUT:
Current Role/Background: {currentRole}
Target Role/Dream Job: {targetRole}
Additional Context: {context}

TASK:
Extract and categorize:
1. Current skills (technical and soft skills)
2. Current experience level (entry/mid/senior)
3. Industry/domain knowledge
4. Time availability (if mentioned)
5. Location (if mentioned)

Return ONLY valid JSON:
{{
  "currentSkills": ["skill1", "skill2"],
  "experienceLevel": "entry|mid|senior",
  "domain": "industry name",
  "hoursPerWeek": 10,
  "location": "city, country"
}}`;

  const prompt = new PromptTemplate({
    template,
    inputVariables: ["currentRole", "targetRole", "context"]
  });

  return new LLMChain({ llm: models.factual, prompt });
};

// ✏️ CHAIN 2: Analyze Skill Gap
export const createGapAnalysisChain = () => {
  const template = `${PROMPT_TEMPLATES.systemRole}

Analyze the skill gap between current and target role.

CURRENT PROFILE:
Skills: {currentSkills}
Experience: {experienceLevel}
Domain: {domain}

TARGET ROLE:
{targetRole}

JOB REQUIREMENTS (from database):
{jobRequirements}

TASK:
1. Identify skills the user already has ✅
2. Identify transferable skills from current role 🔄
3. Identify skills needed to learn 📚
4. Calculate gap score (0-100, where 100 = fully qualified)

${PROMPT_TEMPLATES.toneGuidelines}

Return ONLY valid JSON:
{{
  "currentSkills": ["skill1", "skill2"],
  "transferableSkills": [
    {{"skill": "problem-solving", "howItHelps": "explanation"}}
  ],
  "skillsNeeded": [
    {{"skill": "React", "priority": "high|medium|low", "learningTime": "weeks"}}
  ],
  "gapScore": 65,
  "summary": "You're closer than you think! Your experience with..."
}}`;

  const prompt = new PromptTemplate({
    template,
    inputVariables: ["currentSkills", "experienceLevel", "domain", "targetRole", "jobRequirements"]
  });

  return new LLMChain({ llm: models.balanced, prompt });
};

// ✏️ CHAIN 3: Generate 6-Month Roadmap
export const createRoadmapChain = () => {
  const template = `${PROMPT_TEMPLATES.systemRole}

Create a detailed 6-month learning roadmap.

USER PROFILE:
Current: {currentRole}
Target: {targetRole}
Skills to Learn: {skillsToLearn}
Time Available: {hoursPerWeek} hours/week
Experience Level: {experienceLevel}

AVAILABLE COURSES (from database):
{relevantCourses}

REQUIREMENTS:
1. Month-by-month plan (Months 1-6)
2. Each month: focus area, specific courses, project, hours/week
3. Month 1-2: Foundations
4. Month 3-4: Intermediate + Project 1
5. Month 5-6: Advanced + Project 2 + Job prep
6. Realistic given {hoursPerWeek} hours/week
7. Use ACTUAL course names from the provided list

${PROMPT_TEMPLATES.toneGuidelines}

IMPORTANT:
- Be realistic about {hoursPerWeek} hours/week
- Don't overpromise ("master in 2 weeks")
- Specific courses, not "take a course"
- Projects should build portfolio

Return ONLY valid JSON:
{{
  "month1": {{
    "focus": "React Fundamentals",
    "courses": [
      {{"name": "Course Name", "platform": "Coursera", "hours": 20, "url": "link"}}
    ],
    "project": "Build a todo app with React hooks",
    "hoursPerWeek": 10,
    "milestones": ["Complete JSX basics", "Understand hooks"]
  }},
  "month2": {{}},
  "month3": {{}},
  "month4": {{}},
  "month5": {{}},
  "month6": {{}},
  "totalHours": 240,
  "keyTakeaway": "After 6 months, you'll have..."
}}`;

  const prompt = new PromptTemplate({
    template,
    inputVariables: ["currentRole", "targetRole", "skillsToLearn", "hoursPerWeek", "experienceLevel", "relevantCourses"]
  });

  return new LLMChain({ llm: models.balanced, prompt });
};

// ✏️ CHAIN 4: Generate Job Search Strategy
export const createStrategyChain = () => {
  const template = `${PROMPT_TEMPLATES.systemRole}

Create a personalized job search strategy.

USER PROFILE:
Current: {currentRole}
Target: {targetRole}
Location: {location}
Experience: {experienceLevel}
Unique Background: {uniqueBackground}

SALARY DATA (from database):
{salaryData}

TASK:
Create a job search strategy including:
1. When to start applying (Month X of roadmap)
2. Target companies (specific names if possible)
3. Realistic salary expectations
4. Networking strategy
5. Application timeline
6. Interview prep focus areas

${PROMPT_TEMPLATES.toneGuidelines}

Return ONLY valid JSON:
{{
  "startApplyingMonth": 4,
  "targetCompanies": ["Company type 1", "Company type 2"],
  "salary": {{
    "range": "₹8-12 LPA" or "$80k-100k",
    "factors": "Based on location, experience...",
    "negotiationTip": "Highlight your X experience"
  }},
  "networking": {{
    "platforms": ["LinkedIn", "Twitter"],
    "strategy": "Connect with...",
    "communities": ["Community 1", "Community 2"]
  }},
  "applicationStrategy": {{
    "approach": "Quality over quantity...",
    "weeklyApplications": 5,
    "followUp": "Strategy for following up"
  }},
  "interviewPrep": {{
    "focusAreas": ["System design", "Behavioral"],
    "timeline": "Start in Month 5",
    "resources": ["Resource 1", "Resource 2"]
  }}
}}`;

  const prompt = new PromptTemplate({
    template,
    inputVariables: ["currentRole", "targetRole", "location", "experienceLevel", "uniqueBackground", "salaryData"]
  });

  return new LLMChain({ llm: models.creative, prompt });
};

// ✏️ CHAIN 5: Generate "Your Unique Angle"
export const createUniqueAngleChain = () => {
  const template = `${PROMPT_TEMPLATES.systemRole}

Create a compelling "unique angle" for this career transition.

USER PROFILE:
Current Background: {currentRole}
Target Role: {targetRole}
Transferable Skills: {transferableSkills}
Experience: {experienceLevel}

CAREER TRANSITION STORIES (similar transitions):
{transitionStories}

TASK:
Explain how this person's background is actually an ASSET, not a liability.
Create:
1. Why this background makes them unique
2. How to position the career switch positively
3. The "superpower" they bring from current role
4. Elevator pitch template
5. Resume positioning advice

${PROMPT_TEMPLATES.toneGuidelines}

Be encouraging and specific!

Return ONLY valid JSON:
{{
  "uniqueValue": "Your background in X gives you...",
  "superpower": "You can bridge the gap between...",
  "positioning": "Frame yourself as...",
  "elevatorPitch": "I'm a [current role] transitioning to [target role] because...",
  "resumeTip": "Lead with your transferable skills...",
  "confidenceBoost": "Many successful [target role] come from [current field]..."
}}`;

  const prompt = new PromptTemplate({
    template,
    inputVariables: ["currentRole", "targetRole", "transferableSkills", "experienceLevel", "transitionStories"]
  });

  return new LLMChain({ llm: models.creative, prompt });
};

// ✏️ CHAIN 6: Course Recommendation (uses vector search results)
export const createCourseRecommendationChain = () => {
  const template = `${PROMPT_TEMPLATES.systemRole}

Recommend the best courses for these specific skills.

SKILLS TO LEARN:
{skillsToLearn}

USER CONTEXT:
Experience Level: {experienceLevel}
Time Available: {hoursPerWeek} hours/week
Learning Style: {learningStyle}

AVAILABLE COURSES (from vector database):
{availableCourses}

TASK:
Select and rank the top 8-12 courses that:
1. Match the skills needed
2. Are appropriate for experience level
3. Fit the time budget
4. Mix free and paid options
5. Progress from beginner to advanced

Prioritize:
- Free options when quality is similar
- Well-reviewed courses
- Project-based learning
- Reputable platforms (Coursera, Udemy, freeCodeCamp)

Return ONLY valid JSON array:
[
  {{
    "courseName": "The Complete React Course",
    "platform": "Udemy",
    "instructor": "John Doe",
    "duration": "40 hours",
    "price": "₹3,999" or "Free",
    "url": "https://...",
    "skillsCovered": ["React", "Hooks", "State Management"],
    "difficulty": "Beginner",
    "rating": 4.7,
    "whyRecommended": "Best for beginners, project-heavy",
    "priority": "high"
  }}
]`;

  const prompt = new PromptTemplate({
    template,
    inputVariables: ["skillsToLearn", "experienceLevel", "hoursPerWeek", "learningStyle", "availableCourses"]
  });

  return new LLMChain({ llm: models.factual, prompt });
};

// Helper function to parse JSON from LLM response
export const parseJSONResponse = (response) => {
  try {
    // Remove markdown code blocks if present
    let cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    console.error("Response:", response);
    throw new Error("Invalid JSON response from AI");
  }
};

export default {
  createSkillExtractionChain,
  createGapAnalysisChain,
  createRoadmapChain,
  createStrategyChain,
  createUniqueAngleChain,
  createCourseRecommendationChain,
  parseJSONResponse
};