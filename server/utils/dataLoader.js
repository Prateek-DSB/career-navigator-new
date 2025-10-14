// Utility functions for loading data from CSV/JSON files

import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';

// Load salary data from CSV
export async function loadSalaryData(role, location = 'India') {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'salary_data.csv');
    const csvData = await fs.readFile(dataPath, 'utf-8');
    const parsed = Papa.parse(csvData, { header: true });

    // Find matching salary data
    const matches = parsed.data.filter(row => 
      row.role?.toLowerCase().includes(role.toLowerCase()) ||
      role.toLowerCase().includes(row.role?.toLowerCase())
    );

    if (matches.length === 0) {
      // Return fallback data
      return createFallbackSalaryData(role, location);
    }

    // Find best match for location
    const locationMatch = matches.find(row =>
      row.city?.toLowerCase().includes(location.toLowerCase())
    ) || matches[0];

    return {
      role: locationMatch.role,
      location: locationMatch.city || location,
      salaryRange: `${locationMatch.currency || '₹'}${locationMatch.salary_min}-${locationMatch.salary_max}`,
      salaryMin: parseFloat(locationMatch.salary_min),
      salaryMax: parseFloat(locationMatch.salary_max),
      currency: locationMatch.currency || '₹',
      experienceLevel: locationMatch.experience_level || 'Mid-level',
      source: 'Internal Database',
      lastUpdated: locationMatch.last_updated || '2024'
    };

  } catch (error) {
    console.error('Error loading salary data:', error);
    return createFallbackSalaryData(role, location);
  }
}

// Create fallback salary data if file doesn't exist
function createFallbackSalaryData(role, location) {
  // Simple heuristics based on common roles
  const salaryRanges = {
    'frontend': { min: 8, max: 15, currency: '₹', unit: 'LPA' },
    'backend': { min: 10, max: 18, currency: '₹', unit: 'LPA' },
    'fullstack': { min: 12, max: 20, currency: '₹', unit: 'LPA' },
    'product': { min: 15, max: 30, currency: '₹', unit: 'LPA' },
    'data': { min: 10, max: 25, currency: '₹', unit: 'LPA' },
    'devops': { min: 12, max: 22, currency: '₹', unit: 'LPA' },
    'designer': { min: 6, max: 15, currency: '₹', unit: 'LPA' },
    'default': { min: 8, max: 15, currency: '₹', unit: 'LPA' }
  };

  const roleKey = Object.keys(salaryRanges).find(key =>
    role.toLowerCase().includes(key)
  ) || 'default';

  const range = salaryRanges[roleKey];

  return {
    role,
    location,
    salaryRange: `${range.currency}${range.min}-${range.max} ${range.unit}`,
    salaryMin: range.min,
    salaryMax: range.max,
    currency: range.currency,
    experienceLevel: 'Mid-level',
    source: 'Estimated',
    lastUpdated: new Date().getFullYear().toString(),
    note: 'These are estimated ranges. Actual salaries may vary based on company, experience, and skills.'
  };
}

// Load skills database
export async function loadSkillsDatabase() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'skills_database.json');
    const jsonData = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error loading skills database:', error);
    return createFallbackSkillsDatabase();
  }
}

// Fallback skills database
function createFallbackSkillsDatabase() {
  return {
    technical: {
      'React': {
        category: 'Frontend Framework',
        relatedSkills: ['JavaScript', 'JSX', 'Hooks', 'Redux'],
        learningTime: '8-12 weeks',
        difficulty: 'Intermediate'
      },
      'Node.js': {
        category: 'Backend',
        relatedSkills: ['JavaScript', 'Express', 'npm', 'REST APIs'],
        learningTime: '6-10 weeks',
        difficulty: 'Intermediate'
      },
      'Python': {
        category: 'Programming Language',
        relatedSkills: ['Data structures', 'Django', 'Flask'],
        learningTime: '8-12 weeks',
        difficulty: 'Beginner'
      }
    },
    softSkills: {
      'Communication': {
        importance: 'high',
        howToImprove: ['Public speaking', 'Writing', 'Active listening']
      },
      'Problem Solving': {
        importance: 'high',
        howToImprove: ['Practice coding', 'Puzzle solving', 'Critical thinking']
      }
    }
  };
}

// Load job descriptions
export async function loadJobDescriptions() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'job_descriptions.csv');
    const csvData = await fs.readFile(dataPath, 'utf-8');
    const parsed = Papa.parse(csvData, { header: true });
    return parsed.data.filter(row => row.role && row.skills_required);
  } catch (error) {
    console.error('Error loading job descriptions:', error);
    return [];
  }
}

// Load course catalog
export async function loadCourseCatalog() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'course_catalog.csv');
    const csvData = await fs.readFile(dataPath, 'utf-8');
    const parsed = Papa.parse(csvData, { header: true });
    return parsed.data.filter(row => row.course_name && row.skills_covered);
  } catch (error) {
    console.error('Error loading course catalog:', error);
    return [];
  }
}

export default {
  loadSalaryData,
  loadSkillsDatabase,
  loadJobDescriptions,
  loadCourseCatalog
};