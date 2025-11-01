import { useState } from 'react';
import { Card } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Download, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { ComplianceRecord } from '../data/mockData';
import { toast } from 'sonner@2.0.3';

interface DataExplorerProps {
  data: ComplianceRecord[];
  onExport: () => void;
}

export function DataExplorer({ data, onExport }: DataExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFramework, setFilterFramework] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'framework' | 'confidence' | 'severity'>('framework');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const frameworks = ['ISO 27001'];

  const filteredData = data
    .filter(record => {
      const matchesSearch = 
        record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.obligationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.framework.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFramework = filterFramework === 'all' || record.framework === filterFramework;
      const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
      
      return matchesSearch && matchesFramework && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'framework':
          comparison = a.framework.localeCompare(b.framework);
          break;
        case 'confidence':
          comparison = a.confidenceScore - b.confidenceScore;
          break;
        case 'severity':
          const severityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
          comparison = severityOrder[a.severity] - severityOrder[b.severity];
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getStatusBadge = (status: ComplianceRecord['status']) => {
    const variants: Record<ComplianceRecord['status'], string> = {
      'Compliant': 'bg-green-600 text-white border-green-500',
      'Non-Compliant': 'bg-red-600 text-white border-red-500',
      'Partial': 'bg-yellow-600 text-white border-yellow-500'
    };
    
    return <Badge className={`${variants[status]} border`}>{status}</Badge>;
  };

  const getSeverityBadge = (severity: ComplianceRecord['severity']) => {
    const variants: Record<ComplianceRecord['severity'], string> = {
      'Critical': 'bg-red-700 text-white',
      'High': 'bg-orange-600 text-white',
      'Medium': 'bg-yellow-600 text-white',
      'Low': 'bg-blue-600 text-white'
    };
    
    return <Badge className={variants[severity]}>{severity}</Badge>;
  };

  const handleReQuery = (record: ComplianceRecord) => {
    toast.info(`Re-querying LLM for ${record.obligationId}...`);
    setTimeout(() => {
      toast.success('LLM query completed');
    }, 2000);
  };

  const toggleSort = (column: 'framework' | 'confidence' | 'severity') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <Card className="p-6 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white mb-1">Compliance Data Explorer</h3>
          <p className="text-sm text-gray-400">
            {filteredData.length} of {data.length} records
          </p>
        </div>
        <Button onClick={onExport} className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search obligations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500"
          />
        </div>

        <Select value={filterFramework} onValueChange={setFilterFramework}>
          <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white">
            <SelectValue placeholder="Framework" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all">All Frameworks</SelectItem>
            {frameworks.map(fw => (
              <SelectItem key={fw} value={fw}>{fw}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Compliant">Compliant</SelectItem>
            <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
            <SelectItem value="Partial">Partial</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
          <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="framework">Framework</SelectItem>
            <SelectItem value="confidence">Confidence</SelectItem>
            <SelectItem value="severity">Severity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <div className="border border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-900/50 border-gray-700 hover:bg-gray-900/50">
                <TableHead 
                  className="text-gray-300 cursor-pointer"
                  onClick={() => toggleSort('framework')}
                >
                  Framework {sortBy === 'framework' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="text-gray-300">Obligation ID</TableHead>
                <TableHead className="text-gray-300">Description</TableHead>
                <TableHead className="text-gray-300">Category</TableHead>
                <TableHead 
                  className="text-gray-300 cursor-pointer"
                  onClick={() => toggleSort('confidence')}
                >
                  Confidence {sortBy === 'confidence' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="text-gray-300 cursor-pointer"
                  onClick={() => toggleSort('severity')}
                >
                  Severity {sortBy === 'severity' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((record) => (
                <TableRow key={record.id} className="border-gray-700 hover:bg-gray-900/30">
                  <TableCell className="text-gray-300">{record.framework}</TableCell>
                  <TableCell className="text-gray-300">{record.obligationId}</TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm text-gray-400 line-clamp-2">{record.description}</p>
                  </TableCell>
                  <TableCell className="text-gray-300 text-sm">{record.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${record.confidenceScore * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{(record.confidenceScore * 100).toFixed(0)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getSeverityBadge(record.severity)}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    {record.confidenceScore < 0.8 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReQuery(record)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-950"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Re-Query
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {filteredData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-600 mb-4" />
          <p className="text-gray-400">No records found matching your filters</p>
        </div>
      )}
    </Card>
  );
}
