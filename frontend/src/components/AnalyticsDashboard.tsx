// components/AnalyticsDashboard.tsx - Updated to use real backend data

import { Card } from './ui/card';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ComplianceRecord {
  framework: string;
  status: string;
  category: string;
  severity: string;
  confidence_score: number;
  action: string;
}

interface AnalyticsDashboardProps {
  data: ComplianceRecord[];
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  // Calculate category breakdown from real data
  const categoryBreakdown = calculateCategoryBreakdown(data);
  
  // Calculate compliance ratio
  const complianceRatio = calculateComplianceRatio(data);
  
  // Calculate action distribution
  const actionDistribution = calculateActionDistribution(data);
  
  // Calculate severity distribution
  const severityDistribution = calculateSeverityDistribution(data);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Breakdown */}
      <Card className="p-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <h3 className="text-white mb-4">Category Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryBreakdown}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="category" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
            <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Compliance Ratio */}
      <Card className="p-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <h3 className="text-white mb-4">Compliance Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={complianceRatio}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {complianceRatio.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Action Distribution */}
      <Card className="p-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <h3 className="text-white mb-4">Action Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={actionDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="action" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
            <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Bar dataKey="count" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Severity Distribution */}
      <Card className="p-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <h3 className="text-white mb-4">Severity Levels</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={severityDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {severityDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getSeverityColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Confidence Score Distribution */}
      <Card className="p-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm col-span-1 lg:col-span-2">
        <h3 className="text-white mb-4">Confidence Score Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={calculateConfidenceDistribution(data)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="range" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
            <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// Helper functions to calculate real data
function calculateCategoryBreakdown(data: ComplianceRecord[]) {
  const breakdown: { [key: string]: number } = {};
  
  data.forEach(record => {
    const category = record.category || 'Unknown';
    breakdown[category] = (breakdown[category] || 0) + 1;
  });
  
  return Object.entries(breakdown).map(([category, count]) => ({
    category,
    count
  }));
}

function calculateComplianceRatio(data: ComplianceRecord[]) {
  const statusCount: { [key: string]: number } = {};
  
  data.forEach(record => {
    const status = record.status || 'Unknown';
    statusCount[status] = (statusCount[status] || 0) + 1;
  });
  
  return Object.entries(statusCount).map(([name, value]) => ({
    name,
    value
  }));
}

function calculateActionDistribution(data: ComplianceRecord[]) {
  const actionCount: { [key: string]: number } = {};
  
  data.forEach(record => {
    const action = record.action || 'unknown';
    actionCount[action] = (actionCount[action] || 0) + 1;
  });
  
  return Object.entries(actionCount).map(([action, count]) => ({
    action,
    count
  }));
}

function calculateSeverityDistribution(data: ComplianceRecord[]) {
  const severityCount: { [key: string]: number } = {};
  
  data.forEach(record => {
    const severity = record.severity || 'Unknown';
    severityCount[severity] = (severityCount[severity] || 0) + 1;
  });
  
  return Object.entries(severityCount).map(([name, value]) => ({
    name,
    value
  }));
}

function calculateConfidenceDistribution(data: ComplianceRecord[]) {
  const ranges = ['0-20', '20-40', '40-60', '60-80', '80-100'];
  const distribution = ranges.map(range => ({ range, count: 0 }));
  
  data.forEach(record => {
    const score = record.confidence_score || 0;
    if (score <= 20) distribution[0].count++;
    else if (score <= 40) distribution[1].count++;
    else if (score <= 60) distribution[2].count++;
    else if (score <= 80) distribution[3].count++;
    else distribution[4].count++;
  });
  
  return distribution;
}

function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'high':
    case 'critical':
      return '#ef4444';  // Red
    case 'medium':
      return '#f59e0b';  // Orange
    case 'low':
      return '#10b981';  // Green
    default:
      return '#6b7280';  // Gray
  }
}
