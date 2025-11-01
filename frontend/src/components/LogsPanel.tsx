// components/LogsPanel.tsx - Fixed filtering logic

import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Terminal, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';
import { LogEntry } from '../data/mockData';

interface LogsPanelProps {
  logs: LogEntry[];
}

export function LogsPanel({ logs }: LogsPanelProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Filter tabs with proper mapping
  const filters = [
    { id: 'all', label: 'All', process: null },
    { id: 'system', label: 'System', process: 'System' },
    { id: 'rule_engine', label: 'Rule Engine', process: 'Rule Application' },
    { id: 'segregator', label: 'Segregator', process: 'Data Segregation' },
    { id: 'llm', label: 'LLM', process: 'LLM Reasoner' },
    { id: 'parser', label: 'Parser', process: 'Compliance Parser' }
  ];

  // Filter logs based on active tab
  const filteredLogs = activeFilter === 'all' 
    ? logs 
    : logs.filter(log => {
        const filter = filters.find(f => f.id === activeFilter);
        if (!filter || !filter.process) return false;
        
        // Match by process field
        return log.process === filter.process || log.stage === filter.process;
      });

  // Count logs by type for each filter
  const getFilterCount = (filterId: string) => {
    if (filterId === 'all') return logs.length;
    
    const filter = filters.find(f => f.id === filterId);
    if (!filter || !filter.process) return 0;
    
    return logs.filter(log => 
      log.process === filter.process || log.stage === filter.process
    ).length;
  };

  // Get icon for log type
  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  // Count by type
  const counts = {
    info: filteredLogs.filter(l => l.type === 'info').length,
    success: filteredLogs.filter(l => l.type === 'success').length,
    warning: filteredLogs.filter(l => l.type === 'warning').length,
    error: filteredLogs.filter(l => l.type === 'error').length
  };

  return (
    <Card className="p-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <Terminal className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">Real-time Execution Logs</h3>
            <p className="text-sm text-gray-400">{filteredLogs.length} log entries</p>
          </div>
        </div>
        <button 
          onClick={() => setActiveFilter('all')}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          ↑ Collapse
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeFilter === filter.id
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white border border-transparent'
            }`}
          >
            {filter.label}
            {getFilterCount(filter.id) > 0 && (
              <span className="ml-2 text-xs opacity-70">({getFilterCount(filter.id)})</span>
            )}
          </button>
        ))}
      </div>

      {/* Logs Container */}
      <div className="bg-gray-900/50 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-700/50">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8">
            <Terminal className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">
              No logs for {filters.find(f => f.id === activeFilter)?.label}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-2 rounded hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-xs text-gray-500 font-mono min-w-[70px]">
                  [{log.timestamp}]
                </span>
                {getLogIcon(log.type)}
                <Badge
                  variant="outline"
                  className="text-xs bg-gray-700/50 border-gray-600 text-gray-300 min-w-[140px] justify-center"
                >
                  {log.process}
                </Badge>
                <span className={`text-sm flex-1 ${
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'warning' ? 'text-yellow-400' :
                  'text-gray-300'
                }`}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span className="text-xs text-gray-400">{counts.info} Info</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-xs text-gray-400">{counts.success} Success</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span className="text-xs text-gray-400">{counts.warning} Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <span className="text-xs text-gray-400">{counts.error} Error</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
