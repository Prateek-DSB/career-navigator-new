import { Calendar, BookOpen, Code, Clock } from 'lucide-react';

export default function RoadmapTimeline({ roadmap }) {
  if (!roadmap) {
    return <div className="text-center py-12 text-gray-500">No roadmap data available</div>;
  }

  // Extract months 1-6 from roadmap
  const months = Object.keys(roadmap)
    .filter(key => key.startsWith('month'))
    .sort()
    .map(key => ({
      number: parseInt(key.replace('month', '')),
      ...roadmap[key]
    }));

  if (months.length === 0) {
    return <div className="text-center py-12 text-gray-500">No monthly data available</div>;
  }

  return (
    <div className="space-y-6">
      {months.map((month, idx) => (
        <div
          key={month.number}
          className="relative bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
        >
          {/* Timeline connector */}
          {idx < months.length - 1 && (
            <div className="absolute left-8 top-full w-0.5 h-6 bg-gray-300" />
          )}

          {/* Month Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                idx === 0 ? 'bg-blue-500' : idx === months.length - 1 ? 'bg-green-500' : 'bg-indigo-500'
              }`}>
                <span className="text-white font-bold">M{month.number}</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Month {month.number}: {month.focus}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {month.hoursPerWeek} hrs/week
                </span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-4 ml-20">
            {/* Courses */}
            {month.courses && month.courses.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Courses</h4>
                </div>
                <ul className="space-y-2">
                  {month.courses.map((course, courseIdx) => (
                    <li key={courseIdx} className="text-sm">
                      <div className="font-medium text-blue-900">
                        {course.name || course}
                      </div>
                      {course.platform && (
                        <div className="text-xs text-blue-700">
                          {course.platform} • {course.hours}h
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Project */}
            {month.project && (
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-4 h-4 text-green-600" />
                  <h4 className="font-semibold text-green-900">Project</h4>
                </div>
                <p className="text-sm text-green-800">{month.project}</p>
              </div>
            )}
          </div>

          {/* Milestones */}
          {month.milestones && month.milestones.length > 0 && (
            <div className="ml-20 mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Milestones:</h4>
              <ul className="space-y-1">
                {month.milestones.map((milestone, milestoneIdx) => (
                  <li key={milestoneIdx} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{milestone}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}

      {/* Summary */}
      {roadmap.keyTakeaway && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="bg-green-500 p-2 rounded-full">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">After 6 Months</h3>
              <p className="text-gray-700">{roadmap.keyTakeaway}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}