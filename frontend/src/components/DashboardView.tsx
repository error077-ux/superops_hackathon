import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { StageCard } from './StageCard';
import { FileUpload } from './FileUpload';
import { ConsoleLog } from './ConsoleLog';
import { Play, RotateCcw } from 'lucide-react';
import { PipelineStage, LogEntry, mockLogs } from '../data/mockData';
import { toast } from 'sonner@2.0.3';

interface DashboardViewProps {
  stages: PipelineStage[];
  onStagesUpdate: (stages: PipelineStage[]) => void;
}

export function DashboardView({ stages, onStagesUpdate }: DashboardViewProps) {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [isRunning, setIsRunning] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const addLog = (stage: string, message: string, type: LogEntry['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [...prev, { timestamp, stage, message, type }]);
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    addLog('Upload', `File selected: ${file.name}`, 'success');
    
    const updatedStages = stages.map((stage, idx) =>
      idx === 0 ? { ...stage, status: 'completed' as const } : stage
    );
    onStagesUpdate(updatedStages);
    toast.success('Dataset uploaded successfully');
  };

  const runComplianceFlow = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a dataset first');
      return;
    }

    setIsRunning(true);
    addLog('System', 'Starting compliance flow...', 'info');

    for (let i = 1; i < stages.length; i++) {
      // Set to in-progress
      const inProgressStages = stages.map((stage, idx) =>
        idx === i ? { ...stage, status: 'in-progress' as const } : stage
      );
      onStagesUpdate(inProgressStages);
      addLog(stages[i].name, `Processing ${stages[i].name}...`, 'info');

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Set to completed
      const completedStages = stages.map((stage, idx) =>
        idx === i ? { ...stage, status: 'completed' as const } : stage
      );
      onStagesUpdate(completedStages);
      addLog(stages[i].name, `${stages[i].name} completed successfully`, 'success');
    }

    setIsRunning(false);
    addLog('System', 'Compliance flow completed!', 'success');
    toast.success('Compliance flow completed successfully!');
  };

  const resetFlow = () => {
    const resetStages = stages.map((stage, idx) => ({
      ...stage,
      status: idx === 0 && uploadedFile ? 'completed' as const : 'pending' as const
    }));
    onStagesUpdate(resetStages);
    setLogs(mockLogs);
    addLog('System', 'Pipeline reset', 'info');
    toast.info('Pipeline reset');
  };

  const handleDownload = (stageName: string) => {
    addLog(stageName, `Downloading ${stageName} output...`, 'info');
    toast.success(`${stageName} output downloaded`);
  };

  const handleView = (stageName: string) => {
    addLog(stageName, `Viewing ${stageName} output...`, 'info');
    toast.info(`Opening ${stageName} output`);
  };

  const allStagesCompleted = stages.every(stage => stage.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
        <h2 className="mb-2">Compliance Automation Pipeline</h2>
        <p className="text-blue-100">
          Upload your dataset and run the automated compliance flow through all stages
        </p>
      </Card>

      {/* Control Panel */}
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-gray-900 dark:text-gray-100">Pipeline Control</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {allStagesCompleted ? 'All stages completed' : 'Ready to process'}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={resetFlow}
              variant="outline"
              disabled={isRunning}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Pipeline
            </Button>
            <Button
              onClick={runComplianceFlow}
              disabled={isRunning || !uploadedFile}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : 'Run Compliance Flow'}
            </Button>
          </div>
        </div>
      </Card>

      {/* File Upload */}
      <FileUpload onFileSelect={handleFileSelect} />

      {/* Pipeline Stages */}
      <div className="space-y-4">
        <h3 className="text-gray-900 dark:text-gray-100">Pipeline Stages</h3>
        {stages.slice(1).map((stage, index) => (
          <StageCard
            key={stage.id}
            stage={stage}
            stageNumber={index + 2}
            onDownload={() => handleDownload(stage.name)}
            onView={() => handleView(stage.name)}
          />
        ))}
      </div>

      {/* Console Logs */}
      <ConsoleLog logs={logs} />
    </div>
  );
}
