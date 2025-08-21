import React, { useState } from 'react';
import { ArrowLeft, Cloud } from 'lucide-react';

interface CloudProviderSelectionPageProps {
  onBack: () => void;
  onContinue: (provider: string) => void;
}

export default function CloudProviderSelectionPage({ onBack, onContinue }: CloudProviderSelectionPageProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const providers = [
    {
      id: 'aws',
      name: 'Amazon Web Services',
      description: 'AWS cloud infrastructure',
      color: 'bg-orange-500',
      icon: '☁️'
    },
    {
      id: 'azure',
      name: 'Microsoft Azure',
      description: 'Azure cloud platform',
      color: 'bg-blue-500',
      icon: '☁️'
    },
    {
      id: 'gcp',
      name: 'Google Cloud Platform',
      description: 'Google Cloud services',
      color: 'bg-green-500',
      icon: '☁️'
    },
  ];

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
            Select your cloud provider for account-specific assessment
          </p>
        </div>

        {/* Provider Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {providers.map((provider) => (
            <div
              key={provider.id}
              onClick={() => onContinue(provider.id)}
              className={`bg-gray-800 border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                selectedProvider === provider.id
                  ? 'border-blue-500 bg-gray-750'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`${provider.color} p-3 rounded-lg mr-4`}>
                    <Cloud className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {provider.name}
                    </h3>
                    <p className="text-gray-400">
                      {provider.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}