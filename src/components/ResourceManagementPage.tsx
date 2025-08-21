import React, { useState } from 'react';
import { ArrowLeft, Code, Wrench, Settings } from 'lucide-react';

interface ResourceManagementPageProps {
  onBack: () => void;
  onContinue: (managementType: 'automated' | 'manual' | 'hybrid') => void;
  selectedProvider: string;
}

export default function ResourceManagementPage({ onBack, onContinue, selectedProvider }: ResourceManagementPageProps) {
  const [selectedType, setSelectedType] = useState<'automated' | 'manual' | 'hybrid' | null>(null);

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
            AI-Powered Guided Upload
          </h1>
          <p className="text-gray-300 text-lg">
            How are your cloud resources managed?
          </p>
          
          <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium mt-4">
            {selectedProvider.toUpperCase()} Assessment
          </div>
        </div>

        {/* Management Options */}
        <div className="space-y-4 mb-12">
          {/* Fully Automated */}
          <div
            onClick={() => onContinue('automated')}
            className={`bg-gray-800 border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
              selectedType === 'automated'
                ? 'border-green-500 bg-gray-750'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-600 p-3 rounded-lg mr-4">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Fully Automated with IaC Tools
                  </h3>
                  <p className="text-gray-400">
                    Infrastructure managed through code using tools like Terraform, CloudFormation, etc.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fully Manual */}
          <div
            onClick={() => onContinue('manual')}
            className={`bg-gray-800 border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
              selectedType === 'manual'
                ? 'border-orange-500 bg-gray-750'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-orange-600 p-3 rounded-lg mr-4">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Fully Manual
                  </h3>
                  <p className="text-gray-400">
                    Resources created and managed manually through console or CLI
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hybrid Approach */}
          <div
            onClick={() => onContinue('hybrid')}
            className={`bg-gray-800 border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
              selectedType === 'hybrid'
                ? 'border-blue-500 bg-gray-750'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-600 p-3 rounded-lg mr-4">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Hybrid Approach
                  </h3>
                  <p className="text-gray-400">
                    Mix of automated IaC tools and manual resource management
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}