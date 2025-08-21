import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  Lock,
  Upload,
  FileText
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';
import Config from '../config/configapi.json';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  file?: {
    name: string;
    content: any;
  };
  options?: string[]; // Added options property
}

interface ChatbotWidgetProps {
  forceOpen?: boolean;
  selectedDomain?: any;
  onClose?: () => void;
  assessmentType?: 'connected' | 'manual' | 'automated';
  shouldResetSession?: boolean;
}

export default function ChatbotWidget({ 
  forceOpen = false, 
  selectedDomain: propSelectedDomain, 
  onClose,
  assessmentType,
  shouldResetSession = false
}: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [selectedDomain, setSelectedDomain] = useState(propSelectedDomain);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, sessionId, logout } = useAuth();
  const navigate = useNavigate();
  
  const API_ENDPOINT = `${Config.local_env}/cloud_maturity`;
  

  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Track assessment state with session management
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [sessionKey, setSessionKey] = useState<string>('');

  // Detect if full-screen/assessment mode (forceOpen and no selectedDomain)
  const isFullScreen = forceOpen && !selectedDomain;

  // Generate session key based on assessment type
  useEffect(() => {
    if (assessmentType) {
      const key = `${assessmentType}_${sessionId}`;
      setSessionKey(key);
      
      // Reset session for manual and automated assessments
      if (shouldResetSession || assessmentType === 'manual' || assessmentType === 'automated') {
        setMessages([]);
        setAssessmentStarted(false);
        // Clear any stored session data for these types
        sessionStorage.removeItem(`chatbot_messages_${key}`);
        sessionStorage.removeItem(`chatbot_started_${key}`);
      } else if (assessmentType === 'connected') {
        // For connected assessments, try to restore session
        const storedMessages = sessionStorage.getItem(`chatbot_messages_${key}`);
        const storedStarted = sessionStorage.getItem(`chatbot_started_${key}`);
        
        if (storedMessages) {
          try {
            setMessages(JSON.parse(storedMessages));
          } catch (e) {
            console.error('Failed to restore messages:', e);
          }
        }
        
        if (storedStarted === 'true') {
          setAssessmentStarted(true);
        }
      }
    }
  }, [assessmentType, sessionId, shouldResetSession]);

  // Save session data for connected assessments
  useEffect(() => {
    if (assessmentType === 'connected' && sessionKey) {
      sessionStorage.setItem(`chatbot_messages_${sessionKey}`, JSON.stringify(messages));
      sessionStorage.setItem(`chatbot_started_${sessionKey}`, assessmentStarted.toString());
    }
  }, [messages, assessmentStarted, assessmentType, sessionKey]);

  // Update state when props change
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
    if (propSelectedDomain) {
      setSelectedDomain(propSelectedDomain);
      setAssessmentStarted(false); // Reset when domain changes
    }
  }, [forceOpen, propSelectedDomain]);

  useEffect(() => {
    // Check if we should open chatbot from assessment page
    const checkForChatbotOpen = () => {
      const chatbotData = document.querySelector('div[style*="display: none"]')?.textContent;
      if (chatbotData && chatbotData !== 'null') {
        try {
          const parsed = JSON.parse(chatbotData);
          if (parsed?.isOpen) {
            setIsOpen(true);
            setSelectedDomain(parsed.selectedDomain);
            // Add welcome message for the selected domain
            if (parsed.selectedDomain) {
              handleDomainSelection(parsed.selectedDomain);
            }
          }
        } catch (e) {}
      }
    };
    
    const interval = setInterval(checkForChatbotOpen, 100);
    setTimeout(() => clearInterval(interval), 1000);
  }, []);

  // Auto-send start assessment and show bot reply in full-screen assessment mode
  useEffect(() => {
    if (isFullScreen && !assessmentStarted && sessionId && assessmentType) {
      // Check for uploaded files from previous workflow
      const storedFiles = sessionStorage.getItem('uploadedFiles');
      let filesData = null;
      
      if (storedFiles) {
        try {
          const parsedFiles = JSON.parse(storedFiles);
          if (parsedFiles && parsedFiles.length > 0) {
            // Use the first file's content for the assessment
            filesData = parsedFiles[0].content;
            
            // For automated assessments with files, skip intro and start directly
            if (assessmentType === 'automated') {
              const fileMessage: Message = {
                id: Date.now().toString(),
                text: `📁 **Configuration File Processed**\n\n✅ Successfully analyzed: **${parsedFiles[0].name}**\n📊 File size: ${(parsedFiles[0].size / 1024).toFixed(1)} KB\n\nStarting your cloud maturity assessment based on your infrastructure configuration...`,
                sender: 'bot',
                timestamp: new Date()
              };
              setMessages([fileMessage]);
              
              // Send assessment query directly with file data
              const query = 'I have uploaded my infrastructure configuration files. Please analyze them and start the cloud maturity assessment with specific questions based on my setup.';
              sendApiRequest(query, filesData);
              setAssessmentStarted(true);
              
              // Clear stored files after use
              sessionStorage.removeItem('uploadedFiles');
              return;
            } else {
              // For other types, show file processed message
              const fileMessage: Message = {
                id: Date.now().toString(),
                text: `📁 **Configuration File Processed**\n\n✅ Successfully analyzed: **${parsedFiles[0].name}**\n📊 File size: ${(parsedFiles[0].size / 1024).toFixed(1)} KB\n\nI'm now analyzing your cloud infrastructure configuration...`,
                sender: 'bot',
                timestamp: new Date()
              };
              setMessages([fileMessage]);
            }
          }
        } catch (error) {
          console.error('Error parsing stored files:', error);
        }
      }
      
      // Only send start assessment if not already handled above
      if (assessmentType !== 'automated' || !filesData) {
        const query = filesData 
          ? 'I have uploaded my infrastructure configuration files. Please analyze them and provide a comprehensive cloud maturity assessment.'
          : 'start assessment';
          
        sendApiRequest(query, filesData);
        setAssessmentStarted(true);
        
        // Clear stored files after use
        if (storedFiles) {
          sessionStorage.removeItem('uploadedFiles');
        }
      }
    }
  }, [isFullScreen, assessmentStarted, sessionId, assessmentType]);

  // Helper to send API request
  const sendApiRequest = async (query: string | null, attachment: any | null) => {
    if (!sessionId) {
      alert('Session not initialized. Please log in again.');
      return;
    }
    if (!query && !attachment) {
      alert('Please enter a message or upload a file.');
      return;
    }
    
    setIsTyping(true);
    
    try {
      const body: any = {
        id: sessionId,
        query: query || 'File uploaded'
      };
      if (attachment) {
        body.attachment = attachment;
      }
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      const botReply: Message = {
        id: (Date.now() + 1).toString(),
        text: formatBotResponse(data.response || data.message || 'Sorry, I could not process your request.'),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      console.error('API Error:', error);
      const errorReply: Message = {
        id: (Date.now() + 1).toString(),
        text: '⚠️ **Connection Issue**\n\nI\'m having trouble connecting to the assessment server. Please check your internet connection and try again.\n\nIf the problem persists, please contact support.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setIsTyping(false);
    }
  };

  // Format bot responses for better readability
  const formatBotResponse = (response: string): string => {
    // If response is already well-formatted (contains markdown), return as is
    if (response.includes('**') || response.includes('##') || response.includes('###')) {
      return response;
    }
    
    // Basic formatting for plain text responses
    let formatted = response;
    
    // Add professional greeting if it's a start message
    if (response.toLowerCase().includes('hello') || response.toLowerCase().includes('ready to assist')) {
      formatted = `🤖 **LeanKloud Cloud Assessment Assistant**\n\n${response}`;
    }
    
    // Format questions with better structure
    if (response.includes('?')) {
      formatted = formatted.replace(/(\d+\.\s*)/g, '\n**$1**');
    }
    
    // Add spacing for better readability
    formatted = formatted.replace(/\. ([A-Z])/g, '.\n\n$1');
    
    return formatted;
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // When user starts assessment, send a start assessment API call
  const handleDomainSelection = (domain: any) => {
    if (sessionId) {
      // Send API call when domain is selected
      sendApiRequest(`start assessment for ${domain.title}`, null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/json') {
      alert('Please upload a JSON file only.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const textContent = e.target?.result as string;
        // Validate JSON first
        const jsonData = JSON.parse(textContent);
        // Base64 encode the file content
        console.log('File uploaded:', file.name, 'Size:', file.size);
        const base64Content = btoa(textContent);
        setUploadedFile(base64Content);
      } catch (error) {
        alert('Invalid JSON file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Update handleSendMessage to use sendApiRequest
  const handleSendMessage = async () => {
    if (!message.trim() && !uploadedFile) return;
    if (message.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setMessage('');
      setMessage('');
    }
    if (uploadedFile) {
      const fileMessage: Message = {
        id: Date.now().toString(),
        text: `Uploaded configuration file`,
        sender: 'user',
        timestamp: new Date(),
        file: { name: 'Uploaded file', content: uploadedFile }
      };
      setMessages(prev => [...prev, fileMessage]);
    }
    await sendApiRequest(message.trim() || null, uploadedFile || null);
    setUploadedFile(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-110 z-40"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div
      className={
        isFullScreen
          ? "fixed inset-0 flex items-center justify-center bg-gray-900 z-50"
          : `fixed bottom-6 right-6 z-50 shadow-2xl rounded-2xl bg-white border border-gray-200 transition-all duration-300 ${isOpen ? 'w-[420px] h-[600px]' : 'w-16 h-16'} flex flex-col`
      }
      style={
        isFullScreen
          ? { minWidth: 0, minHeight: 0 }
          : { minWidth: isOpen ? 420 : 64, minHeight: isOpen ? 600 : 64 }
      }
    >
      <div
        className={
          isFullScreen
            ? "w-full max-w-3xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200"
            : "flex-1 flex flex-col"
        }
      >
        {/* Header */}
        <div className={isFullScreen ? "bg-white text-gray-900 p-6 rounded-t-2xl flex items-center justify-between border-b" : "bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between"}>
          <div className="flex items-center">
            <Bot className={isFullScreen ? "h-6 w-6 mr-3 text-blue-600" : "h-5 w-5 mr-2"} />
            <span className={isFullScreen ? "font-bold text-xl" : "font-medium"}>
              Cloud Assessment Chatbot
            </span>
          </div>
          {isFullScreen && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (onClose) onClose();
                  else navigate('/');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        {/* Messages */}
        <div className={isFullScreen ? "flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50" : "h-64 overflow-y-auto p-4 space-y-4"}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
            >
              <div
                className={`max-w-3xl p-6 rounded-2xl shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white ml-12'
                    : 'bg-white text-gray-900 border border-gray-200 mr-12'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {msg.sender === 'bot' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  {msg.sender === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {/* Use ReactMarkdown for bot replies */}
                  {msg.sender === 'bot' ? (
                    <div className="flex-1">
                      <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                      {msg.options && Array.isArray(msg.options) && (
                        <div className="mt-6 space-y-3">
                          <div className="text-sm font-medium text-gray-600 mb-3">Choose an option:</div>
                          {msg.options.map((option, idx) => (
                            <button 
                              key={idx} 
                              onClick={() => {
                                setMessage(option);
                                handleSendMessage();
                              }}
                              className="block w-full text-left text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl px-5 py-4 transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:shadow-sm font-medium"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1">
                      <p className="text-base leading-relaxed">{msg.text}</p>
                    </div>
                  )}
                  {msg.file && (
                    <div className="flex items-center mt-3 text-sm opacity-75">
                      <FileText className="h-3 w-3 mr-1" />
                      {msg.file.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 mr-12">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Input */}
        <div className={isFullScreen ? "border-t bg-white p-6 shadow-lg" : "border-t p-3"}>
          <div className="flex space-x-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={isFullScreen ? "bg-gray-100 text-gray-600 p-3 rounded-xl hover:bg-gray-200 transition-colors shadow-sm" : "bg-gray-100 text-gray-600 p-2 rounded-md hover:bg-gray-200 transition-colors"}
              title="Upload JSON file"
            >
              <Upload className="h-4 w-4" />
            </button>
            {uploadedFile && (
              <span className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">File selected</span>
            )}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isFullScreen ? "Ask LeanKloud" : (selectedDomain ? `Ask about ${selectedDomain.title}...` : "Ask about cloud best practices or upload JSON...")}
              className={isFullScreen ? "flex-1 border border-gray-300 rounded-xl px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm" : "flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() && !uploadedFile}
              className={isFullScreen ? "bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200" : "bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          {!user?.hasPremiumAccess && (
            <p className="text-sm text-gray-500 mt-3 text-center">
             
            </p>
          )}
        </div>
      </div>
    </div>
  );
}