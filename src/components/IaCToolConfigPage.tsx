import React, { useState } from 'react';
import { ArrowLeft, Code } from 'lucide-react';

interface IaCToolConfigPageProps {
  onBack: () => void;
  onContinue: (config: { toolType: 'single' | 'multiple'; selectedTool?: string }) => void;
  selectedProvider: string;
}

export default function IaCToolConfigPage({ onBack, onContinue, selectedProvider }: IaCToolConfigPageProps) {
  const [toolType, setToolType] = useState<'single' | 'multiple' | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools = [
    { id: 'terraform', name: 'Terraform' },
    { id: 'ansible', name: 'Ansible' },
    { id: 'pulumi', name: 'Pulumi' },
    { id: 'cloudformation', name: 'AWS CloudFormation' }
  ];

  const handleToolTypeSelection = (type: 'single' | 'multiple') => {
    setToolType(type);
    if (type === 'multiple') {
      onContinue({ toolType: type });
    }
  };

  const handleToolSelection = (tool: string) => {
    setSelectedTool(tool);
    onContinue({ toolType: 'single', selectedTool: tool });
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
            Infrastructure as Code Configuration
          </p>
          
          <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium mt-4">
            {selectedProvider.toUpperCase()} Assessment
          </div>
        </div>

        {/* IaC Tool Configuration */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">IaC Tool Configuration</h2>
          
          {/* Tool Type Selection */}
          <div className="space-y-4 mb-8">
            <div
              onClick={() => handleToolTypeSelection('single')}
              className={`bg-gray-800 border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                toolType === 'single'
                  ? 'border-blue-500 bg-gray-750'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Single IaC Tool</h3>
                  <p className="text-gray-400">All infrastructure managed with one tool</p>
                </div>
              </div>
            </div>

            <div
              onClick={() => handleToolTypeSelection('multiple')}
              className={`bg-gray-800 border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                toolType === 'multiple'
                  ? 'border-blue-500 bg-gray-750'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Multiple IaC Tools</h3>
                  <p className="text-gray-400">Different tools for different parts of infrastructure</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tool Selection (only show if Single IaC Tool is selected) */}
          {toolType === 'single' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Select Your IaC Tool</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => handleToolSelection(tool.id)}
                    className={`bg-gray-800 border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                      selectedTool === tool.id
                        ? 'border-blue-500 bg-gray-750'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Code className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-white font-medium">{tool.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}