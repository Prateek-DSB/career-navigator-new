import { useState } from 'react';
import axios from 'axios';
import { APP_CONFIG } from '../config';
import { Send, Loader2, Sparkles, MapPin, Clock, Lightbulb } from 'lucide-react';

export default function ChatInterface({ onAnalysisComplete, isLoading, setIsLoading }) {
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('10');
  const [location, setLocation] = useState('Bangalore');
  const [additionalContext, setAdditionalContext] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!currentRole.trim() || !targetRole.trim()) {
      setError('Please fill in both current and target roles');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${APP_CONFIG.apiUrl}/api/career/analyze`,
        {
          currentRole: currentRole.trim(),
          targetRole: targetRole.trim(),
          hoursPerWeek: parseInt(hoursPerWeek) || 10,
          location: location.trim(),
          additionalContext: additionalContext.trim()
        }
      );

      onAnalysisComplete(response.data);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(
        err.response?.data?.error || 
        'Failed to generate roadmap. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fillExample = (example) => {
    setCurrentRole(example.current);
    setTargetRole(example.target);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Welcome Section */}
      {APP_CONFIG.ui.showWelcomeMessage && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Your Career Journey! 🚀
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Tell me about your current role and dream job. I'll create a personalized 
                6-month learning roadmap with specific courses, projects, salary insights, 
                and job search strategies tailored just for you.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What's your current role or background? *
            </label>
            <input
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="e.g., Final year Computer Science student, Marketing Manager, Mechanical Engineer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              disabled={isLoading}
            />
          </div>

          {/* Target Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What's your dream job or target role? *
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Frontend Developer, Product Manager, Data Scientist"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              disabled={isLoading}
            />
          </div>

          {/* Additional Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hours Per Week */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Hours per week for learning
              </label>
              <input
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                min="5"
                max="40"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={isLoading}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Your location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or Country"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Additional Context */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Any additional context? (Optional)
            </label>
            <textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="e.g., I have some Python experience, prefer free courses, interested in remote work..."
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Crafting Your Roadmap...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Generate My 6-Month Roadmap
              </>
            )}
          </button>
        </form>

        {/* Example Prompts */}
        {APP_CONFIG.examplePrompts && APP_CONFIG.examplePrompts.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <h3 className="text-sm font-semibold text-gray-700">
                Try an example:
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {APP_CONFIG.examplePrompts.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => fillExample(example)}
                  disabled={isLoading}
                  className="text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-gray-700">{example.current}</div>
                  <div className="text-gray-500 text-xs mt-1">→ {example.target}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <h3 className="font-semibold text-blue-900">Analyzing Your Career Path...</h3>
          </div>
          <div className="space-y-2 text-sm text-blue-800">
            <p>✓ Extracting your current skills</p>
            <p>✓ Analyzing skill gaps for target role</p>
            <p>✓ Searching for relevant courses</p>
            <p>✓ Creating your personalized roadmap</p>
            <p>✓ Generating job search strategy</p>
          </div>
          <p className="mt-3 text-xs text-blue-600">This usually takes 20-30 seconds...</p>
        </div>
      )}
    </div>
  );
}