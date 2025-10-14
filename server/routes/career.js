// API routes for career analysis

import express from 'express';
import {
  createSkillExtractionChain,
  createGapAnalysisChain,
  createRoadmapChain,
  createStrategyChain,
  createUniqueAngleChain,
  createCourseRecommendationChain,
  parseJSONResponse
} from '../langchain/chains.js';
import {
  searchJobs,
  searchCourses,
  searchTransitionStories
} from '../langchain/vectorStore.js';
import { loadSalaryData } from '../utils/dataLoader.js';

const router = express.Router();

// Main endpoint: Analyze career and generate complete roadmap
router.post('/analyze', async (req, res) => {
  try {
    const {
      currentRole,
      targetRole,
      additionalContext = '',
      hoursPerWeek = 10,
      location = 'India'
    } = req.body;

    if (!currentRole || !targetRole) {
      return res.status(400).json({
        error: 'currentRole and targetRole are required'
      });
    }

    console.log(`\n🎯 Analyzing career transition: ${currentRole} → ${targetRole}`);

    // Step 1: Extract skills from user input
    console.log('Step 1: Extracting skills...');
    const skillChain = createSkillExtractionChain();
    const skillExtraction = await skillChain.call({
      currentRole,
      targetRole,
      context: additionalContext
    });
    const userProfile = parseJSONResponse(skillExtraction.text);
    userProfile.hoursPerWeek = hoursPerWeek;
    userProfile.location = location;

    // Step 2: Search for relevant job descriptions
    console.log('Step 2: Searching job requirements...');
    const jobResults = await searchJobs(targetRole, 5);
    const jobRequirements = jobResults.map(doc => doc.pageContent).join('\n\n');

    // Step 3: Analyze skill gap
    console.log('Step 3: Analyzing skill gap...');
    const gapChain = createGapAnalysisChain();
    const gapAnalysis = await gapChain.call({
      currentSkills: JSON.stringify(userProfile.currentSkills),
      experienceLevel: userProfile.experienceLevel,
      domain: userProfile.domain,
      targetRole,
      jobRequirements
    });
    const skillGapData = parseJSONResponse(gapAnalysis.text);

    // Step 4: Search for relevant courses
    console.log('Step 4: Finding courses...');
    const skillsToLearn = skillGapData.skillsNeeded.map(s => s.skill).join(', ');
    const courseResults = await searchCourses(skillsToLearn, 15);
    const relevantCourses = courseResults.map(doc => ({
      content: doc.pageContent,
      metadata: doc.metadata
    }));

    // Step 5: Generate 6-month roadmap
    console.log('Step 5: Generating roadmap...');
    const roadmapChain = createRoadmapChain();
    const roadmapResult = await roadmapChain.call({
      currentRole,
      targetRole,
      skillsToLearn,
      hoursPerWeek,
      experienceLevel: userProfile.experienceLevel,
      relevantCourses: JSON.stringify(relevantCourses.slice(0, 12))
    });
    const roadmapData = parseJSONResponse(roadmapResult.text);

    // Step 6: Generate course recommendations
    console.log('Step 6: Recommending courses...');
    const courseChain = createCourseRecommendationChain();
    const courseRecommendations = await courseChain.call({
      skillsToLearn,
      experienceLevel: userProfile.experienceLevel,
      hoursPerWeek,
      learningStyle: 'balanced',
      availableCourses: JSON.stringify(relevantCourses)
    });
    const courses = parseJSONResponse(courseRecommendations.text);

    // Step 7: Load salary data
    console.log('Step 7: Loading salary insights...');
    const salaryData = await loadSalaryData(targetRole, location);

    // Step 8: Generate job search strategy
    console.log('Step 8: Creating job search strategy...');
    const strategyChain = createStrategyChain();
    const strategyResult = await strategyChain.call({
      currentRole,
      targetRole,
      location,
      experienceLevel: userProfile.experienceLevel,
      uniqueBackground: JSON.stringify(skillGapData.transferableSkills),
      salaryData: JSON.stringify(salaryData)
    });
    const strategy = parseJSONResponse(strategyResult.text);

    // Step 9: Search transition stories
    console.log('Step 9: Finding transition stories...');
    const transitionQuery = `${currentRole} to ${targetRole} career transition`;
    const storyResults = await searchTransitionStories(transitionQuery);
    const stories = storyResults.map(doc => doc.pageContent).join('\n\n');

    // Step 10: Generate unique angle
    console.log('Step 10: Crafting unique angle...');
    const angleChain = createUniqueAngleChain();
    const angleResult = await angleChain.call({
      currentRole,
      targetRole,
      transferableSkills: JSON.stringify(skillGapData.transferableSkills),
      experienceLevel: userProfile.experienceLevel,
      transitionStories: stories
    });
    const uniqueAngle = parseJSONResponse(angleResult.text);

    // Compile complete response
    const response = {
      userProfile,
      skillGapAnalysis: skillGapData,
      roadmap: roadmapData,
      courses: Array.isArray(courses) ? courses : [],
      salary: salaryData,
      jobSearchStrategy: strategy,
      uniqueAngle,
      generatedAt: new Date().toISOString()
    };

    console.log('✅ Career analysis complete!\n');
    res.json(response);

  } catch (error) {
    console.error('Error in career analysis:', error);
    res.status(500).json({
      error: 'Failed to analyze career path',
      details: error.message
    });
  }
});

// Endpoint: Get course recommendations for specific skills
router.post('/courses', async (req, res) => {
  try {
    const { skills, experienceLevel = 'mid' } = req.body;

    if (!skills) {
      return res.status(400).json({ error: 'skills parameter required' });
    }

    const courseResults = await searchCourses(skills, 10);
    const courses = courseResults.map(doc => ({
      content: doc.pageContent,
      metadata: doc.metadata
    }));

    res.json({ courses });

  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Endpoint: Get salary data for a role
router.get('/salary/:role', async (req, res) => {
  try {
    const { role } = req.params;
    const { location = 'India' } = req.query;

    const salaryData = await loadSalaryData(role, location);
    res.json(salaryData);

  } catch (error) {
    console.error('Error fetching salary data:', error);
    res.status(500).json({ error: 'Failed to fetch salary data' });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AI Career Navigator API'
  });
});
// Analytics endpoint
router.get('/analytics', async (req, res) => {
  try {
    const { getAnalyticsSummary } = await import('../utils/analyticsLoader.js');
    const summary = await getAnalyticsSummary();
    res.json(summary);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});
export default router;