import React, { useState } from 'react';
import { ChevronRight, Shield, Network, DollarSign, BarChart3, Settings, Upload, FileText, Rocket } from 'lucide-react';
import AssessmentQuestions from './AssessmentQuestions';
import AssessmentScopePage from './AssessmentScopePage';
import CloudProviderSelectionPage from './CloudProviderSelectionPage';
import AccountInfoPage from './AccountInfoPage';
import PremiumAssessmentPage from './PremiumAssessmentPage';
import PremiumCloudProviderPage from './PremiumCloudProviderPage';
import ResourceManagementPage from './ResourceManagementPage';
import IaCToolConfigPage from './IaCToolConfigPage';
import InfrastructureExportPage from './InfrastructureExportPage';
import FileUploadPage from './FileUploadPage';
import ChatbotWidget from './ChatbotWidget';
import ConnectedAssessmentPage from './ConnectedAssessmentPage';
import ResourceDiscoveryScriptPage from './ResourceDiscoveryScriptPage';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ConnectionGuidePage from './ConnectionGuidePage';

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <button 
        className="w-full text-left p-6 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">
            {question}
          </h3>
          <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-90' : ''}`} />
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          <p className="text-gray-300 leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

function LandingPage() {
  const [showAssessment, setShowAssessment] = useState(false);
  const [showScopePage, setShowScopePage] = useState(false);
  const [showProviderPage, setShowProviderPage] = useState(false);
  const [showAccountInfoPage, setShowAccountInfoPage] = useState(false);
  const [showPremiumAssessment, setShowPremiumAssessment] = useState(false);
  const [showPremiumProviderPage, setShowPremiumProviderPage] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);
  const [selectedScope, setSelectedScope] = useState<'organization' | 'account' | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [accountInfo, setAccountInfo] = useState<{ accountId: string; provider: string } | null>(null);
  const [premiumAssessmentType, setPremiumAssessmentType] = useState<'guided' | 'connected' | null>(null);
  const [showResourceManagement, setShowResourceManagement] = useState(false);
  const [showIaCToolConfig, setShowIaCToolConfig] = useState(false);
  const [showInfrastructureExport, setShowInfrastructureExport] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [managementType, setManagementType] = useState<'automated' | 'manual' | 'hybrid' | null>(null);
  const [iacConfig, setIaCConfig] = useState<{ toolType: 'single' | 'multiple'; selectedTool?: string } | null>(null);
  const [showResourceDiscoveryScript, setShowResourceDiscoveryScript] = useState(false);
  const [showPremiumAccountInfo, setShowPremiumAccountInfo] = useState(false);
  const [showConnectedAssessment, setShowConnectedAssessment] = useState(false);
  const [showConnectionGuide, setShowConnectionGuide] = useState(false);
  const { logout, sessionId } = useAuth();
  const navigate = useNavigate();

  // Call start assessment API as soon as assessment starts
  React.useEffect(() => {
    if (showAssessment && sessionId) {
      fetch(`${Config.local_env}/cloud_maturity`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ id: sessionId, query: 'start assessment' })
      }).catch(error => {
        console.error('Failed to start assessment:', error);
      });
    }
  }, [showAssessment, sessionId]);

  const startAssessment = () => {
    setShowScopePage(true);
  };

  const startPremiumAssessment = () => {
    setShowPremiumAssessment(true);
  };

  const handleScopeSelection = (scope: 'organization' | 'account') => {
    setSelectedScope(scope);
    setShowScopePage(false);
    
    if (scope === 'organization') {
      setShowAssessment(true);
    } else {
      setShowProviderPage(true);
    }
  };

  const handleBackFromScope = () => {
    setShowScopePage(false);
  };

  const handleProviderSelection = (provider: string) => {
    setSelectedProvider(provider);
    setShowProviderPage(false);
    setShowAccountInfoPage(true);
  };

  const handleBackFromProvider = () => {
    setShowProviderPage(false);
    setShowScopePage(true);
  };

  const handleAccountInfoSubmit = (info: { accountId: string; provider: string }) => {
    setAccountInfo(info);
    setShowAccountInfoPage(false);
    setShowAssessment(true);
  };

  const handleBackFromAccountInfo = () => {
    setShowAccountInfoPage(false);
    setShowProviderPage(true);
  };

  const handlePremiumAssessmentSelection = (type: 'guided' | 'connected') => {
    setPremiumAssessmentType(type);
    setShowPremiumAssessment(false);
    setShowPremiumProviderPage(true);
  };

  const handleBackFromPremiumAssessment = () => {
    setShowPremiumAssessment(false);
  };

  const handlePremiumProviderSelection = (provider: string) => {
    setSelectedProvider(provider);
    setShowPremiumProviderPage(false);
    setShowPremiumAccountInfo(true);
  };

  const handleBackFromPremiumProvider = () => {
    setShowPremiumProviderPage(false);
    setShowPremiumAssessment(true);
  };

  const handlePremiumAccountInfoSubmit = (info: { accountId: string; provider: string }) => {
    setAccountInfo(info);
    setShowPremiumAccountInfo(false);
    if (premiumAssessmentType === 'guided') {
      setShowResourceManagement(true);
    } else {
      setShowConnectionGuide(true);
    }
  };

  const handleBackFromPremiumAccountInfo = () => {
    setShowPremiumAccountInfo(false);
    setShowPremiumProviderPage(true);
  };

  const handleConnectionGuideContinue = () => {
    setShowConnectionGuide(false);
    setShowConnectedAssessment(true);
  };

  const handleBackFromConnectionGuide = () => {
    setShowConnectionGuide(false);
    setShowPremiumAccountInfo(true);
  };

  const handleConnectedAssessmentStart = () => {
    setShowConnectedAssessment(false);
    setShowChatbot(true);
  };

  const handleBackFromConnectedAssessment = () => {
    setShowConnectedAssessment(false);
    setShowConnectionGuide(true);
  };

  const handleResourceManagementSelection = (type: 'automated' | 'manual' | 'hybrid') => {
    setManagementType(type);
    setShowResourceManagement(false);
    if (type === 'automated') {
      setShowIaCToolConfig(true);
    } else if (type === 'manual') {
      setShowResourceDiscoveryScript(true);
    } else {
      // For hybrid, show IaC tool config
      setShowIaCToolConfig(true);
    }
  };

  const handleHybridIaCToolConfigSelection = (config: { toolType: 'single' | 'multiple'; selectedTool?: string }) => {
    setIaCConfig(config);
    setShowIaCToolConfig(false);
    if (managementType === 'hybrid') {
      // For hybrid, always show resource discovery script after IaC config
      setShowResourceDiscoveryScript(true);
    } else if (config.toolType === 'single' && config.selectedTool) {
      setShowInfrastructureExport(true);
    } else {
      setShowFileUpload(true);
    }
  };

  const handleBackFromResourceManagement = () => {
    setShowResourceManagement(false);
    setShowPremiumAccountInfo(true);
  };

  const handleResourceDiscoveryScriptContinue = () => {
    setShowResourceDiscoveryScript(false);
    setShowFileUpload(true);
  };

  const handleBackFromResourceDiscoveryScript = () => {
    setShowResourceDiscoveryScript(false);
    if (managementType === 'hybrid') {
      setShowIaCToolConfig(true);
    } else {
      setShowResourceManagement(true);
    }
  };

  const handleIaCToolConfigSelection = (config: { toolType: 'single' | 'multiple'; selectedTool?: string }) => {
    handleHybridIaCToolConfigSelection(config);
  };

  const handleBackFromIaCToolConfig = () => {
    setShowIaCToolConfig(false);
    if (managementType === 'hybrid') {
      setShowResourceManagement(true);
    } else {
      setShowResourceManagement(true);
    }
  };

  const handleInfrastructureExportContinue = () => {
    setShowInfrastructureExport(false);
    setShowFileUpload(true);
  };

  const handleBackFromInfrastructureExport = () => {
    setShowInfrastructureExport(false);
    setShowIaCToolConfig(true);
  };

  const handleFileUploadStartAssessment = () => {
    setShowFileUpload(false);
    setShowChatbot(true);
  };

  const handleBackFromFileUpload = () => {
    setShowFileUpload(false);
    if (managementType === 'hybrid') {
      setShowResourceDiscoveryScript(true);
    } else if (showInfrastructureExport) {
      setShowInfrastructureExport(true);
    } else {
      setShowIaCToolConfig(true);
    }
  };

  const closeAssessment = () => {
    setShowAssessment(false);
    setShowScopePage(false);
    setShowProviderPage(false);
    setShowAccountInfoPage(false);
    setShowPremiumAssessment(false);
    setShowPremiumProviderPage(false);
    setShowResourceManagement(false);
    setShowIaCToolConfig(false);
    setShowInfrastructureExport(false);
    setShowFileUpload(false);
    setShowPremiumAccountInfo(false);
    setShowConnectedAssessment(false);
  };

  const handleAssessmentComplete = (score: number) => {
    setAssessmentScore(score);
    setShowAssessment(false);
    setShowScopePage(false);
    setShowProviderPage(false);
    setShowAccountInfoPage(false);
    setShowPremiumAssessment(false);
    setShowPremiumProviderPage(false);
    setShowResourceManagement(false);
    setShowIaCToolConfig(false);
    setShowInfrastructureExport(false);
    setShowFileUpload(false);
    setShowResourceDiscoveryScript(false);
    setShowPremiumAccountInfo(false);
    setShowConnectedAssessment(false);
    setShowConnectionGuide(false);
    setShowConnectionGuide(false);
    // Don't automatically show chatbot for free assessment
  };

  if (showScopePage) {
    return (
      <AssessmentScopePage 
        onBack={handleBackFromScope}
        onContinue={handleScopeSelection}
      />
    );
  }

  if (showProviderPage) {
    return (
      <CloudProviderSelectionPage 
        onBack={handleBackFromProvider}
        onContinue={handleProviderSelection}
      />
    );
  }

  if (showAccountInfoPage && selectedProvider) {
    return (
      <AccountInfoPage 
        onBack={handleBackFromAccountInfo}
        onContinue={handleAccountInfoSubmit}
        selectedProvider={selectedProvider}
      />
    );
  }

  if (showPremiumAssessment) {
    return (
      <PremiumAssessmentPage 
        onBack={handleBackFromPremiumAssessment}
        onContinue={handlePremiumAssessmentSelection}
      />
    );
  }

  if (showPremiumProviderPage && premiumAssessmentType) {
    return (
      <PremiumCloudProviderPage 
        onBack={handleBackFromPremiumProvider}
        onContinue={handlePremiumProviderSelection}
        assessmentType={premiumAssessmentType}
      />
    );
  }

  if (showPremiumAccountInfo && selectedProvider) {
    return (
      <AccountInfoPage 
        onBack={handleBackFromPremiumAccountInfo}
        onContinue={handlePremiumAccountInfoSubmit}
        selectedProvider={selectedProvider}
      />
    );
  }

  if (showConnectionGuide && selectedProvider && accountInfo) {
    return (
      <ConnectionGuidePage 
        onBack={handleBackFromConnectionGuide}
        onContinue={handleConnectionGuideContinue}
        selectedProvider={selectedProvider}
        accountInfo={accountInfo}
      />
    );
  }

  if (showConnectedAssessment && selectedProvider && accountInfo) {
    return (
      <ConnectedAssessmentPage 
        onBack={handleBackFromConnectedAssessment}
        onStartAssessment={handleConnectedAssessmentStart}
        selectedProvider={selectedProvider}
        accountInfo={accountInfo}
      />
    );
  }

  if (showResourceManagement && selectedProvider) {
    return (
      <ResourceManagementPage 
        onBack={handleBackFromResourceManagement}
        onContinue={handleResourceManagementSelection}
        selectedProvider={selectedProvider}
      />
    );
  }

  if (showResourceDiscoveryScript && selectedProvider) {
    return (
      <ResourceDiscoveryScriptPage 
        onBack={handleBackFromResourceDiscoveryScript}
        onContinue={handleResourceDiscoveryScriptContinue}
        selectedProvider={selectedProvider}
      />
    );
  }

  if (showIaCToolConfig && selectedProvider) {
    return (
      <IaCToolConfigPage 
        onBack={handleBackFromIaCToolConfig}
        onContinue={handleIaCToolConfigSelection}
        selectedProvider={selectedProvider}
      />
    );
  }

  if (showInfrastructureExport && selectedProvider && iacConfig?.selectedTool) {
    return (
      <InfrastructureExportPage 
        onBack={handleBackFromInfrastructureExport}
        onContinue={handleInfrastructureExportContinue}
        selectedProvider={selectedProvider}
        selectedTool={iacConfig.selectedTool}
      />
    );
  }

  if (showFileUpload && selectedProvider) {
    return (
      <FileUploadPage 
        onBack={handleBackFromFileUpload}
        onStartAssessment={handleFileUploadStartAssessment}
        selectedProvider={selectedProvider}
      />
    );
  }

  if (showAssessment) {
    return (
      <AssessmentQuestions 
        onComplete={handleAssessmentComplete}
        onClose={closeAssessment}
      />
    );
  }

  if (showChatbot) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full max-w-4xl h-[90vh] flex items-center justify-center">
            <ChatbotWidget forceOpen />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header / Hero Section */}
      <header className="bg-gray-800 text-white py-16 px-6 text-center relative">
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="absolute top-6 right-6 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 font-medium z-10"
        >
          Logout
        </button>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Is Your Cloud Environment mature enough for the future?
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Audit your stack, harden your cloud posture, and embrace cloud-native design.
          </p>
          <button
            onClick={startAssessment}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg mr-4 mb-4 sm:mb-0"
          >
            Start Free Assessment
            <ChevronRight className="ml-2 w-5 h-5" />
          </button>
          <button
            onClick={startPremiumAssessment}
            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Start Premium Assessment
            <ChevronRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </header>
      {/* How It Works Section */}

      {/* What You'll Get Section */}
      <section className="py-16 px-6 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center">
            What You'll Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-700 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-3">
                <Shield className="w-6 h-6 text-blue-600 mr-3" />
                <strong className="text-lg text-white">Architecture Resiliency</strong>
              </div>
              <p className="text-gray-300">Multi-AZ, modular design, fault-tolerance</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-3">
                <Shield className="w-6 h-6 text-green-600 mr-3" />
                <strong className="text-lg text-white">Security Posture</strong>
              </div>
              <p className="text-gray-300">IAM, encryption, segmentation, WAFs</p>
          </div>
            <div className="bg-gray-700 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-3">
                <Network className="w-6 h-6 text-purple-600 mr-3" />
                <strong className="text-lg text-white">Network Design</strong>
        </div>
              <p className="text-gray-300">VPCs, routing, endpoints, DNS</p>
                  </div>
            <div className="bg-gray-700 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-3">
                <DollarSign className="w-6 h-6 text-green-600 mr-3" />
                <strong className="text-lg text-white">Cost Efficiency</strong>
              </div>
              <p className="text-gray-300">Spot usage, right sizing, budgets</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-3">
                <BarChart3 className="w-6 h-6 text-orange-600 mr-3" />
                <strong className="text-lg text-white">Observability</strong>
              </div>
              <p className="text-gray-300">Logs, alarms, tracing, health checks</p>
                </div>
            <div className="bg-gray-700 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-3">
                <Settings className="w-6 h-6 text-blue-600 mr-3" />
                <strong className="text-lg text-white">IaC Best Practices</strong>
              </div>
              <p className="text-gray-300">Reusability, modularity, parameters</p>
            </div>
          </div>
        </div>
      </section>

      

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-gray-700 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span className="mr-2">❓</span>
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Everything You Need to Know
            </h2>
            <p className="text-gray-300 text-lg">
              Get answers to common questions about our cloud maturity assessments
            </p>
          </div>
          
          <div className="space-y-4">
            <FAQItem 
              question="Why do I need a cloud assessment?"
              answer="Cloud environments grow quickly and often inefficiently. Many organizations overspend by 20–40% due to underutilized resources, misconfigurations, and missed discounting opportunities. Additionally: Operations may not scale efficiently or may lack observability. Security risks increase when IAM, storage, or networking aren't tightly managed. Compliance issues may go unnoticed until audits. LeanKloud's 3-level assessment provides a structured way to surface hidden risks and optimization opportunities before they impact your business."
            />
            <FAQItem 
              question="What's the difference between the Free and Premium assessments?"
              answer="Free (Quick Insight): Self-assessment using static questions, no credentials required, instant results with high-level maturity score. Great for leadership teams or quick benchmarking. ⚠️ Limited — no resource-level validation. Premium (AI-Powered Deep Assessment): Two options: Guided Upload (upload JSON files) or Connected Assessment (read-only IAM access). AI analyzes actual infrastructure, generates granular resource-level insights, provides custom recommendations tied to Well-Architected Framework. ⚠️ Requires effort but best for engineering teams, compliance checks, cost optimization."
            />
            <FAQItem 
              question="What data is collected, and do you access my customer data?"
              answer="Survey: No environment data is collected. State file: Only metadata/configuration, not customer or workload data. Remote scan: Read-only config, logs, and performance metrics. No application or customer data is accessed."
            />
            <FAQItem 
              question="How do you guarantee the security of the assessment?"
              answer="All data and files are encrypted at rest and in transit. Access is via read-only roles with least-privilege. Files are securely deleted after use. We sign NDA and data processing agreements. On request, the entire assessment can be run inside your environment (air-gapped mode). We never store account credentials or keys - only read-only IAM roles or uploaded JSON files."
            />
            <FAQItem 
              question="Will the remote scan affect my workloads?"
              answer="No. The scan is completely read-only and does not affect workloads, performance, or latency."
            />
            <FAQItem 
              question="How do you handle compliance frameworks?"
              answer="We check your environment against: CIS Benchmarks (AWS, Azure, GCP), NIST 800-53 (on request), Well-Architected Frameworks. Optional: HIPAA, SOC2, GDPR alignment checks. Recommendations can be mapped to compliance requirements to make audits easier."
            />
            <FAQItem 
              question="Who performs the assessment?"
              answer="A combination of LeanKloud's automated analysis engines and cloud FinOps/SecOps experts. Automation ensures full coverage, and our experts prioritize recommendations by business impact."
            />
            <FAQItem 
              question="What happens after the assessment?"
              answer="You can: Act on the recommendations yourself using our report, work with LeanKloud experts to implement fixes alongside your team, or subscribe to LeanKloud's managed optimization services where we continuously monitor your environment and remediate cost, operations, and security issues proactively."
            />
            <FAQItem 
              question="How often should I run such an assessment?"
              answer="Instead of worrying about periodic assessments, you can subscribe to LeanKloud's continuous optimization offerings. Our team ensures your environment is always monitored, and issues are detected and fixed on an ongoing basis. This gives you continuous cost control, operational reliability, and a strong security posture without manual check-ups."
            />
            <FAQItem 
              question="What if my environment is small — is it still worth it?"
              answer="Yes. Even small environments often overspend by 25–30%. A $10K/month cloud bill can usually be trimmed by $2–3K. For startups and smaller teams, optimization ensures precious budget is used for growth."
            />
            <FAQItem 
              question="How much will this cost me?"
              answer="Level 1 (Survey): Free. Level 2 (State file review): Flat fee (varies by environment size). Level 3 (Remote scan): Custom pricing, typically offset within 1–2 months of savings. Continuous subscription: Flexible pricing tiers based on cloud spend and coverage needs."
            />
            <FAQItem 
              question="Do you offer a proof-of-value?"
              answer="Yes. Most customers start with Level 1 (free) or Level 2 (low cost). This demonstrates immediate savings potential. From there, many choose to move into Level 3 + continuous subscription, where LeanKloud actively manages and optimizes their environment."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;