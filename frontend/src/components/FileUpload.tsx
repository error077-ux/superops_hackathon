import { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Upload, File, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'text/csv' || file.type === 'application/json' || file.name.endsWith('.csv') || file.name.endsWith('.json'))) {
      setSelectedFile(file);
      onFileSelect(file);
    }
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
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-gray-900 dark:text-gray-100">Upload Dataset</h3>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            : 'border-gray-300 dark:border-gray-600'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="mb-2 text-gray-600 dark:text-gray-400">
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              Supported formats: CSV, JSON
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              Select File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileChange}
              className="hidden"
            />
          </>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <File className="w-8 h-8 text-blue-500" />
            <div className="flex-1 text-left">
              <p className="text-gray-900 dark:text-gray-100">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
