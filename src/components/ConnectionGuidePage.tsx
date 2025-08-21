import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Shield, Key, Cloud, AlertTriangle } from 'lucide-react';

interface ConnectionGuidePageProps {
  onBack: () => void;
  onContinue: () => void;
  selectedProvider: string;
  accountInfo: { accountId: string; provider: string };
}

export default function ConnectionGuidePage({ onBack, onContinue, selectedProvider, accountInfo }: ConnectionGuidePageProps) {
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1);

  const getProviderInstructions = () => {
    switch (selectedProvider) {
      case 'aws':
        return {
          title: 'AWS IAM Role Setup',
          steps: [
            {
              title: 'Create IAM Role',
              description: 'Create a new IAM role with read-only permissions',
              code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "s3:GetBucketLocation",
        "s3:ListAllMyBuckets",
        "rds:Describe*",
        "lambda:List*",
        "iam:List*",
        "cloudformation:Describe*"
      ],
      "Resource": "*"
    }
  ]
}`
            },
            {
              title: 'Configure Trust Policy',
              description: 'Allow LeanKloud to assume this role',
              code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::LEANKLOUD-ACCOUNT:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "your-unique-external-id"
        }
      }
    }
  ]
}`
            }
          ]
        };
      case 'azure':
        return {
          title: 'Azure Service Principal Setup',
          steps: [
            {
              title: 'Create Service Principal',
              description: 'Create a service principal with Reader role',
              code: `az ad sp create-for-rbac --name "LeanKloud-Assessment" --role "Reader" --scopes "/subscriptions/${accountInfo.accountId}"`
            },
            {
              title: 'Grant Additional Permissions',
              description: 'Add specific read permissions for assessment',
              code: `az role assignment create --assignee <service-principal-id> --role "Security Reader" --scope "/subscriptions/${accountInfo.accountId}"`
            }
          ]
        };
      case 'gcp':
        return {
          title: 'GCP Service Account Setup',
          steps: [
            {
              title: 'Create Service Account',
              description: 'Create a service account with viewer permissions',
              code: `gcloud iam service-accounts create leankloud-assessment --display-name="LeanKloud Assessment"`
            },
            {
              title: 'Grant Permissions',
              description: 'Assign necessary roles to the service account',
              code: `gcloud projects add-iam-policy-binding ${accountInfo.accountId} --member="serviceAccount:leankloud-assessment@${accountInfo.accountId}.iam.gserviceaccount.com" --role="roles/viewer"`
            }
          ]
        };
      default:
        return { title: '', steps: [] };
    }
  };

  const instructions = getProviderInstructions();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
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
            AI-Powered Connected Assessment
          </h1>
          <p className="text-gray-300 text-lg">
            Connect your {selectedProvider.toUpperCase()} environment securely
          </p>
          
          <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium mt-4">
            {selectedProvider.toUpperCase()} Setup Guide
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <Shield className="h-6 w-6 text-blue-400 mr-3 mt-1" />
            <div>
              <h3 className="text-blue-300 font-semibold mb-2">Security First Approach</h3>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Read-only access only - no modifications to your environment</li>
                <li>• Temporary access that can be revoked anytime</li>
                <li>• All data encrypted in transit and at rest</li>
                <li>• Compliance with SOC2 and ISO27001 standards</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Setup Steps */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Key className="h-6 w-6 mr-3" />
            {instructions.title}
          </h2>

          {instructions.steps.map((stepData, index) => (
            <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{stepData.title}</h3>
                    <p className="text-gray-300">{stepData.description}</p>
                  </div>
                </div>

                {/* Code Block */}
                <div className="bg-gray-900 rounded-lg border border-gray-600 overflow-hidden">
                  <div className="flex items-center justify-between bg-gray-800 px-4 py-3 border-b border-gray-600">
                    <span className="text-sm font-medium text-gray-300">Configuration</span>
                    <button
                      onClick={() => handleCopy(stepData.code)}
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
                  </div>
                  <div className="p-4">
                    <pre className="text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                      {stepData.code}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Warning */}
        <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg p-6 mt-8">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-yellow-400 mr-3 mt-1" />
            <div>
              <h3 className="text-yellow-300 font-semibold mb-2">Important Notes</h3>
              <ul className="text-yellow-200 text-sm space-y-1">
                <li>• Keep your credentials secure and never share them publicly</li>
                <li>• You can revoke access at any time from your cloud console</li>
                <li>• The assessment will take 5-10 minutes to complete</li>
                <li>• You'll receive detailed results immediately after completion</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center mt-12">
          <button
            onClick={onContinue}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center mx-auto"
          >
            <Cloud className="h-5 w-5 mr-2" />
            I've Configured Access - Continue Assessment
          </button>
        </div>
      </div>
    </div>
  );
}