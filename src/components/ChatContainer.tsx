import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Plus, Trash2, History, ChevronLeft, ChevronRight } from 'lucide-react';
import useChatStore from '../stores/chatStore';
import { groqChatService } from '../services/groqChatService';

const ChatContainer: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    sessions,
    currentSessionId,
    isOpen,
    getCurrentSession,
    addMessage,
    createNewSession,
    deleteSession,
    openChat,
    closeChat,
    setCurrentSession,
  } = useChatStore();

  const currentSession = getCurrentSession();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentSession) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message
    addMessage(userMessage, 'user');
    
    // Get AI response using Groq
    setIsTyping(true);
    try {
      // Build conversation history for context
      const conversationHistory = currentSession.messages.slice(-6).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const response = await groqChatService.generateResponse(
        userMessage,
        undefined,
        conversationHistory
      );
      
      addMessage(response.content, 'assistant');
    } catch (error) {
      console.error('Chat error:', error);
      addMessage('I can help with career questions. Please try again.', 'assistant');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = async () => {
    await createNewSession();
    setShowSidebar(false); // Close sidebar after creating new chat
  };

  const handleDeleteChat = (sessionId: string) => {
    if (deleteConfirmId === sessionId) {
      deleteSession(sessionId);
      setDeleteConfirmId(null);
      if (sessions.length <= 1) {
        setShowSidebar(false);
      }
    } else {
      setDeleteConfirmId(sessionId);
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  const handleSwitchChat = (sessionId: string) => {
    setCurrentSession(sessionId);
    setShowSidebar(false);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const getChatPreview = (session: any) => {
    if (session.messages.length === 0) {
      return 'New chat';
    }
    const lastMessage = session.messages[session.messages.length - 1];
    return lastMessage.content.length > 50 
      ? lastMessage.content.substring(0, 50) + '...'
      : lastMessage.content;
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <button
        data-chat-container
        onClick={() => openChat()}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-50"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div 
      data-chat-container
      className={`fixed bottom-6 right-6 ${showSidebar ? 'w-[700px]' : 'w-96'} h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex z-50 transition-all duration-300`}
    >
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Chat History</h3>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-1 hover:bg-gray-200 rounded"
                title="Close sidebar"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {sessions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No chat history yet</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      session.id === currentSessionId
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div 
                        className="flex-1 min-w-0"
                        onClick={() => handleSwitchChat(session.id)}
                      >
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {session.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {getChatPreview(session)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(session.updatedAt)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChat(session.id);
                        }}
                        className={`ml-2 p-1 rounded hover:bg-red-100 transition-colors ${
                          deleteConfirmId === session.id
                            ? 'text-red-600 bg-red-50'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                        title={deleteConfirmId === session.id ? 'Click again to confirm delete' : 'Delete chat'}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    {deleteConfirmId === session.id && (
                      <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                        Click delete again to confirm
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              New Chat
            </button>
          </div>
        </div>
      )}
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            {!showSidebar && (
              <button
                onClick={() => setShowSidebar(true)}
                className="p-1 hover:bg-blue-700 rounded mr-1"
                title="Show chat history"
              >
                <History size={16} />
              </button>
            )}
            <MessageCircle size={20} />
            <h3 className="font-semibold">AI Career Assistant</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="p-1 hover:bg-blue-700 rounded"
              title="New chat"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={() => closeChat()}
              className="p-1 hover:bg-blue-700 rounded"
              title="Close chat"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Current Chat Info */}
        {currentSession && sessions.length > 1 && (
          <div className="border-b border-gray-200 p-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm text-gray-900">{currentSession.title}</h4>
                <p className="text-xs text-gray-500">
                  {currentSession.messages.length} messages • {formatDate(currentSession.updatedAt)}
                </p>
              </div>
              {!showSidebar && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <ChevronRight size={12} />
                  View All
                </button>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!currentSession?.messages.length ? (
            <div className="text-center text-gray-500 mt-8">
              <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-sm">Start a conversation with your AI career assistant!</p>
              <p className="text-xs mt-2">Ask about job searches, resume tips, interview prep, and more.</p>
            </div>
          ) : (
            <>
              {currentSession.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about jobs, resumes, interviews..."
              className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '38px', maxHeight: '100px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
