import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, CheckCircle, XCircle, HelpCircle, Loader2, ArrowLeft, Download } from 'lucide-react';
import Config from '../config/configapi.json';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Question {
  id: string;
  text: string;
  domain: string;
  options: string[];
}

interface Domain {
  name: string;
  description: string;
  color: string;
}

const domains: Domain[] = [
  {
    name: "Security & Compliance",
    description: "Identity management, encryption, security controls, and compliance",
    color: "bg-red-500"
  },
  {
    name: "Architecture & Design",
    description: "Cloud-native patterns, microservices, and architectural principles",
    color: "bg-blue-500"
  },
  {
    name: "Infrastructure & Operations",
    description: "Automation, monitoring, and operational excellence",
    color: "bg-green-500"
  },
  {
    name: "Cost Management",
    description: "Resource optimization, monitoring, and cost control",
    color: "bg-yellow-500"
  },
  {
    name: "Network & Connectivity",
    description: "VPCs, routing, endpoints, and network security",
    color: "bg-purple-500"
  }
];

const questions: Question[] = [
  // Security & Compliance (5 questions)
  {
    id: "sec1",
    text: "Is MFA enforced for all Users?",
    domain: "Security & Compliance",
    options: ["No", "Optional", "Enforced for All IAM Users & SSO"]
  },
  {
    id: "sec2",
    text: "Is a key management solution in place and actively used?",
    domain: "Security & Compliance",
    options: ["No", "Default KMS Only", "Centralized KMS with Rotation"]
  },
  {
    id: "sec3",
    text: "Is data encrypted at rest & in transit?",
    domain: "Security & Compliance",
    options: ["Neither", "Only One", "Both"]
  },
  {
    id: "sec4",
    text: "Is strict RBAC enforced on resources?",
    domain: "Security & Compliance",
    options: ["No", "Basic Roles", "Strict Least Privilege RBAC"]
  },
  {
    id: "sec5",
    text: "Is traffic (inbound/outbound) restricted using security groups or ACLs?",
    domain: "Security & Compliance",
    options: ["Open", "Partial", "Principle of Least Access Enforced"]
  },
  // Architecture & Design (5 questions)
  {
    id: "arch1",
    text: "Are microservices-based cloud-native design patterns being adopted?",
    domain: "Architecture & Design",
    options: ["Not Adopted", "Partially Adopted", "Widely Adopted", "Not Applicable"]
  },
  {
    id: "arch2",
    text: "Are governed design patterns used across the organization?",
    domain: "Architecture & Design",
    options: ["No", "Team-Specific", "Organization-Wide"]
  },
  {
    id: "arch3",
    text: "Are solutions designed to be resilient across multiple AZs and regions?",
    domain: "Architecture & Design",
    options: ["Single AZ Only", "Multi-AZ", "Multi-Region", "Unknown"]
  },
  {
    id: "arch4",
    text: "Is there a formal solution approval process governed by architecture principles?",
    domain: "Architecture & Design",
    options: ["No", "Informal Only", "Formal Review Process"]
  },
  {
    id: "arch5",
    text: "Are migration strategies well defined (Lift & Shift vs Re-factor)?",
    domain: "Architecture & Design",
    options: ["No Defined Strategy", "Lift & Shift Focused", "Mixed Strategy", "Refactor Preferred"]
  },
  // Infrastructure & Operations (5 questions)
  {
    id: "infra1",
    text: "Is Infrastructure as Code (IaC) consistently implemented with no manual changes?",
    domain: "Infrastructure & Operations",
    options: ["Mostly Manual", "Partially Used", "Fully IaC with Drift Detection"]
  },
  {
    id: "infra2",
    text: "Are automated unit tests integrated into the deployment pipeline?",
    domain: "Infrastructure & Operations",
    options: ["No Tests", "Manual Testing Only", "Automated Tests in CI"]
  },
  {
    id: "infra3",
    text: "Is there centralized log aggregation, monitoring, and alerting?",
    domain: "Infrastructure & Operations",
    options: ["No", "Team-Specific", "Centralized"]
  },
  {
    id: "infra4",
    text: "Is there a quick isolation strategy for failing components/domains?",
    domain: "Infrastructure & Operations",
    options: ["No Strategy", "Manual Isolation", "Automated Containment or Self-Healing"]
  },
  {
    id: "infra5",
    text: "Are SLAs/SLOs defined for all key services?",
    domain: "Infrastructure & Operations",
    options: ["No", "Informal", "SLAs & SLOs Defined & Monitored"]
  },
  // Cost Management (5 questions)
  {
    id: "cost1",
    text: "Is cost monitoring and reporting in place?",
    domain: "Cost Management",
    options: ["No", "Team Level Only", "Centralized + Automated Reports"]
  },
  {
    id: "cost2",
    text: "Are alerts configured for cost anomalies?",
    domain: "Cost Management",
    options: ["No", "Budget Thresholds Only", "Real-Time Alerts with Owner Mapping"]
  },
  {
    id: "cost3",
    text: "Are application tagging strategies implemented for cost attribution?",
    domain: "Cost Management",
    options: ["No", "Inconsistent", "Standardized + Enforced"]
  },
  {
    id: "cost4",
    text: "Are resources properly sized based on actual usage?",
    domain: "Cost Management",
    options: ["No Sizing", "Manual Reviews", "Auto-Scaling + Right Sizing Tools"]
  },
  {
    id: "cost5",
    text: "Are unused resources shut down during off hours?",
    domain: "Cost Management",
    options: ["Never", "Manual Process", "Scheduled Auto-Shutdown"]
  },
  // Network & Connectivity (5 questions)
  {
    id: "net1",
    text: "Is the network segmented using VPCs, subnets, and firewalls?",
    domain: "Network & Connectivity",
    options: ["Flat Network", "Basic Segmentation", "Tiered + Service-Level Segmentation"]
  },
  {
    id: "net2",
    text: "Are Zero Trust principles applied in network design?",
    domain: "Network & Connectivity",
    options: ["No", "Partially", "End-to-End Enforcement"]
  },
  {
    id: "net3",
    text: "Are private endpoints, VPNs, or Direct Connect used for secure connectivity?",
    domain: "Network & Connectivity",
    options: ["Public Only", "Some Private Links", "Secure Channel for All Core Systems"]
  },
  {
    id: "net4",
    text: "Are jump hosts used for controlled access to internal systems?",
    domain: "Network & Connectivity",
    options: ["No", "Some Teams Use", "Mandatory Bastion or Session Manager"]
  },
  {
    id: "net5",
    text: "Is vulnerability scanning regularly conducted on all network ports?",
    domain: "Network & Connectivity",
    options: ["No", "Monthly or Ad-Hoc", "Automated + Reported"]
  }
];

interface AssessmentQuestionsProps {
  onComplete: (score: number) => void;
  onClose: () => void;
}

export default function AssessmentQuestions({ onComplete, onClose }: AssessmentQuestionsProps) {
  const { sessionId } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<string>("");
  const [showScore, setShowScore] = useState(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const currentDomainInfo = domains.find(d => d.name === currentQuestion?.domain);

  useEffect(() => {
    if (currentQuestion) {
      setCurrentDomain(currentQuestion.domain);
    }
  }, [currentQuestion]);

  const handleAnswer = async (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      // Check if next question is from a different domain
      const nextQuestion = questions[currentQuestionIndex + 1];
      if (nextQuestion.domain !== currentQuestion.domain) {
        setIsLoading(true);
        // Show loading for 2 seconds before next domain
        setTimeout(() => {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setIsLoading(false);
        }, 2000);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } else {
      // Assessment complete
      const score = calculateScore(newAnswers);
      setFinalScore(score);
      setShowScore(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      const pdf = new jsPDF();
      
      // Add title
      pdf.setFontSize(20);
      pdf.text('Cloud Maturity Assessment Results', 20, 30);
      
      // Add score
      pdf.setFontSize(16);
      const scoreOutOf20 = (finalScore / 6).toFixed(1);
      const percentage = (finalScore / 120) * 100;
      pdf.text(`Overall Score: ${scoreOutOf20}/20 (${percentage.toFixed(0)}%)`, 20, 50);
      
      // Add domain breakdown
      pdf.setFontSize(14);
      pdf.text('Domain Breakdown:', 20, 70);
      
      let yPosition = 90;
      domains.forEach((domain, index) => {
        const domainQuestions = questions.filter(q => q.domain === domain.name);
        let domainScore = 0;
        domainQuestions.forEach(q => {
          const answer = answers[q.id];
          const optionIndex = q.options.indexOf(answer);
          if (optionIndex === 0) domainScore += 1;
          else if (optionIndex === 1) domainScore += 2;
          else if (optionIndex === 2) domainScore += 4;
          else if (optionIndex === 3) domainScore += 4;
        });
        
        const maxDomainScore = domainQuestions.length * 4;
        const domainPercentage = (domainScore / maxDomainScore) * 100;
        
        pdf.text(`${domain.name}: ${domainPercentage.toFixed(0)}%`, 30, yPosition);
        yPosition += 20;
      });
      
      // Add recommendations
      pdf.text('Recommendations:', 20, yPosition + 20);
      pdf.setFontSize(12);
      pdf.text('• Review security configurations and implement MFA', 30, yPosition + 40);
      pdf.text('• Optimize resource utilization and implement cost monitoring', 30, yPosition + 55);
      pdf.text('• Enhance monitoring and observability practices', 30, yPosition + 70);
      pdf.text('• Consider upgrading to Premium Assessment for detailed insights', 30, yPosition + 85);
      
      pdf.save('cloud-maturity-assessment-results.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleProceedToAssessment = async () => {
    await sendScoreToAPI(finalScore);
    onComplete(finalScore);
  };

  const calculateScore = (answers: Record<string, string>): number => {
    let totalScore = 0;
    questions.forEach(question => {
      const answer = answers[question.id];
      const optionIndex = question.options.indexOf(answer);
      if (optionIndex === 0) {
        totalScore += 1;
      } else if (optionIndex === 1) {
        totalScore += 2;
      } else if (optionIndex === 2) {
        totalScore += 4;
      } else if (optionIndex === 3) {
        totalScore += 4; // For 4-option questions, last option is also 4 points
      }
      // If answer not found, add 0
    });
    return totalScore;
  };

  const sendScoreToAPI = async (score: number) => {
    try {
      const response = await fetch(`${Config.local_env}/cloud_maturity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: sessionId,
          query: `Assessment completed with score: ${score}/120 (${(score/6).toFixed(1)}/20)`,
          assessment_score: score,
          total_questions: 25,
          max_score: 120
        })
      });
      const data = await response.json();
      console.log('Score sent to API:', data);
    } catch (error) {
      console.error('Error sending score to API:', error);
    }
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  if (showScore) {
    const percentage = (finalScore / 120) * 100;
    const scoreOutOf20 = (finalScore / 6).toFixed(1);
    let scoreColor = "text-red-600";
    let scoreMessage = "Needs Improvement";
    
    if (percentage >= 80) {
      scoreColor = "text-green-600";
      scoreMessage = "Excellent";
    } else if (percentage >= 60) {
      scoreColor = "text-yellow-600";
      scoreMessage = "Good";
    } else if (percentage >= 40) {
      scoreColor = "text-orange-600";
      scoreMessage = "Fair";
    }

    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Assessment Complete!
            </h2>
            <div className="text-6xl font-bold mb-4">
              <span className={scoreColor}>{scoreOutOf20}</span>
              <span className="text-gray-400">/20</span>
            </div>
            <p className="text-lg text-gray-600 mb-2">
              Raw Score: {finalScore}/120
            </p>
            <p className={`text-xl font-semibold mb-2 ${scoreColor}`}>
              {scoreMessage}
            </p>
            <p className="text-gray-600">
              {percentage.toFixed(0)}% Cloud Maturity Score
            </p>
          </div>
          
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className={`h-4 rounded-full transition-all duration-500 ${
                  percentage >= 80 ? 'bg-green-500' : 
                  percentage >= 60 ? 'bg-yellow-500' : 
                  percentage >= 40 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleProceedToAssessment}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View Detailed Results
            </button>
            <button
              onClick={downloadPDF}
              disabled={isDownloading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isDownloading ? (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              ) : (
                <Download className="h-5 w-5 mr-2" />
              )}
              {isDownloading ? 'Generating PDF...' : 'Download Results as PDF'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    const nextQuestion = questions[currentQuestionIndex + 1];
    const nextDomain = domains.find(d => d.name === nextQuestion?.domain);
    
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="flex justify-center mb-6">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Please wait...
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Loading {nextDomain?.name} Assessment
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-t-2xl border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Cloud Maturity Assessment
              </h1>
              <p className="text-lg text-gray-700 mb-3">
                {currentDomainInfo?.description}
              </p>
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-white font-medium text-sm ${currentDomainInfo?.color}`}>
                {currentDomain}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span className="font-medium">Progress</span>
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              {Math.round(getProgressPercentage())}% Complete
            </p>
          </div>

          {/* Question Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
              {currentQuestion.text}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full p-5 text-left border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {option === "Yes" && <CheckCircle className="h-5 w-5 text-green-600 mr-4" />}
                      {option === "No" && <XCircle className="h-5 w-5 text-red-600 mr-4" />}
                      {option === "Unsure" && <HelpCircle className="h-5 w-5 text-yellow-600 mr-4" />}
                      <span className="text-lg font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                        {option}
                      </span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Previous
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}