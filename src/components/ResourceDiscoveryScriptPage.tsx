import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Download } from 'lucide-react';

interface ResourceDiscoveryScriptPageProps {
  onBack: () => void;
  onContinue: () => void;
  selectedProvider: string;
}

export default function ResourceDiscoveryScriptPage({ onBack, onContinue, selectedProvider }: ResourceDiscoveryScriptPageProps) {
  const [copied, setCopied] = useState(false);

  const getScript = () => {
    switch (selectedProvider) {
      case 'aws':
        return `#!/bin/bash
# AWS Resource Discovery Script
echo "Discovering AWS resources..."

# Get EC2 instances
aws ec2 describe-instances --output json > aws-ec2-instances.json

# Get S3 buckets
aws s3api list-buckets --output json > aws-s3-buckets.json

# Get RDS instances
aws rds describe-db-instances --output json > aws-rds-instances.json

# Get Lambda functions
aws lambda list-functions --output json > aws-lambda-functions.json

# Get VPCs
aws ec2 describe-vpcs --output json > aws-vpcs.json

# Get Security Groups
aws ec2 describe-security-groups --output json > aws-security-groups.json

# Get IAM roles
aws iam list-roles --output json > aws-iam-roles.json

echo "Resource discovery complete! Upload the generated JSON files."`;
      case 'azure':
        return `#!/bin/bash
# Azure Resource Discovery Script
echo "Discovering Azure resources..."

# Get all resources
az resource list --output json > azure-resources.json

# Get virtual machines
az vm list --output json > azure-vms.json

# Get storage accounts
az storage account list --output json > azure-storage.json

# Get virtual networks
az network vnet list --output json > azure-vnets.json

# Get network security groups
az network nsg list --output json > azure-nsgs.json

echo "Resource discovery complete! Upload the generated JSON files."`;
      case 'gcp':
        return `#!/bin/bash
# GCP Resource Discovery Script
echo "Discovering GCP resources..."

# Get compute instances
gcloud compute instances list --format=json > gcp-instances.json

# Get storage buckets
gcloud storage buckets list --format=json > gcp-buckets.json

# Get VPC networks
gcloud compute networks list --format=json > gcp-networks.json

# Get firewall rules
gcloud compute firewall-rules list --format=json > gcp-firewall.json

# Get IAM policies
gcloud projects get-iam-policy $(gcloud config get-value project) --format=json > gcp-iam.json

echo "Resource discovery complete! Upload the generated JSON files."`;
      default:
        return 'Script not available for selected provider';
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getScript());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([getScript()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'discovery-script.sh';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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

        {/* Resource Discovery Script Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Copy className="h-6 w-6 text-blue-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Resource Discovery Script</h2>
          </div>

          <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4 mb-6">
            <p className="text-blue-300">
              Run this script in your {selectedProvider.toUpperCase()} environment to discover and export your resources. Make sure you have the appropriate CLI tools installed and configured.
            </p>
          </div>

          {/* Script Box */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden mb-6">
            <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-3">
              <span className="text-sm font-medium">discovery-script.sh</span>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center text-gray-300 hover:text-white transition-colors text-sm px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
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
                <button
                  onClick={handleDownload}
                  className="flex items-center text-gray-300 hover:text-white transition-colors text-sm px-3 py-1 rounded bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
              </div>
            </div>
            <div className="p-4 bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto">
              <pre>{getScript()}</pre>
            </div>
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