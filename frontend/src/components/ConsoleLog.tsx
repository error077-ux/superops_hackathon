import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { LogEntry } from '../data/mockData';
import { Terminal, Info, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

interface ConsoleLogProps {
  logs: LogEntry[];
}

export function ConsoleLog({ logs }: ConsoleLogProps) {
  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Card className="p-4 bg-gray-900 border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <Terminal className="w-5 h-5 text-green-400" />
        <h3 className="text-green-400">Console Logs</h3>
      </div>
      
      <ScrollArea className="h-64">
        <div className="space-y-2 font-mono text-sm">
          {logs.map((log, index) => (
            <div key={index} className="flex items-start gap-2 text-gray-300">
              <span className="text-gray-500 text-xs">[{log.timestamp}]</span>
              {getLogIcon(log.type)}
              <span className="text-gray-400">{log.stage}:</span>
              <span className={getLogColor(log.type)}>{log.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
