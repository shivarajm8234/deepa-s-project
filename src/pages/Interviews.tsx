import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Plus,
  Star,
  MessageSquare,
  Users,
  Brain,
  Timer,
  Trophy,
  Mic,
  MicOff,
  Send
} from 'lucide-react';
import { groqChatService } from '../services/groqChatService';
import { ChatMessage, MockInterviewSession } from '../types/chat';
import { interviewService } from '../services/interviewService';

interface MockInterviewTemplate {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  questions_count: number;
  rating: number;
  completions: number;
  category: string;
}

interface MockInterview {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  score?: number;
  status: 'completed' | 'in-progress' | 'not-started';
  completed_at?: string;
  duration_minutes: number;
  feedback?: string;
}

const Interviews: React.FC = () => {
  
  // Mock interview state
  const [mockInterviewSession, setMockInterviewSession] = useState<MockInterviewSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = React.useRef<any>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [mockTemplates, setMockTemplates] = useState<MockInterviewTemplate[]>([]);
  const [mockInterviews, setMockInterviews] = useState<MockInterview[]>([]);
  const [showCustomInterviewModal, setShowCustomInterviewModal] = useState(false);
  const [customRole, setCustomRole] = useState('');
  const [customTopics, setCustomTopics] = useState('');
  const [customDifficulty, setCustomDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [customDuration, setCustomDuration] = useState(15);
  const [questionCount, setQuestionCount] = useState(0);
  const [maxQuestions] = useState(20);

  // Start a new mock interview
  const startMockInterview = async (template: MockInterviewTemplate) => {
    try {
      setIsInterviewActive(true);
      setQuestionCount(1); // Reset question counter
      
      const response = await groqChatService.generateResponse(
        `Start a ${template.difficulty} ${template.category} mock interview on ${template.title}`,
        { type: 'mock_interview', confidence: 1, entities: { type: template.title.toLowerCase(), difficulty: template.difficulty } },
        [], // Empty conversation history for new interview
        1 // First question
      );
      
      setChatMessages([response]);
      
      const newSession: MockInterviewSession = {
        id: `session-${Date.now()}`,
        title: template.title,
        questions: [],
        currentQuestionIndex: 0,
        userAnswers: {},
        startTime: new Date(),
        status: 'in_progress'
      };
      
      setMockInterviewSession(newSession);
      setTimeRemaining(template.duration_minutes * 60);
    } catch (error) {
      console.error('Error starting mock interview:', error);
      setChatMessages([{
        id: `error-${Date.now()}`,
        content: 'Failed to start the mock interview. Please try again.',
        sender: 'assistant',
        timestamp: new Date(),
        type: 'error'
      }]);
    }
  };
  
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: message,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentAnswer('');
    
    try {
      // Build conversation history for context
      const conversationHistory = chatMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // Get current interview context
      const interviewContext = mockInterviewSession ? {
        type: 'mock_interview' as const,
        confidence: 1,
        entities: { 
          type: mockInterviewSession.title.toLowerCase(),
          difficulty: 'intermediate' // You can make this dynamic based on template
        }
      } : { type: 'mock_interview' as const, confidence: 1, entities: {} };
      
      const nextQuestionCount = questionCount + 1;
      
      const response = await groqChatService.generateResponse(
        message,
        interviewContext,
        conversationHistory,
        nextQuestionCount
      );
      
      // Update question count
      setQuestionCount(nextQuestionCount);
      
      setChatMessages(prev => [...prev, response]);
      
      // Auto-end interview if we've reached the question limit or if it's an evaluation
      if (nextQuestionCount >= maxQuestions || response.type === 'evaluation' && response.metadata?.evaluation) {
        if (mockInterviewSession) {
          const updatedSession: MockInterviewSession = {
            ...mockInterviewSession,
            status: 'completed',
            endTime: new Date(),
            evaluation: {
              overallScore: response.metadata.evaluation.score || 0,
              feedback: response.metadata.evaluation.feedback,
              questionEvaluations: []
            }
          };
          
          setMockInterviewSession(updatedSession);
          setIsInterviewActive(false);

          const newMockInterview: MockInterview = {
            id: updatedSession.id,
            title: updatedSession.title,
            category: 'Mock Interview',
            difficulty: 'intermediate', // This should be dynamic based on the template
            status: 'completed',
            completed_at: new Date().toISOString(),
            duration_minutes: Math.round(((updatedSession.endTime || new Date()).getTime() - updatedSession.startTime.getTime()) / 60000),
            score: response.metadata.evaluation.score,
            feedback: response.metadata.evaluation.feedback,
          };

          setMockInterviews(prev => [newMockInterview, ...prev]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        content: 'Failed to send your message. Please try again.',
        sender: 'assistant',
        timestamp: new Date(),
        type: 'error'
      }]);
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Speech recognition is not supported in this browser.');
        return;
      }
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsRecording(true);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        setCurrentAnswer(transcript);
      };

      recognitionRef.current.start();
    }
  };

  const endMockInterview = () => {
    if (mockInterviewSession) {
      const updatedSession: MockInterviewSession = {
        ...mockInterviewSession,
        status: 'completed',
        endTime: new Date()
      };
      
      setMockInterviewSession(updatedSession);
      setIsInterviewActive(false);
      
      const finalMessage: ChatMessage = {
        id: `sys-${Date.now()}`,
        content: 'Mock interview completed. Would you like to review your performance or start a new one?',
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text',
        metadata: {
          suggestions: ['Review performance', 'Start new interview', 'View tips']
        }
      };
      
      setChatMessages(prev => [...prev, finalMessage]);
    }
  };

  useEffect(() => {
    const fetchTemplates = () => {
      const templates = interviewService.getMockInterviewTemplates();
      setMockTemplates(templates);
    };
    fetchTemplates();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInterviewActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endMockInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInterviewActive, timeRemaining]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartCustomInterview = async () => {
    if (!customRole || !customTopics) {
      // Basic validation
      alert('Please fill in both Role/Position and Topics to Cover.');
      return;
    }

    try {
      setIsInterviewActive(true);
      setShowCustomInterviewModal(false);
      setQuestionCount(1); // Reset question counter

      const prompt = `Start a custom mock interview for a '${customRole}' position. The topics to cover are '${customTopics}'. The difficulty should be '${customDifficulty}' and the total duration should be ${customDuration} minutes.`;
      
      const response = await groqChatService.generateResponse(
        prompt,
        { type: 'mock_interview', confidence: 1, entities: { type: customTopics.toLowerCase(), difficulty: customDifficulty } },
        [], // Empty conversation history for new interview
        1 // First question
      );
      
      setChatMessages([response]);
      
      const newSession: MockInterviewSession = {
        id: `session-${Date.now()}`,
        title: `Custom Interview: ${customRole}`,
        questions: [],
        currentQuestionIndex: 0,
        userAnswers: {},
        startTime: new Date(),
        status: 'in_progress'
      };
      
      setMockInterviewSession(newSession);
      setTimeRemaining(customDuration * 60);

      // Reset form fields
      setCustomRole('');
      setCustomTopics('');
      setCustomDifficulty('intermediate');
      setCustomDuration(15);

    } catch (error) {
      console.error('Error starting custom mock interview:', error);
      setChatMessages([{
        id: `error-${Date.now()}`,
        content: 'Failed to start the custom mock interview. Please try again.',
        sender: 'assistant',
        timestamp: new Date(),
        type: 'error'
      }]);
      setIsInterviewActive(false); // Reset active state on error
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between pb-6 border-b">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Mock Interviews</h1>
            <p className="text-lg text-gray-500">Practice with AI-powered mock interview sessions.</p>
          </div>
          <button 
            onClick={() => setShowCustomInterviewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Custom Interview
          </button>
        </header>

        {isInterviewActive ? (
          <div className="mt-8 bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">{mockInterviewSession?.title}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center text-blue-600 font-semibold">
                  <span className="text-sm">Question {questionCount}/{maxQuestions}</span>
                </div>
                <div className="flex items-center text-red-500 font-semibold">
                  <Timer className="w-5 h-5 mr-2" />
                  <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
                </div>
                <button 
                  onClick={endMockInterview}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  End Interview
                </button>
              </div>
            </div>
            <div className="flex flex-col h-[600px] overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-3/4 rounded-lg px-4 py-2 ${
                        message.sender === 'user' 
                          ? 'bg-indigo-600 text-white' 
                          : message.type === 'evaluation'
                            ? 'bg-green-100 border border-green-200 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.content.split('\n').map((line: string, i: number) => (
                        <p key={i} className="mb-2 last:mb-0">{line}</p>
                      ))}
                      {message.type === 'evaluation' && message.metadata?.evaluation && (
                        <div className="mt-3 pt-3 border-t border-green-300">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-green-700">Final Score:</span>
                            <span className="text-2xl font-bold text-green-800">
                              {message.metadata.evaluation.score}/100
                            </span>
                          </div>
                        </div>
                      )}
                      {message.metadata?.suggestions && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="flex flex-wrap gap-2">
                            {message.metadata.suggestions.map((suggestion: string, i: number) => (
                              <button
                                key={i}
                                onClick={() => sendMessage(suggestion)}
                                className="text-xs px-2 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 p-4">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (currentAnswer.trim()) {
                      sendMessage(currentAnswer);
                    }
                  }}
                  className="flex space-x-2"
                >
                  <div className="relative flex-1">
                    <textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(currentAnswer);
                        }
                      }}
                      placeholder="Type your answer (Shift + Enter for new line)..."
                      className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      rows={1}
                    />
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={`absolute left-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                        isRecording ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title={isRecording ? 'Stop recording' : 'Record audio'}
                    >
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                    disabled={!currentAnswer.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockTemplates.map(template => (
                <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{template.duration_minutes} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm">{template.questions_count} questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">{template.rating}/5</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{template.completions} completed</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                      {template.category}
                    </span>
                    <button
                      onClick={() => startMockInterview(template)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Brain className="w-4 h-4" />
                      Start AI Interview
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {mockInterviews.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Mock Interview History</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {mockInterviews.map(mockInterview => (
                    <div key={mockInterview.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{mockInterview.title}</h4>
                          <p className="text-gray-600 text-sm">{mockInterview.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {mockInterview.score && (
                            <div className="flex items-center gap-1">
                              <Trophy className="w-4 h-4 text-yellow-500" />
                              <span className="font-semibold text-gray-900">{mockInterview.score}/100</span>
                            </div>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            mockInterview.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {mockInterview.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        <p>Completed: {mockInterview.completed_at ? new Date(mockInterview.completed_at).toLocaleDateString() : 'N/A'}</p>
                        <p>Duration: {mockInterview.duration_minutes} minutes</p>
                      </div>
                      {mockInterview.feedback && (
                        <div className="bg-indigo-50 rounded-lg p-3">
                          <p className="text-indigo-800 text-sm">{mockInterview.feedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {showCustomInterviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Custom Mock Interview</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleStartCustomInterview(); }}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="customRole" className="block text-sm font-medium text-gray-700">Role / Position</label>
                    <input
                      type="text"
                      id="customRole"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      placeholder="e.g., Senior Frontend Developer"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="customTopics" className="block text-sm font-medium text-gray-700">Topics to Cover</label>
                    <input
                      type="text"
                      id="customTopics"
                      value={customTopics}
                      onChange={(e) => setCustomTopics(e.target.value)}
                      placeholder="e.g., React, TypeScript, System Design"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="customDifficulty" className="block text-sm font-medium text-gray-700">Difficulty</label>
                    <select
                      id="customDifficulty"
                      value={customDifficulty}
                      onChange={(e) => setCustomDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="customDuration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                    <input
                      type="number"
                      id="customDuration"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(parseInt(e.target.value, 10))}
                      min="5"
                      max="60"
                      step="5"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCustomInterviewModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Start Interview
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interviews;