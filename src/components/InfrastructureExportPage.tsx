import React, { useState } from 'react';
import { ArrowLeft, FileText, Copy, Check } from 'lucide-react';

interface InfrastructureExportPageProps {
  onBack: () => void;
  onContinue: () => void;
  selectedProvider: string;
  selectedTool: string;
}

export default function InfrastructureExportPage({ onBack, onContinue, selectedProvider, selectedTool }: InfrastructureExportPageProps) {
  const [copied, setCopied] = useState(false);

  const getExportCommand = () => {
    switch (selectedTool) {
      case 'terraform':
        return 'terraform show -json > terraform-state.json';
      case 'cloudformation':
        return 'aws cloudformation describe-stacks --stack-name your-stack-name > cloudformation-export.json';
      case 'pulumi':
        return 'pulumi stack export > pulumi-state.json';
      case 'ansible':
        return 'ansible-inventory --list > ansible-inventory.json';
      default:
        return 'terraform show -json > terraform-state.json';
    }
  };

  const getToolName = () => {
    switch (selectedTool) {
      case 'terraform':
        return 'Terraform';
      case 'cloudformation':
        return 'CloudFormation';
      case 'pulumi':
        return 'Pulumi';
      case 'ansible':
        return 'Ansible';
      default:
        return 'Terraform';
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getExportCommand());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

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
            Get your infrastructure data
          </p>
          
          <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium mt-4">
            {selectedProvider.toUpperCase()} Assessment
          </div>
        </div>

        {/* Export Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <FileText className="h-6 w-6 text-green-500 mr-3" />
            <h2 className="text-2xl font-bold text-white">{getToolName()} State Export</h2>
          </div>

          <div className="bg-green-900 bg-opacity-30 border border-green-700 rounded-lg p-4 mb-6">
            <p className="text-green-300">
              Export your current {getToolName()} state to JSON format
            </p>
          </div>

          {/* Command Box */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">Command</span>
              <button
                onClick={handleCopy}
                className="flex items-center text-gray-400 hover:text-white transition-colors text-sm"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <code className="text-green-400 font-mono text-sm">
              {getExportCommand()}
            </code>
          </div>

          {/* Next Steps */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Next Steps:</h3>
            <ol className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                Run the provided script(s) in your environment
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                Collect all generated JSON files
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                Upload the files in the next step
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                Our AI will analyze your infrastructure and provide insights
              </li>
            </ol>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={onContinue}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center mx-auto"
          >
            Continue to Assessment
            <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}