import { TrendingUp, MapPin, Briefcase, DollarSign } from 'lucide-react';

export default function SalaryInsights({ data }) {
  if (!data) {
    return <div className="text-center py-8 text-gray-500">No salary data available</div>;
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Main Salary Card */}
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-green-500 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-gray-900">Expected Salary Range</h4>
          </div>
          
          <div className="mb-4">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {data.salaryRange || `${data.currency}${data.salaryMin}-${data.salaryMax}`}
            </div>
            <div className="text-sm text-gray-600">
              {data.experienceLevel || 'Mid-level'} • {data.location || 'India'}
            </div>
          </div>

          {data.note && (
            <p className="text-xs text-gray-500 italic">{data.note}</p>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-gray-700">Role</div>
                <div className="text-gray-900">{data.role}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-gray-700">Location</div>
                <div className="text-gray-900">{data.location || 'Various'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-gray-700">Data Source</div>
                <div className="text-gray-900 text-sm">
                  {data.source} • {data.lastUpdated}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      {data.factors && (
        <div className="mt-4 pt-4 border-t border-green-200">
          <p className="text-sm text-gray-700">
            <strong>Factors:</strong> {data.factors}
          </p>
        </div>
      )}

      {data.negotiationTip && (
        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-3">
          <p className="text-sm text-yellow-900">
            <strong>💡 Negotiation Tip:</strong> {data.negotiationTip}
          </p>
        </div>
      )}
    </div>
  );
}