import { useState } from 'react';
import { ArrowLeft, Download, TrendingUp, BookOpen, Briefcase, Sparkles } from 'lucide-react';
import SkillGapChart from './SkillGapChart';
import RoadmapTimeline from './RoadmapTimeline';
import CourseCard from './CourseCard';
import SalaryInsights from './SalaryInsights';
import { APP_CONFIG } from '../config';

export default function RoadmapDisplay({ result, onStartNew }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'roadmap', label: '6-Month Plan', icon: BookOpen },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'strategy', label: 'Job Strategy', icon: Briefcase }
  ];

  const exportRoadmap = () => {
    const content = `
AI CAREER NAVIGATOR - ROADMAP
Generated: ${new Date(result.generatedAt).toLocaleString()}

FROM: ${result.userProfile?.currentRole || 'N/A'}
TO: ${result.userProfile?.targetRole || 'N/A'}

=== SKILL GAP ANALYSIS ===
Gap Score: ${result.skillGapAnalysis?.gapScore || 0}/100

Current Skills:
${result.skillGapAnalysis?.currentSkills?.join(', ') || 'N/A'}

Skills to Learn:
${result.skillGapAnalysis?.skillsNeeded?.map(s => `- ${s.skill} (${s.priority})`).join('\n') || 'N/A'}

=== 6-MONTH ROADMAP ===
${Object.entries(result.roadmap || {}).filter(([k]) => k.startsWith('month')).map(([month, data]) => `
${month.toUpperCase()}:
Focus: ${data.focus}
Hours/Week: ${data.hoursPerWeek}
Project: ${data.project}
`).join('\n')}

=== RECOMMENDED COURSES ===
${(result.courses || []).slice(0, 10).map((c, i) => `
${i + 1}. ${c.courseName} (${c.platform})
   Skills: ${c.skillsCovered?.join(', ')}
   Duration: ${c.duration} | Price: ${c.price}
   URL: ${c.url}
`).join('\n')}

=== SALARY INSIGHTS ===
Role: ${result.salary?.role}
Range: ${result.salary?.salaryRange}
Location: ${result.salary?.location}

=== YOUR UNIQUE ANGLE ===
${result.uniqueAngle?.uniqueValue || ''}

${result.uniqueAngle?.elevatorPitch || ''}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-roadmap-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Your Personalized Roadmap</h2>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-medium">
                {result.userProfile?.currentRole || 'Current Role'}
              </span>
              <span>→</span>
              <span className="font-medium text-blue-600">
                {result.userProfile?.targetRole || 'Target Role'}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {APP_CONFIG.features.exportRoadmap && (
              <button
                onClick={exportRoadmap}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition flex items-center gap-2 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
            <button
              onClick={onStartNew}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              New Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab result={result} />}
          {activeTab === 'roadmap' && <RoadmapTab result={result} />}
          {activeTab === 'courses' && <CoursesTab result={result} />}
          {activeTab === 'strategy' && <StrategyTab result={result} />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ result }) {
  return (
    <div className="space-y-8">
      {/* TL;DR */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">📋 Bottom Line Up Front</h3>
        <p className="text-gray-700 leading-relaxed">
          {result.skillGapAnalysis?.summary || result.roadmap?.keyTakeaway ||
            'Your personalized career transition roadmap is ready!'}
        </p>
      </div>

      {/* Skill Gap Analysis */}
      {APP_CONFIG.features.skillGapVisualization && result.skillGapAnalysis && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Skill Gap Analysis</h3>
          <SkillGapChart data={result.skillGapAnalysis} />
        </div>
      )}

      {/* Salary Insights */}
      {APP_CONFIG.features.salaryInsights && result.salary && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Salary Expectations</h3>
          <SalaryInsights data={result.salary} />
        </div>
      )}

      {/* Unique Angle */}
      {APP_CONFIG.features.uniqueAngle && result.uniqueAngle && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-purple-900 mb-3">✨ Your Unique Angle</h3>
          <div className="space-y-3 text-gray-700">
            <p><strong>Your Superpower:</strong> {result.uniqueAngle.superpower}</p>
            <p><strong>Positioning:</strong> {result.uniqueAngle.positioning}</p>
            <div className="bg-white rounded p-4 mt-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">Elevator Pitch:</p>
              <p className="italic">{result.uniqueAngle.elevatorPitch}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RoadmapTab({ result }) {
  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Time Commitment:</strong> {result.userProfile?.hoursPerWeek || 10} hours/week for 6 months
        </p>
      </div>
      <RoadmapTimeline roadmap={result.roadmap} />
    </div>
  );
}

function CoursesTab({ result }) {
  const courses = result.courses || [];
  
  if (courses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No course recommendations available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Here are {courses.length} carefully selected courses to help you master the required skills:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course, idx) => (
          <CourseCard key={idx} course={course} />
        ))}
      </div>
    </div>
  );
}

function StrategyTab({ result }) {
  const strategy = result.jobSearchStrategy;

  if (!strategy) {
    return <div className="text-center py-12 text-gray-500">Strategy data not available</div>;
  }

  return (
    <div className="space-y-6">
      {/* When to Start */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">🎯 When to Start Applying</h3>
        <p className="text-blue-800">
          Month {strategy.startApplyingMonth} - Don't wait until you feel "ready"! Start applying 
          when you've completed the foundational skills.
        </p>
      </div>

      {/* Target Companies */}
      {strategy.targetCompanies && (
        <div>
          <h3 className="font-bold text-gray-900 mb-3">🏢 Target Companies</h3>
          <div className="flex flex-wrap gap-2">
            {strategy.targetCompanies.map((company, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Networking */}
      {strategy.networking && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-bold text-green-900 mb-3">🤝 Networking Strategy</h3>
          <p className="text-green-800 mb-3">{strategy.networking.strategy}</p>
          <div>
            <p className="font-semibold text-green-900 text-sm mb-2">Join these communities:</p>
            <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
              {strategy.networking.communities?.map((community, idx) => (
                <li key={idx}>{community}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Application Strategy */}
      {strategy.applicationStrategy && (
        <div>
          <h3 className="font-bold text-gray-900 mb-3">📝 Application Strategy</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <p><strong>Approach:</strong> {strategy.applicationStrategy.approach}</p>
            <p><strong>Weekly Applications:</strong> {strategy.applicationStrategy.weeklyApplications}</p>
            <p><strong>Follow Up:</strong> {strategy.applicationStrategy.followUp}</p>
          </div>
        </div>
      )}

      {/* Interview Prep */}
      {strategy.interviewPrep && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="font-bold text-orange-900 mb-3">🎤 Interview Preparation</h3>
          <p className="text-orange-800 mb-3">
            <strong>Timeline:</strong> {strategy.interviewPrep.timeline}
          </p>
          <div className="space-y-2">
            <p className="font-semibold text-orange-900 text-sm">Focus Areas:</p>
            <ul className="list-disc list-inside space-y-1 text-orange-800 text-sm">
              {strategy.interviewPrep.focusAreas?.map((area, idx) => (
                <li key={idx}>{area}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}