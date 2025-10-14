import { History, Clock } from 'lucide-react';

export default function Sidebar({ conversations, onSelectConversation, currentConversationId }) {
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (conversations.length === 0) return null;

  return (
    <aside className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4 text-gray-700">
        <History className="w-5 h-5" />
        <h2 className="font-semibold">History</h2>
      </div>

      <div className="space-y-2">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelectConversation(conv)}
            className={`w-full text-left p-3 rounded-lg transition ${
              conv.result?.generatedAt === currentConversationId
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
            }`}
          >
            <div className="text-sm font-medium text-gray-900 truncate">
              {conv.currentRole}
            </div>
            <div className="text-xs text-gray-600 truncate mt-1">
              → {conv.targetRole}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {formatDate(conv.timestamp)}
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}