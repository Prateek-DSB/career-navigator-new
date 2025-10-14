import { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import RoadmapDisplay from './components/RoadmapDisplay';
import { APP_CONFIG } from './config';
import { Compass, Sparkles } from 'lucide-react';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  const handleNewAnalysis = (result) => {
    setAnalysisResult(result);
    
    // Add to conversation history
    const newConversation = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      currentRole: result.userProfile?.currentRole || 'Unknown',
      targetRole: result.userProfile?.targetRole || 'Unknown',
      result: result
    };
    
    setConversationHistory(prev => [newConversation, ...prev]);
  };

  const handleSelectConversation = (conversation) => {
    setAnalysisResult(conversation.result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {APP_CONFIG.appName}
                </h1>
                <p className="text-sm text-gray-600">{APP_CONFIG.tagline}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4" />
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <Sidebar
          conversations={conversationHistory}
          onSelectConversation={handleSelectConversation}
          currentConversationId={analysisResult?.generatedAt}
        />

        {/* Main Area */}
        <main className="flex-1 p-6">
          {!analysisResult ? (
            <ChatInterface
              onAnalysisComplete={handleNewAnalysis}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          ) : (
            <RoadmapDisplay
              result={analysisResult}
              onStartNew={() => setAnalysisResult(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;