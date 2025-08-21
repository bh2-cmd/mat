import React, { useState } from 'react';
import { ArrowLeft, FileText, Cloud } from 'lucide-react';

interface AssessmentScopePageProps {
  onBack: () => void;
  onContinue: (scope: 'organization' | 'account') => void;
}

export default function AssessmentScopePage({ onBack, onContinue }: AssessmentScopePageProps) {
  const [selectedScope, setSelectedScope] = useState<'organization' | 'account' | null>(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Quick Insight Assessment
          </h1>
          <p className="text-gray-300 text-lg">
            Choose your assessment scope
          </p>
          
          <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium mt-4">
            Free Assessment
          </div>
        </div>

        {/* Assessment Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Organization-wide Assessment */}
          <div
            onClick={() => onContinue('organization')}
            className={`bg-gray-800 border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
              selectedScope === 'organization'
                ? 'border-blue-500 bg-gray-750'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-blue-600 p-3 rounded-lg mr-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Organization-wide Assessment
                </h3>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              Assess your overall cloud maturity across the entire organization
            </p>
            
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                Quick and simple - no account details needed
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                General organizational maturity overview
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                Instant results with basic recommendations
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                Perfect for getting started
              </li>
            </ul>
          </div>

          {/* Account-specific Assessment */}
          <div
            onClick={() => onContinue('account')}
            className={`bg-gray-800 border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
              selectedScope === 'account'
                ? 'border-green-500 bg-gray-750'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-green-600 p-3 rounded-lg mr-4">
                  <Cloud className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Account-specific Assessment
                </h3>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              Focus on a specific cloud account or environment for targeted insights
            </p>
            
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                More targeted and relevant questions
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                Account-specific recommendations
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                Better alignment with Premium assessments
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                Environment-focused insights
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}