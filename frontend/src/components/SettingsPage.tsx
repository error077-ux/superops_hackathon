import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  Settings, 
  Key, 
  Bell, 
  Database, 
  Shield, 
  Download, 
  Eye, 
  EyeOff,
  Save,
  RotateCcw,
  User,
  Mail,
  Building,
  Globe,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bot
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function SettingsPage() {
  const [apiKey, setApiKey] = useState('sk-proj-••••••••••••••••••••');
  const [showApiKey, setShowApiKey] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoExport, setAutoExport] = useState(false);
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [userName, setUserName] = useState('John Doe');
  const [userEmail, setUserEmail] = useState('john.doe@acme.com');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [retentionDays, setRetentionDays] = useState('90');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('30');

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  const handleResetSettings = () => {
    toast.info('Settings reset to defaults');
  };

  const handleTestConnection = () => {
    toast.loading('Testing API connection...', { id: 'api-test' });
    setTimeout(() => {
      toast.success('API connection successful!', { id: 'api-test' });
    }, 2000);
  };

  const handleTestWebhook = () => {
    toast.loading('Testing webhook...', { id: 'webhook-test' });
    setTimeout(() => {
      toast.success('Webhook test successful!', { id: 'webhook-test' });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-700 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-white mb-1">Settings & Configuration</h2>
            <p className="text-gray-400">
              Manage your compliance platform preferences and integrations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">AI Assistant Available</span>
          </div>
        </div>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="api" className="space-y-6">
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="api" className="data-[state=active]:bg-gray-700">
            <Key className="w-4 h-4 mr-2" />
            API Configuration
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-gray-700">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-gray-700">
            <Database className="w-4 h-4 mr-2" />
            Data & Storage
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-gray-700">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-gray-700">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
        </TabsList>

        {/* API Configuration */}
        <TabsContent value="api" className="space-y-6">
          <Card className="p-6 bg-gray-800/50 border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Key className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white">Backend API Settings</h3>
                <p className="text-sm text-gray-400">Configure your backend connection and credentials</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="api-endpoint" className="text-gray-300">API Endpoint URL</Label>
                <Input
                  id="api-endpoint"
                  defaultValue="https://api.superops.io/v1"
                  className="mt-2 bg-gray-900/50 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="api-key" className="text-gray-300">API Key</Label>
                <div className="mt-2 flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="api-key"
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="bg-gray-900/50 border-gray-600 text-white pr-10"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button onClick={handleTestConnection} variant="outline" className="border-gray-600">
                    Test Connection
                  </Button>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div>
                <Label htmlFor="llm-provider" className="text-gray-300">LLM Provider</Label>
                <Select defaultValue="openai">
                  <SelectTrigger className="mt-2 bg-gray-900/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                    <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                    <SelectItem value="azure">Azure OpenAI</SelectItem>
                    <SelectItem value="custom">Custom Endpoint</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="llm-key" className="text-gray-300">LLM API Key</Label>
                <Input
                  id="llm-key"
                  type="password"
                  defaultValue="sk-••••••••••••••••••••"
                  className="mt-2 bg-gray-900/50 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="timeout" className="text-gray-300">Request Timeout (seconds)</Label>
                <Select defaultValue="60">
                  <SelectTrigger className="mt-2 bg-gray-900/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">60 seconds</SelectItem>
                    <SelectItem value="120">120 seconds</SelectItem>
                    <SelectItem value="300">300 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Webhook Configuration */}
          <Card className="p-6 bg-gray-800/50 border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Globe className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white">Webhook Integration</h3>
                <p className="text-sm text-gray-400">Receive real-time updates via webhooks</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="webhook-url" className="text-gray-300">Webhook URL</Label>
                <div className="mt-2 flex gap-2">
                  <Input
                    id="webhook-url"
                    placeholder="https://your-domain.com/webhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500"
                  />
                  <Button onClick={handleTestWebhook} variant="outline" className="border-gray-600">
                    Test Webhook
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-white text-sm">Enable Webhook Events</p>
                    <p className="text-xs text-gray-400">Receive notifications for workflow events</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6 bg-gray-800/50 border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-teal-500/10">
                <Bell className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="text-white">Notification Preferences</h3>
                <p className="text-sm text-gray-400">Choose how you want to be notified</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div>
                  <p className="text-white">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive updates via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div>
                  <p className="text-white">Browser Notifications</p>
                  <p className="text-sm text-gray-400">Get push notifications in your browser</p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>

              <Separator className="bg-gray-700" />

              <div className="space-y-3">
                <Label className="text-gray-300">Notify me when:</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-900/30 rounded">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-300">Workflow completes successfully</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-900/30 rounded">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-300">Workflow fails or encounters errors</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-900/30 rounded">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-300">New compliance issues detected</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-900/30 rounded">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-300">Dataset upload completes</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-900/30 rounded">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-300">Weekly compliance summary</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Data & Storage */}
        <TabsContent value="data" className="space-y-6">
          <Card className="p-6 bg-gray-800/50 border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Database className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-white">Data Management</h3>
                <p className="text-sm text-gray-400">Control how your data is stored and exported</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white">Auto-Export Results</p>
                    <p className="text-sm text-gray-400">Automatically save reports after completion</p>
                  </div>
                </div>
                <Switch checked={autoExport} onCheckedChange={setAutoExport} />
              </div>

              <div>
                <Label htmlFor="export-format" className="text-gray-300">Default Export Format</Label>
                <Select defaultValue="csv">
                  <SelectTrigger className="mt-2 bg-gray-900/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-gray-700" />

              <div>
                <Label htmlFor="retention" className="text-gray-300">Data Retention Period</Label>
                <Select value={retentionDays} onValueChange={setRetentionDays}>
                  <SelectTrigger className="mt-2 bg-gray-900/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-2">Old reports will be automatically archived</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white">Auto-Refresh Dashboard</p>
                    <p className="text-sm text-gray-400">Automatically update data in real-time</p>
                  </div>
                </div>
                <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              </div>

              {autoRefresh && (
                <div>
                  <Label htmlFor="refresh-interval" className="text-gray-300">Refresh Interval</Label>
                  <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                    <SelectTrigger className="mt-2 bg-gray-900/50 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="10">Every 10 seconds</SelectItem>
                      <SelectItem value="30">Every 30 seconds</SelectItem>
                      <SelectItem value="60">Every 1 minute</SelectItem>
                      <SelectItem value="300">Every 5 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </Card>

          {/* Storage Usage */}
          <Card className="p-6 bg-gray-800/50 border-gray-700">
            <h3 className="text-white mb-4">Storage Usage</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Datasets</span>
                  <span className="text-gray-400">2.4 GB / 10 GB</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '24%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Reports</span>
                  <span className="text-gray-400">845 MB / 5 GB</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '17%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Logs</span>
                  <span className="text-gray-400">320 MB / 2 GB</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '16%' }} />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6 bg-gray-800/50 border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Shield className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-white">Security & Privacy</h3>
                <p className="text-sm text-gray-400">Protect your compliance data</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-green-300">Two-Factor Authentication Enabled</p>
                  <p className="text-sm text-green-400/70 mt-1">Your account is protected with 2FA</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div>
                  <p className="text-white">Encrypt Data at Rest</p>
                  <p className="text-sm text-gray-400">AES-256 encryption for stored data</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div>
                  <p className="text-white">Encrypt Data in Transit</p>
                  <p className="text-sm text-gray-400">TLS 1.3 for API communications</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div>
                  <p className="text-white">Audit Logging</p>
                  <p className="text-sm text-gray-400">Track all system access and changes</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator className="bg-gray-700" />

              <div>
                <Label className="text-gray-300 mb-3 block">Session Management</Label>
                <Select defaultValue="4h">
                  <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="1h">Expire after 1 hour</SelectItem>
                    <SelectItem value="4h">Expire after 4 hours</SelectItem>
                    <SelectItem value="8h">Expire after 8 hours</SelectItem>
                    <SelectItem value="24h">Expire after 24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="w-full border-red-600 text-red-400 hover:bg-red-950">
                <AlertCircle className="w-4 h-4 mr-2" />
                View Security Audit Log
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6 bg-gray-800/50 border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white">User Profile</h3>
                <p className="text-sm text-gray-400">Manage your account information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="user-name" className="text-gray-300">Full Name</Label>
                <Input
                  id="user-name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-2 bg-gray-900/50 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="user-email" className="text-gray-300">Email Address</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="user-email"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="pl-10 bg-gray-900/50 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company" className="text-gray-300">Company Name</Label>
                <div className="relative mt-2">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="pl-10 bg-gray-900/50 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="role" className="text-gray-300">Role</Label>
                <Select defaultValue="admin">
                  <SelectTrigger className="mt-2 bg-gray-900/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="compliance">Compliance Officer</SelectItem>
                    <SelectItem value="analyst">Security Analyst</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-gray-700" />

              <div>
                <Label className="text-gray-300 mb-3 block">Account Plan</Label>
                <div className="p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Enterprise Plan</p>
                      <p className="text-sm text-gray-400">Unlimited workflows & users</p>
                    </div>
                    <Badge className="bg-blue-600 text-white">Active</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card className="p-6 bg-gray-800/50 border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-gray-400">Need help? Ask the AI Assistant</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleResetSettings} variant="outline" className="border-gray-600">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button onClick={handleSaveSettings} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
