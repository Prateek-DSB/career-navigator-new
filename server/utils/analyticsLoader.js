// Analytics data loader for career growth navigator

import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';

// Load analytics data from CSV
export async function loadAnalyticsData() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'career_growth_navigator_analytics.csv');
    const csvData = await fs.readFile(dataPath, 'utf-8');
    const parsed = Papa.parse(csvData, { header: true });
    
    return parsed.data.filter(row => row.user_id && row.current_role);
  } catch (error) {
    console.error('Error loading analytics data:', error);
    return [];
  }
}

// Get analytics summary
export async function getAnalyticsSummary() {
  const data = await loadAnalyticsData();
  
  if (data.length === 0) {
    return {
      totalUsers: 0,
      averageGapScore: 0,
      topTransitions: [],
      averageTimeSpent: 0,
      conversionRate: 0
    };
  }

  const totalUsers = data.length;
  const averageGapScore = data.reduce((sum, row) => sum + parseFloat(row.gap_score || 0), 0) / totalUsers;
  const averageTimeSpent = data.reduce((sum, row) => sum + parseFloat(row.time_spent_seconds || 0), 0) / totalUsers;
  
  const completedUsers = data.filter(row => row.conversion_status === 'completed').length;
  const conversionRate = (completedUsers / totalUsers) * 100;

  // Count transitions
  const transitions = {};
  data.forEach(row => {
    const key = `${row.current_role} → ${row.target_role}`;
    transitions[key] = (transitions[key] || 0) + 1;
  });

  const topTransitions = Object.entries(transitions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([transition, count]) => ({ transition, count }));

  return {
    totalUsers,
    averageGapScore: averageGapScore.toFixed(1),
    topTransitions,
    averageTimeSpent: Math.round(averageTimeSpent),
    conversionRate: conversionRate.toFixed(1)
  };
}

export default {
  loadAnalyticsData,
  getAnalyticsSummary
};