import { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Upload, File, X, Play, RotateCcw, Database, Layers, CheckCircle2 } from 'lucide-react';
import { FileMetadata } from '../data/mockData';
import { motion } from 'motion/react';

interface UploadPanelProps {
  onFileSelect: (file: File, metadata: FileMetadata) => void;
  onExecute: (mode: 'quick' | 'full') => void;
  onReset: () => void;
  isRunning: boolean;
  fileMetadata: FileMetadata | null;
}

export function UploadPanel({ onFileSelect, onExecute, onReset, isRunning, fileMetadata }: UploadPanelProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [runMode, setRunMode] = useState<'quick' | 'full'>('full');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'text/csv' || file.type === 'application/json' || file.name.endsWith('.csv') || file.name.endsWith('.json'))) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    
    // Simulate file analysis
    const metadata: FileMetadata = {
      name: file.name,
      size: file.size,
      rows: Math.floor(Math.random() * 5000) + 1000,
      columns: Math.floor(Math.random() * 20) + 10,
      uploadedAt: new Date().toISOString()
    };
    
    onFileSelect(file, metadata);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/csv' || file.type === 'application/json' || file.name.endsWith('.csv') || file.name.endsWith('.json'))) {
      processFile(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="p-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white">Dataset Upload</h3>
          {selectedFile && (
            <Badge className="bg-green-600 text-white border-green-500">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Ready
            </Badge>
          )}
        </div>
        
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-500/10 scale-105'
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="p-4 rounded-full bg-blue-500/10 w-fit mx-auto mb-4">
                <Upload className="w-12 h-12 text-blue-400" />
              </div>
              <p className="mb-2 text-gray-300">
                Drag and drop your dataset here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supported formats: CSV, JSON
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json"
                onChange={handleFileChange}
                className="hidden"
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg"
            >
              <div className="p-3 rounded-lg bg-blue-500/10">
                <File className="w-8 h-8 text-blue-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white">{selectedFile.name}</p>
                <p className="text-sm text-gray-400">
                  {formatBytes(selectedFile.size)}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRemove}
                className="text-gray-400 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </div>

        {/* File Metadata */}
        {fileMetadata && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-4 mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Database className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                 <p className="text-sm text-gray-400">File Size</p>
                <p className="text-lg font-semibold text-white">{formatBytes(fileMetadata?.size || 0)}</p>
               </div>


            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10">
                <Layers className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Columns</p>
                <p className="text-white">{fileMetadata.columns}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <File className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">File Size</p>
                <p className="text-white">{formatBytes(fileMetadata.size)}</p>
              </div>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Control Panel */}
      <Card className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 backdrop-blur-sm">
        <h3 className="text-white mb-4">Execution Control</h3>
        
        {/* Run Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700 mb-4">
          <div className="flex items-center gap-3">
            <Switch
              id="run-mode"
              checked={runMode === 'full'}
              onCheckedChange={(checked) => setRunMode(checked ? 'full' : 'quick')}
            />
            <div>
              <Label htmlFor="run-mode" className="text-white cursor-pointer">
                {runMode === 'full' ? '⚡ Full Run (LLM-Connected)' : '🚀 Quick Run (Local Test)'}
              </Label>
              <p className="text-xs text-gray-400">
                {runMode === 'full' 
                  ? 'Execute with complete LLM reasoning and analysis'
                  : 'Fast execution for testing without LLM queries'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => onExecute(runMode)}
            disabled={isRunning || !selectedFile}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Executing Workflow...' : 'Execute Compliance Workflow'}
          </Button>
          <Button
            onClick={onReset}
            disabled={isRunning}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {runMode === 'full' && (
          <p className="text-xs text-yellow-400 mt-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Full run will consume LLM API credits
          </p>
        )}
      </Card>
    </div>
  );
}

function AlertTriangle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
