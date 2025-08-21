import React, { useState } from 'react';
import { ArrowLeft, Upload, Link } from 'lucide-react';

interface PremiumAssessmentPageProps {
  onBack: () => void;
  onContinue: (assessmentType: 'guided' | 'connected') => void;
}

export default function PremiumAssessmentPage({ onBack, onContinue }: PremiumAssessmentPageProps) {
  const [selectedType, setSelectedType] = useState<'guided' | 'connected' | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      onContinue(selectedType);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
          
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Choose Your Premium Assessment
          </h1>
          <p className="text-gray-300 text-lg text-center">
            Select the assessment method that works best for your organization
          </p>
        </div>

        {/* Assessment Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* AI-Powered Guided Upload */}
          <div
            onClick={() => onContinue('guided')}
            className={`bg-gray-800 border-2 rounded-xl p-8 cursor-pointer transition-all duration-200 ${
              selectedType === 'guided'
                ? 'border-blue-500 bg-gray-700'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-blue-600 p-3 rounded-lg mr-4">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  AI-Powered Guided Upload
                </h3>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Upload your infrastructure files and configurations. Our AI will analyze your setup and 
              provide detailed insights through an interactive assessment.
            </p>
            
            <div className="flex-1">
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  File-based analysis
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  No direct cloud access required
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Interactive AI-powered chat
                </li>
              </ul>
            </div>
            
            <button className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center">
              Start Guided Upload
              <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
            </button>
          </div>

          {/* AI-Powered Connected Assessment */}
          <div
            onClick={() => onContinue('connected')}
            className={`bg-gray-800 border-2 rounded-xl p-8 cursor-pointer transition-all duration-200 relative ${
              selectedType === 'connected'
                ? 'border-blue-500 bg-gray-700'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            {/* Most Comprehensive Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Comprehensive
              </div>
            </div>
            
            <div className="flex items-start justify-between mb-6 mt-4">
              <div className="flex items-center">
                <div className="bg-green-600 p-3 rounded-lg mr-4">
                  <Link className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  AI-Powered Connected Assessment
                </h3>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Connect directly to your cloud environment for real-time analysis. Get the most accurate and 
              comprehensive assessment with live data.
            </p>
            
            <div className="flex-1">
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Real-time cloud analysis
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Most accurate assessment
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Live infrastructure insights
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Cost optimization insights
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Advanced AI recommendations
                </li>
              </ul>
            </div>
            
            <button className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center">
              Start Connected Assessment
              <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}