import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { CheckCircle2, Circle, Loader2, XCircle, Download, Eye } from 'lucide-react';
import { PipelineStage } from '../data/mockData';

interface StageCardProps {
  stage: PipelineStage;
  stageNumber: number;
  onDownload: () => void;
  onView: () => void;
}

export function StageCard({ stage, stageNumber, onDownload, onView }: StageCardProps) {
  const getStatusIcon = () => {
    switch (stage.status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'in-progress':
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pending', className: 'bg-gray-200 text-gray-700' },
      'in-progress': { label: 'In Progress', className: 'bg-blue-500 text-white' },
      completed: { label: 'Completed', className: 'bg-green-500 text-white' },
      error: { label: 'Error', className: 'bg-red-500 text-white' }
    };
    
    const variant = variants[stage.status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getProgressValue = () => {
    switch (stage.status) {
      case 'completed':
        return 100;
      case 'in-progress':
        return 50;
      case 'error':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <Card className="p-6 transition-all hover:shadow-lg border-2 hover:border-blue-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            {stageNumber}
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-gray-100">{stage.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stage.description}</p>
          </div>
        </div>
        {getStatusIcon()}
      </div>

      <div className="space-y-3">
        <Progress value={getProgressValue()} className="h-2" />
        
        <div className="flex items-center justify-between">
          {getStatusBadge()}
          
          {stage.status === 'completed' && (
            <div className="flex gap-2">
              {stage.canView && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onView}
                  className="text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
              )}
              {stage.canDownload && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onDownload}
                  className="text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              )}
            </div>
          )}
        </div>

        {stage.outputFile && stage.status === 'completed' && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Output: {stage.outputFile}
          </p>
        )}
      </div>
    </Card>
  );
}
