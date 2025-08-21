import React, { useState } from 'react';
import { ArrowLeft, Shield, Info } from 'lucide-react';

interface AccountInfoPageProps {
  onBack: () => void;
  onContinue: (accountInfo: { accountId: string; provider: string }) => void;
  selectedProvider: string;
}

export default function AccountInfoPage({ onBack, onContinue, selectedProvider }: AccountInfoPageProps) {
  const [accountId, setAccountId] = useState('');

  const getProviderInfo = () => {
    switch (selectedProvider) {
      case 'aws':
        return {
          label: 'AWS Account ID',
          placeholder: 'Enter your aws account id',
          description: 'Your 12-digit AWS account identifier'
        };
      case 'azure':
        return {
          label: 'Azure Subscription ID',
          placeholder: 'Enter your azure subscription id',
          description: 'Your Azure subscription identifier'
        };
      case 'gcp':
        return {
          label: 'GCP Project ID',
          placeholder: 'Enter your gcp project id',
          description: 'Your Google Cloud project identifier'
        };
      default:
        return {
          label: 'Account ID',
          placeholder: 'Enter your account id',
          description: 'Your cloud account identifier'
        };
    }
  };

  const providerInfo = getProviderInfo();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && accountId.trim()) {
      onContinue({ accountId: accountId.trim(), provider: selectedProvider });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
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
            Enter your account information for targeted assessment
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
            </div>
            <div>
              <h3 className="text-blue-400 font-semibold mb-2 flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Security Notice
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your account information is encrypted and used only for assessment purposes. We only 
                need your account identifier to provide tailored recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Account Input */}
        <div className="mb-12">
          <label className="block text-white font-medium mb-3">
            {providerInfo.label} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={providerInfo.placeholder}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <p className="text-gray-400 text-sm mt-2">
            {providerInfo.description}
          </p>
          
          <button
            onClick={() => accountId.trim() && onContinue({ accountId: accountId.trim(), provider: selectedProvider })}
            disabled={!accountId.trim()}
            className={`w-full mt-6 px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
              accountId.trim()
                ? 'bg-gray-600 hover:bg-gray-500 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
            <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}