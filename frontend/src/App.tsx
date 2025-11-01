// App.tsx - Complete with Authentication, Notifications & Logout

import { useState, useEffect } from 'react';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import {
  LayoutDashboard,
  BarChart3,
  Database,
  FileText,
  Settings,
  Bell,
  Shield,
  Bot,
  LogOut,
  User,
} from 'lucide-react';
import { KPICards } from './components/KPICards';
import { FlowVisualizer } from './components/FlowVisualizer';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { DataExplorer } from './components/DataExplorer';
import { LogsPanel } from './components/LogsPanel';
import { UploadPanel } from './components/UploadPanel';
import { CompletionBanner } from './components/CompletionBanner';
import { ChatBot } from './components/ChatBot';
import { SettingsPage } from './components/SettingsPage';
import { NotificationPanel } from './components/NotificationPanel';
import { LoginPage } from './components/LoginPage';
import { initialStages, mockLogs, LogEntry, PipelineStage, FileMetadata } from './data/mockData';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Backend API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Types for backend responses
interface ComplianceRecord {
  framework: string;
  obligationId: string;
  description: string;
  status: 'Compliant' | 'Non-Compliant' | 'Requires Action';
  confidence_score: number;
  category: string;
  severity: 'High' | 'Medium' | 'Low';
  action: string;
  reason: string;
}

interface DashboardMetrics {
  total_records: { value: number; label: string; color: string };
  compliant: { value: number; label: string; percentage: number; color: string };
  non_compliant: { value: number; label: string; percentage: number; color: string };
  requires_action: { value: number; label: string; percentage: number; color: string };
  avg_confidence: { value: number; label: string; color: string };
  high_severity: { value: number; label: string; color: string };
  total_rules?: { value: number; label: string; description: string; color: string };
  unique_obligations?: { value: number; label: string; description: string; color: string };
  compliance_accuracy?: { value: number; label: string; description: string; color: string };
  avg_processing_time?: { value: number; label: string; description: string; unit: string; color: string };
}

export default function App() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // App states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stages, setStages] = useState<PipelineStage[]>(initialStages);
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [isRunning, setIsRunning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [fileId, setFileId] = useState<string | null>(null);
  
  // Notification states
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Real data from backend
  const [complianceData, setComplianceData] = useState<ComplianceRecord[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [backendConnected, setBackendConnected] = useState(false);

  // Initialize dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    
    setIsCheckingAuth(false);
  }, []);

  // Check backend connection on mount
  useEffect(() => {
    if (isAuthenticated) {
      checkBackendConnection();
    }
  }, [isAuthenticated]);

  // Load dashboard metrics on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardMetrics();
      loadComplianceResults();
      loadBackendLogs();
    }
  }, [isAuthenticated]);

  // Auto-refresh data every 5 seconds when not running
  useEffect(() => {
    if (isAuthenticated && !isRunning) {
      const interval = setInterval(() => {
        loadDashboardMetrics();
        loadBackendLogs();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, isRunning]);

  // Poll for new notifications every 10 seconds
  useEffect(() => {
    if (isAuthenticated) {
      const checkNotifications = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/notifications/unread`);
          if (response.ok) {
            const data = await response.json();
            setNotificationCount(data.count);
          }
        } catch (error) {
          console.error('Failed to check notifications:', error);
        }
      };

      checkNotifications();
      const interval = setInterval(checkNotifications, 10000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Authentication handlers
  const handleLoginSuccess = (token: string, userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    toast.success(`Welcome back, ${userData.name}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setShowUserMenu(false);
    toast.info('Logged out successfully');
  };

  // Backend API calls
  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        setBackendConnected(true);
        console.log('✅ Backend connected');
      }
    } catch (error) {
      setBackendConnected(false);
      console.error('❌ Backend not connected:', error);
    }
  };

  const loadDashboardMetrics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/metrics`);
      if (response.ok) {
        const data = await response.json();
        setDashboardMetrics(data);
      }
    } catch (error) {
      console.error('Failed to load dashboard metrics:', error);
    }
  };

  const loadComplianceResults = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/compliance/results?limit=100`);
      if (response.ok) {
        const data = await response.json();
        setComplianceData(data.results || []);
      }
    } catch (error) {
      console.error('Failed to load compliance results:', error);
    }
  };

  const loadBackendLogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logs?limit=50`);
      if (response.ok) {
        const data = await response.json();
        const formattedLogs: LogEntry[] = data.logs.map((log: any) => ({
          timestamp: new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false }),
          stage: log.stage,
          message: log.message,
          type: log.type as LogEntry['type'],
          process: log.process as LogEntry['process'],
        }));
        setLogs(formattedLogs);
      }
    } catch (error) {
      console.error('Failed to load backend logs:', error);
    }
  };

  const addLog = (stage: string, message: string, type: LogEntry['type'] = 'info', process: LogEntry['process'] = 'System') => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs((prev) => [...prev, { timestamp, stage, message, type, process }]);
  };

  const handleFileSelect = async (file: File) => {
    console.log('📤 File selected:', file.name);
    
    setIsUploading(true);
    addLog('System', `Uploading file: ${file.name}`, 'info', 'System');
    toast.info('Uploading file...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading to:', `${API_BASE_URL}/upload`);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log('Upload result:', result);

      const uploadedFileId = result.file_id || result.data?.file_id;
      const uploadedFilename = result.filename || result.data?.filename || file.name;
      const rowCount = result.rows || result.data?.rows || 0;

      if (!uploadedFileId) {
        console.error('No file_id in response:', result);
        throw new Error('No file_id returned from server');
      }

      setFileId(uploadedFileId);
      setFileMetadata({
        name: uploadedFilename,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        rows: rowCount,
      });

      addLog('System', `File uploaded successfully: ${uploadedFilename} (${rowCount} rows)`, 'success', 'System');
      toast.success('File uploaded successfully!', {
        description: `${rowCount} records loaded`,
      });

      console.log('✅ Upload successful, file_id:', uploadedFileId);

    } catch (error) {
      console.error('❌ Upload error:', error);
      addLog('System', `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error', 'System');
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleExecute = async (mode: 'quick' | 'full') => {
    if (!fileId) {
      toast.error('Please upload a dataset first');
      return;
    }

    console.log('=== STARTING EXECUTE ===');
    console.log('File ID:', fileId);
    console.log('Mode:', mode);
    console.log('API URL:', `${API_BASE_URL}/execute`);

    setComplianceData([]);
    setShowCompletion(false);
    setIsRunning(true);
    addLog('System', `Starting ${mode} compliance workflow...`, 'info', 'System');
    toast.info(`Executing ${mode} workflow...`);

    try {
      const url = `${API_BASE_URL}/execute`;
      console.log('Fetching:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_id: fileId, mode }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Pipeline execution failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success result:', result);

      setStages(result.stages);
      await loadComplianceResults();
      await loadDashboardMetrics();
      await loadBackendLogs();

      setShowCompletion(true);
      toast.success('Compliance workflow completed!', {
        description: 'Your report is ready for review',
      });

    } catch (error) {
      console.error('Execute error:', error);
      toast.error('Failed to execute compliance workflow');
      addLog('System', `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error', 'System');
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setStages(initialStages);
    setShowCompletion(false);
    setFileId(null);
    setFileMetadata(null);
    setComplianceData([]);
    addLog('System', 'Workflow reset - all previous data cleared', 'info', 'System');
    toast.info('Workflow reset - ready for new dataset');
  };

  const handleExport = () => {
    if (complianceData.length === 0) {
      toast.error('No compliance data to export');
      return;
    }

    const csvContent = [
      'Framework,Obligation ID,Description,Status,Confidence,Category,Severity,Action,Reason',
      ...complianceData.map((record) =>
        [
          record.framework,
          record.obligationId,
          record.description,
          record.status,
          record.confidence_score.toString(),
          record.category,
          record.severity,
          record.action,
          record.reason,
        ]
          .map((cell) => `"${cell}"`)
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compliance-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Compliance report exported successfully');
  };

  // Loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLoginSuccess={handleLoginSuccess} />
        <Toaster theme="dark" />
      </>
    );
  }

  const allStagesCompleted = stages.every((stage) => stage.status === 'completed');

  const kpiData = dashboardMetrics
    ? {
        totalRules: dashboardMetrics.total_rules?.value || 0,
        uniqueObligations: dashboardMetrics.unique_obligations?.value || 0,
        complianceAccuracy: dashboardMetrics.compliance_accuracy?.value || 90,
        avgProcessingTime: dashboardMetrics.avg_processing_time?.value || 0,
      }
    : {
        totalRules: 0,
        uniqueObligations: 0,
        complianceAccuracy: 90,
        avgProcessingTime: 0,
      };

  return (
    <div className="dark">
      <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        {/* Left Sidebar */}
        <div className="w-20 bg-gray-900/50 border-r border-gray-800 backdrop-blur-sm flex flex-col items-center py-6 gap-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20">
            <Shield className="w-8 h-8 text-white" />
          </div>

          <div className="w-12 h-px bg-gray-800"></div>

          <nav className="flex flex-col gap-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`p-3 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              title="Dashboard"
            >
              <LayoutDashboard className="w-6 h-6" />
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`p-3 rounded-xl transition-all ${
                activeTab === 'analytics'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              title="Analytics"
            >
              <BarChart3 className="w-6 h-6" />
            </button>

            <button
              onClick={() => setActiveTab('data')}
              className={`p-3 rounded-xl transition-all ${
                activeTab === 'data'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              title="Data Explorer"
            >
              <Database className="w-6 h-6" />
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`p-3 rounded-xl transition-all ${
                activeTab === 'results'
                  ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              title="Results"
            >
              <FileText className="w-6 h-6" />
            </button>
          </nav>

          <div className="mt-auto flex flex-col gap-4">
            <button
              onClick={() => setActiveTab('settings')}
              className={`p-3 rounded-xl transition-all relative ${
                activeTab === 'settings' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              title="Settings"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navbar */}
          <header className="h-20 bg-gray-900/50 border-b border-gray-800 backdrop-blur-sm px-8 flex items-center justify-between">
            <div>
              <h1 className="text-white flex items-center gap-3">
                <Bot className="w-7 h-7 text-blue-400" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">SuperOps</span>
                <span className="text-gray-400">Compliance Intelligence</span>
              </h1>
              <p className="text-sm text-gray-500">AI-Powered Automation for Smarter IT Compliance</p>
            </div>

            <div className="flex items-center gap-4">
              {isRunning && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-400">Processing...</span>
                </motion.div>
              )}

              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                backendConnected ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className={`text-xs ${backendConnected ? 'text-green-400' : 'text-red-400'}`}>
                  {backendConnected ? 'Backend Connected' : 'Backend Offline'}
                </span>
              </div>

              {/* Notifications Button */}
              <button 
                className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm">{user?.name}</span>
                </button>

                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
                  >
                    <div className="p-3 border-b border-gray-700">
                      <p className="text-white font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                      <p className="text-xs text-gray-500 mt-1 capitalize">{user?.role}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-auto p-8 pb-32">
            <div className="max-w-[1600px] mx-auto space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="hidden">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="data">Data Explorer</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6 mt-0">
                  <KPICards {...kpiData} />
                  {showCompletion && allStagesCompleted && (
                    <CompletionBanner onDownload={handleExport} onViewResults={() => setActiveTab('results')} />
                  )}
                  <UploadPanel
                    onFileSelect={handleFileSelect}
                    onExecute={handleExecute}
                    onReset={handleReset}
                    isRunning={isRunning}
                    isUploading={isUploading}
                    fileMetadata={fileMetadata}
                  />
                  <FlowVisualizer stages={stages} />
                  <LogsPanel logs={logs} />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6 mt-0">
                  <Card className="p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-white mb-2">Analytics & Insights</h2>
                        <p className="text-gray-300">Comprehensive visualization of compliance metrics and performance data</p>
                      </div>
                      <Bot className="w-8 h-8 text-purple-400 opacity-50" />
                    </div>
                  </Card>
                  <KPICards {...kpiData} />
                  <AnalyticsDashboard data={complianceData} />
                </TabsContent>

                <TabsContent value="data" className="space-y-6 mt-0">
                  <Card className="p-6 bg-gradient-to-r from-teal-600/20 to-blue-600/20 border-teal-500/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-white mb-2">Data Explorer</h2>
                        <p className="text-gray-300">Interactive exploration of compliance records with advanced filtering and sorting</p>
                      </div>
                      <Bot className="w-8 h-8 text-teal-400 opacity-50" />
                    </div>
                  </Card>
                  <DataExplorer data={complianceData} onExport={handleExport} />
                </TabsContent>

                <TabsContent value="results" className="space-y-6 mt-0">
                  <Card className="p-6 bg-gradient-to-r from-green-600/20 to-teal-600/20 border-green-500/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h2 className="text-white mb-2">Compliance Results</h2>
                          <p className="text-gray-300">Final compliance report with detailed obligations and status</p>
                        </div>
                        <Bot className="w-8 h-8 text-green-400 opacity-50" />
                      </div>
                      <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
                        <FileText className="w-4 h-4 mr-2" />
                        Export Report
                      </Button>
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <Card className="p-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Total Records</p>
                          <h3 className="text-white">{complianceData.length}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-500/10">
                          <Database className="w-6 h-6 text-blue-400" />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Compliant</p>
                          <h3 className="text-white">{complianceData.filter((r) => r.status === 'Compliant').length}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-green-500/10">
                          <Shield className="w-6 h-6 text-green-400" />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Requires Action</p>
                          <h3 className="text-white">{complianceData.filter((r) => r.status !== 'Compliant').length}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-red-500/10">
                          <Badge className="w-6 h-6 text-red-400" />
                        </div>
                      </div>
                    </Card>
                  </div>

                  <DataExplorer data={complianceData} onExport={handleExport} />
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                  <SettingsPage />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        unreadCount={notificationCount}
        onCountChange={setNotificationCount}
      />

      {/* Floating Chatbot */}
      <ChatBot />

      <Toaster theme="dark" />
    </div>
  );
}
