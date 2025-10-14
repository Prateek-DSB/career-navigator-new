import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

export default function SkillGapChart({ data }) {
  const gapScore = data.gapScore || 0;
  const currentSkills = data.currentSkills || [];
  const skillsNeeded = data.skillsNeeded || [];
  const transferableSkills = data.transferableSkills || [];

  return (
    <div className="space-y-6">
      {/* Gap Score */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Overall Readiness Score</h4>
          <span className="text-3xl font-bold text-blue-600">{gapScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 rounded-full transition-all duration-1000 ${
              gapScore >= 70 ? 'bg-green-500' : gapScore >= 40 ? 'bg-yellow-500' : 'bg-orange-500'
            }`}
            style={{ width: `${gapScore}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {gapScore >= 70 && "You're in great shape! Focus on building your portfolio."}
          {gapScore >= 40 && gapScore < 70 && "You're on the right track. Keep learning!"}
          {gapScore < 40 && "Don't worry! Everyone starts somewhere. Your roadmap will guide you."}
        </p>
      </div>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Current Skills */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-900">Skills You Have ✅</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentSkills.length > 0 ? (
              currentSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-green-700">Starting fresh - that's okay!</p>
            )}
          </div>
        </div>

        {/* Skills Needed */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Circle className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Skills to Learn 📚</h4>
          </div>
          <div className="space-y-2">
            {skillsNeeded.length > 0 ? (
              skillsNeeded.slice(0, 8).map((skillObj, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-blue-100 px-3 py-2 rounded"
                >
                  <span className="text-sm font-medium text-blue-900">
                    {skillObj.skill || skillObj}
                  </span>
                  {skillObj.priority && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        skillObj.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : skillObj.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {skillObj.priority}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-blue-700">Loading skills...</p>
            )}
          </div>
        </div>
      </div>

      {/* Transferable Skills */}
      {transferableSkills.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <ArrowRight className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-purple-900">Transferable Skills 🔄</h4>
          </div>
          <p className="text-sm text-purple-700 mb-3">
            These skills from your current role will help you in your new career:
          </p>
          <div className="space-y-3">
            {transferableSkills.map((skillObj, idx) => (
              <div key={idx} className="bg-purple-100 rounded p-3">
                <div className="font-medium text-purple-900 text-sm">
                  {skillObj.skill || skillObj}
                </div>
                {skillObj.howItHelps && (
                  <div className="text-xs text-purple-700 mt-1">
                    {skillObj.howItHelps}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}