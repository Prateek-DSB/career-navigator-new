import { ExternalLink, Star, Clock, DollarSign } from 'lucide-react';

export default function CourseCard({ course }) {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition hover:border-blue-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-gray-900 text-lg leading-tight flex-1 pr-2">
          {course.courseName || course.name || 'Course'}
        </h3>
        {course.priority && (
          <span className={`px-2 py-1 text-xs font-semibold rounded border ${getPriorityColor(course.priority)}`}>
            {course.priority}
          </span>
        )}
      </div>

      {/* Platform & Instructor */}
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
        <span className="font-medium">{course.platform || 'Online'}</span>
        {course.instructor && (
          <>
            <span>•</span>
            <span>{course.instructor}</span>
          </>
        )}
      </div>

      {/* Skills */}
      {course.skillsCovered && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {(Array.isArray(course.skillsCovered) 
              ? course.skillsCovered 
              : course.skillsCovered.split(',').map(s => s.trim())
            ).slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
        {course.duration && (
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.duration}
          </span>
        )}
        {course.rating && (
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            {course.rating}
          </span>
        )}
        {course.difficulty && (
          <span className={`px-2 py-0.5 text-xs font-medium rounded ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty}
          </span>
        )}
      </div>

      {/* Price */}
      {course.price && (
        <div className="mb-3">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
            course.price.toLowerCase() === 'free' 
              ? 'bg-green-100 text-green-700'
              : 'bg-orange-100 text-orange-700'
          }`}>
            <DollarSign className="w-4 h-4" />
            {course.price}
          </span>
        </div>
      )}

      {/* Why Recommended */}
      {course.whyRecommended && (
        <p className="text-sm text-gray-600 mb-3 italic">
          "{course.whyRecommended}"
        </p>
      )}

      {/* CTA */}
      {course.url && (
        <a
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium w-full justify-center"
        >
          View Course
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}