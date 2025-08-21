import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChatbotWidget from './ChatbotWidget';
import { 
  Cloud, 
  LogOut, 
  BarChart3, 
  Shield, 
  Cog, 
  DollarSign, 
  Network,
  ArrowLeft,
  CheckCircle,
  CreditCard
} from 'lucide-react';
import PaymentModal from './PaymentModal';

interface Question {
  id: string;
  text: string;
  type: 'yes-no' | 'multiple-choice';
  options?: string[];
  followUpQuestions?: Question[];
}

interface AssessmentDomain {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  color: string;
  questions?: Question[];
}

export default function AssessmentPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState<AssessmentDomain | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [chatbotExpanded, setChatbotExpanded] = useState(false);

  const assessmentDomains: AssessmentDomain[] = [
    {
      id: 'design-architecture',
      icon: BarChart3,
      title: 'Design & Architecture',
      description: 'Cloud-native patterns, microservices, and architectural principles',
      color: 'bg-blue-500',
    },
    {
      id: 'infrastructure-operations',
      icon: Cog,
      title: 'Infrastructure & Operations',
      description: 'Automation, monitoring, and operational excellence',
      color: 'bg-green-500',
    },
    {
      id: 'security-compliance',
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Identity management, encryption, and security best practices',
      color: 'bg-red-500',
    },
    {
      id: 'network-security',
      icon: Network,
      title: 'Network Security',
      description: 'Zero trust, network segmentation, and secure connectivity',
      color: 'bg-purple-500',
    },
    {
      id: 'cost-management',
      icon: DollarSign,
      title: 'Cost Management',
      description: 'Resource optimization, monitoring, and cost control',
      color: 'bg-orange-500',
    }
  ];

  const handleDomainSelect = async (domain: AssessmentDomain) => {
    setSelectedDomain(domain);
    setChatbotExpanded(true);
  };

  const handleAnswer = (questionId: string, answer: any) => {
    const updatedAnswers = { ...answers, [questionId]: answer };
    setAnswers(updatedAnswers);
    
    // Move to next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const getCurrentQuestion = () => {
    if (questions.length === 0) return null;
    return questions[currentQuestionIndex];
  };

  const renderQuestion = (question: Question) => {
    if (question.type === 'yes-no') {
      return (
        <div className="space-y-4">
          <button
            onClick={() => handleAnswer(question.id, 'yes')}
            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            Yes
          </button>
          <button
            onClick={() => handleAnswer(question.id, 'no')}
            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            No
          </button>
        </div>
      );
    }

    if (question.type === 'multiple-choice' && question.options) {
      return (
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(question.id, option)}
              className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderResults = () => {
    const score = Math.floor(Math.random() * 40) + 60; // Mock score between 60-100
    
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Assessment Complete
          </h3>
          <p className="text-gray-600">
            Your {selectedDomain?.title} maturity score
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
            <div className="text-lg text-gray-700">Maturity Level: {score >= 80 ? 'Advanced' : score >= 60 ? 'Intermediate' : 'Basic'}</div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <p className="text-yellow-800 text-center">
            <strong>Note:</strong> These results may or may not be 100% accurate. 
            Would you like for Leankloud to access your environment and provide more accurate answers?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Get Accurate Analysis ($99.99)
          </button>
          <button
            onClick={() => {
              setSelectedDomain(null);
              setShowResults(false);
            }}
            className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Continue with Free Results
          </button>
        </div>
      </div>
    );
  };

  if (showResults && selectedDomain) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Cloud className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Leankloud</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                <button onClick={logout} className="p-2 text-gray-400 hover:text-gray-600">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          
          {renderResults()}
        </main>

        <PaymentModal 
          isOpen={showPaymentModal} 
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            // Handle successful payment
          }}
        />
        
        {/* Chatbot Widget with auto-expansion */}
        <ChatbotWidget 
          forceOpen={chatbotExpanded}
          selectedDomain={selectedDomain}
          onClose={() => setChatbotExpanded(false)}
        />
        
        {/* Chatbot Widget with auto-expansion */}
        <ChatbotWidget 
          forceOpen={chatbotExpanded}
          selectedDomain={selectedDomain}
          onClose={() => setChatbotExpanded(false)}
        />
      </div>
    );
  }

  if (selectedDomain) {
    const currentQuestion = getCurrentQuestion();
    
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Cloud className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Leankloud</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                <button onClick={logout} className="p-2 text-gray-400 hover:text-gray-600">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => setSelectedDomain(null)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Assessment Overview
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className={`${selectedDomain.color} w-12 h-12 rounded-lg flex items-center justify-center mr-4`}>
                  <selectedDomain.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedDomain.title}</h2>
                  <p className="text-gray-600">{selectedDomain.description}</p>
                </div>
              </div>
              
              <div className="bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading questions...</span>
              </div>
            ) : currentQuestion ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {currentQuestion.text}
                </h3>
                {renderQuestion(currentQuestion)}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-300">Loading questions...</span>
              </div>
            )}
          </div>
        </main>
        
        {/* Chatbot Widget with auto-expansion */}
        <ChatbotWidget 
          forceOpen={chatbotExpanded}
          selectedDomain={selectedDomain}
          onClose={() => setChatbotExpanded(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Cloud className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Leankloud</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button onClick={logout} className="p-2 text-gray-400 hover:text-gray-600">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Cloud Maturity Assessment
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            This assessment evaluates your organization across 5 key dimensions of cloud maturity. 
            Select a domain to begin your assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {assessmentDomains.map((domain, index) => {
            const IconComponent = domain.icon;
            return (
              <button
                key={index}
                onClick={() => handleDomainSelect(domain)}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 text-left transform hover:scale-105"
              >
                <div className={`${domain.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {domain.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {domain.description}
                </p>
                <div className="text-blue-600 font-medium">
                  Start Assessment →
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}