import { Button } from './ui/button';
import { Card } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Download, FileText } from 'lucide-react';
import { ComplianceRecord } from '../data/mockData';

interface ResultsViewProps {
  data: ComplianceRecord[];
  onExport: () => void;
}

export function ResultsView({ data, onExport }: ResultsViewProps) {
  const getStatusBadge = (status: ComplianceRecord['status']) => {
    const variants: Record<ComplianceRecord['status'], string> = {
      'Compliant': 'bg-green-500 text-white',
      'Non-Compliant': 'bg-red-500 text-white',
      'Partial': 'bg-yellow-500 text-white'
    };
    
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Compliance Results
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Generated compliance obligations and status
            </p>
          </div>
          <Button onClick={onExport} className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export as CSV
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableHead>Compliance Framework</TableHead>
                <TableHead>Obligation ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.framework}</TableCell>
                  <TableCell>{record.obligationId}</TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm">{record.description}</p>
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <h3 className="mb-2 text-blue-900 dark:text-blue-100">Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300">Total Obligations</p>
            <p className="text-blue-900 dark:text-blue-100">{data.length}</p>
          </div>
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300">Compliant</p>
            <p className="text-blue-900 dark:text-blue-100">
              {data.filter(r => r.status === 'Compliant').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300">Non-Compliant</p>
            <p className="text-blue-900 dark:text-blue-100">
              {data.filter(r => r.status === 'Non-Compliant').length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
