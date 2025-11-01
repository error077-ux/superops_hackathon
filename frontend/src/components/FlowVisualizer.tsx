import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, Circle, Loader2, XCircle, ChevronRight, Clock, Database } from 'lucide-react';
import { PipelineStage } from '../data/mockData';
import { motion } from 'motion/react';

interface FlowVisualizerProps {
  stages: PipelineStage[];
}

export function FlowVisualizer({ stages }: FlowVisualizerProps) {
  const getStatusIcon = (status: PipelineStage['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-green-400" />;
      case 'running':
        return <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-400" />;
      default:
        return <Circle className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: PipelineStage['status']) => {
    const variants: Record<PipelineStage['status'], { label: string; className: string }> = {
      pending: { label: 'Pending', className: 'bg-gray-700 text-gray-300 border-gray-600' },
      running: { label: 'Running', className: 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/50' },
      completed: { label: 'Completed', className: 'bg-green-600 text-white border-green-500 shadow-lg shadow-green-500/50' },
      error: { label: 'Error', className: 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-500/50' }
    };
    
    const variant = variants[status];
    return <Badge className={`${variant.className} border`}>{variant.label}</Badge>;
  };

  return (
    <Card className="p-8 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-white mb-2">Workflow Pipeline</h3>
        <p className="text-sm text-gray-400">Real-time execution status and performance metrics</p>
      </div>

      <div className="relative">
        {/* Connection Lines */}
        <div className="absolute top-24 left-0 right-0 h-0.5 bg-gray-700 hidden lg:block" />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Arrow Connector */}
              {index < stages.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-20 z-10 items-center justify-center w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-700">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              )}

              <Card 
                className={`p-6 border-2 transition-all duration-300 ${
                  stage.status === 'running' 
                    ? 'border-blue-500 shadow-xl shadow-blue-500/20 bg-gray-800/80' 
                    : stage.status === 'completed'
                    ? 'border-green-500/50 bg-gray-800/60'
                    : 'border-gray-700 bg-gray-800/40'
                }`}
                style={{
                  boxShadow: stage.status === 'running' 
                    ? `0 0 30px ${stage.color}40` 
                    : undefined
                }}
              >
                {/* Stage Icon & Status */}
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="p-4 rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: `${stage.color}20`,
                      border: `2px solid ${stage.color}40`
                    }}
                  >
                    {getStatusIcon(stage.status)}
                  </div>
                  {getStatusBadge(stage.status)}
                </div>

                {/* Stage Info */}
                <div className="mb-4">
                  <h4 className="text-white mb-1">{stage.name}</h4>
                  <p className="text-xs text-gray-400">{stage.description}</p>
                </div>

                {/* Metrics */}
                {stage.status !== 'pending' && (
                  <div className="space-y-2 pt-4 border-t border-gray-700">
                    {stage.executionTime !== undefined && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Execution Time
                        </span>
                        <span className="text-gray-300">{stage.executionTime}s</span>
                      </div>
                    )}
                    {stage.recordsProcessed !== undefined && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Database className="w-3 h-3" />
                          Records Processed
                        </span>
                        <span className="text-gray-300">{stage.recordsProcessed}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Progress Bar for Running */}
                {stage.status === 'running' && (
                  <div className="mt-4">
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: stage.color }}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}
