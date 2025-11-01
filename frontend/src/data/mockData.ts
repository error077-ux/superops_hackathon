export interface ComplianceRecord {
  id: string;
  framework: string;
  obligationId: string;
  description: string;
  status: 'Compliant' | 'Non-Compliant' | 'Partial';
  confidenceScore: number;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface LogEntry {
  timestamp: string;
  stage: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  process: 'Rule Engine' | 'Segregator' | 'LLM' | 'Parser' | 'System';
}

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  executionTime?: number;
  recordsProcessed?: number;
  color: string;
}

export interface FileMetadata {
  name: string;
  size: number;
  rows: number;
  columns: number;
  uploadedAt: string;
}

export interface KPIData {
  totalRules: number;
  uniqueObligations: number;
  complianceAccuracy: number;
  avgProcessingTime: number;
}

export const mockComplianceData: ComplianceRecord[] = [
  {
    id: '1',
    framework: 'ISO 27001',
    obligationId: 'A.5.1.1',
    description: 'Policies for information security: A set of policies for information security shall be defined, approved by management, published and communicated to employees and relevant external parties.',
    status: 'Compliant',
    confidenceScore: 0.96,
    category: 'Information Security Policies',
    severity: 'Critical'
  },
  {
    id: '2',
    framework: 'ISO 27001',
    obligationId: 'A.6.1.1',
    description: 'Information security roles and responsibilities: All information security responsibilities shall be defined and allocated.',
    status: 'Compliant',
    confidenceScore: 0.93,
    category: 'Organization of Information Security',
    severity: 'High'
  },
  {
    id: '3',
    framework: 'ISO 27001',
    obligationId: 'A.7.2.2',
    description: 'Information security awareness, education and training: All employees of the organization and, where relevant, contractors shall receive appropriate awareness education and training.',
    status: 'Partial',
    confidenceScore: 0.71,
    category: 'Human Resource Security',
    severity: 'Medium'
  },
  {
    id: '4',
    framework: 'ISO 27001',
    obligationId: 'A.8.1.1',
    description: 'Inventory of assets: Assets associated with information and information processing facilities shall be identified and an inventory of these assets shall be drawn up and maintained.',
    status: 'Compliant',
    confidenceScore: 0.95,
    category: 'Asset Management',
    severity: 'High'
  },
  {
    id: '5',
    framework: 'ISO 27001',
    obligationId: 'A.8.1.2',
    description: 'Ownership of assets: Assets maintained in the inventory shall be owned by designated individuals or organizational entities.',
    status: 'Compliant',
    confidenceScore: 0.89,
    category: 'Asset Management',
    severity: 'High'
  },
  {
    id: '6',
    framework: 'ISO 27001',
    obligationId: 'A.9.1.1',
    description: 'Access control policy: An access control policy shall be established, documented and reviewed based on business and information security requirements.',
    status: 'Compliant',
    confidenceScore: 0.94,
    category: 'Access Control',
    severity: 'Critical'
  },
  {
    id: '7',
    framework: 'ISO 27001',
    obligationId: 'A.9.2.1',
    description: 'User registration and de-registration: A formal user registration and de-registration process shall be implemented to enable assignment of access rights.',
    status: 'Compliant',
    confidenceScore: 0.92,
    category: 'Access Control',
    severity: 'Critical'
  },
  {
    id: '8',
    framework: 'ISO 27001',
    obligationId: 'A.9.2.3',
    description: 'Management of privileged access rights: The allocation and use of privileged access rights shall be restricted and controlled.',
    status: 'Compliant',
    confidenceScore: 0.91,
    category: 'Access Control',
    severity: 'Critical'
  },
  {
    id: '9',
    framework: 'ISO 27001',
    obligationId: 'A.9.4.1',
    description: 'Information access restriction: Access to information and application system functions shall be restricted in accordance with the access control policy.',
    status: 'Non-Compliant',
    confidenceScore: 0.68,
    category: 'Access Control',
    severity: 'Critical'
  },
  {
    id: '10',
    framework: 'ISO 27001',
    obligationId: 'A.10.1.1',
    description: 'Policy on the use of cryptographic controls: A policy on the use of cryptographic controls for protection of information shall be developed and implemented.',
    status: 'Partial',
    confidenceScore: 0.75,
    category: 'Cryptography',
    severity: 'High'
  },
  {
    id: '11',
    framework: 'ISO 27001',
    obligationId: 'A.11.1.1',
    description: 'Physical security perimeter: Security perimeters shall be defined and used to protect areas that contain either sensitive or critical information and information processing facilities.',
    status: 'Compliant',
    confidenceScore: 0.88,
    category: 'Physical and Environmental Security',
    severity: 'High'
  },
  {
    id: '12',
    framework: 'ISO 27001',
    obligationId: 'A.12.1.1',
    description: 'Documented operating procedures: Operating procedures shall be documented and made available to all users who need them.',
    status: 'Compliant',
    confidenceScore: 0.90,
    category: 'Operations Security',
    severity: 'Medium'
  },
  {
    id: '13',
    framework: 'ISO 27001',
    obligationId: 'A.12.4.1',
    description: 'Event logging: Event logs recording user activities, exceptions, faults and information security events shall be produced, kept and regularly reviewed.',
    status: 'Non-Compliant',
    confidenceScore: 0.64,
    category: 'Operations Security',
    severity: 'Critical'
  },
  {
    id: '14',
    framework: 'ISO 27001',
    obligationId: 'A.12.6.1',
    description: 'Management of technical vulnerabilities: Information about technical vulnerabilities of information systems being used shall be obtained in a timely fashion.',
    status: 'Non-Compliant',
    confidenceScore: 0.72,
    category: 'Operations Security',
    severity: 'High'
  },
  {
    id: '15',
    framework: 'ISO 27001',
    obligationId: 'A.13.1.1',
    description: 'Network controls: Networks shall be managed and controlled to protect information in systems and applications.',
    status: 'Compliant',
    confidenceScore: 0.87,
    category: 'Communications Security',
    severity: 'High'
  },
  {
    id: '16',
    framework: 'ISO 27001',
    obligationId: 'A.14.2.2',
    description: 'System change control procedures: Changes to systems within the development lifecycle shall be controlled by the use of formal change control procedures.',
    status: 'Partial',
    confidenceScore: 0.79,
    category: 'System Acquisition Development and Maintenance',
    severity: 'Medium'
  },
  {
    id: '17',
    framework: 'ISO 27001',
    obligationId: 'A.15.1.1',
    description: 'Information security policy for supplier relationships: Information security requirements for mitigating the risks associated with suppliers access to the organizations assets shall be agreed with the supplier.',
    status: 'Compliant',
    confidenceScore: 0.86,
    category: 'Supplier Relationships',
    severity: 'High'
  },
  {
    id: '18',
    framework: 'ISO 27001',
    obligationId: 'A.16.1.1',
    description: 'Responsibilities and procedures: Management responsibilities and procedures shall be established to ensure a quick, effective and orderly response to information security incidents.',
    status: 'Compliant',
    confidenceScore: 0.93,
    category: 'Information Security Incident Management',
    severity: 'Critical'
  },
  {
    id: '19',
    framework: 'ISO 27001',
    obligationId: 'A.17.1.1',
    description: 'Planning information security continuity: The organization shall determine its requirements for information security and the continuity of information security management in adverse situations.',
    status: 'Partial',
    confidenceScore: 0.77,
    category: 'Business Continuity Management',
    severity: 'Critical'
  },
  {
    id: '20',
    framework: 'ISO 27001',
    obligationId: 'A.18.1.1',
    description: 'Identification of applicable legislation and contractual requirements: All relevant legislative statutory, regulatory, contractual requirements and the organizations approach to meet these requirements shall be identified.',
    status: 'Compliant',
    confidenceScore: 0.91,
    category: 'Compliance',
    severity: 'Critical'
  }
];

export const initialStages: PipelineStage[] = [
  {
    id: 'rules',
    name: 'Rule Engine',
    description: 'Apply policy_rules.yaml',
    status: 'pending',
    color: '#3B82F6'
  },
  {
    id: 'segregation',
    name: 'Data Segregation',
    description: 'Categorize and segregate data',
    status: 'pending',
    color: '#14B8A6'
  },
  {
    id: 'llm',
    name: 'LLM Reasoner',
    description: 'Generate compliance details with AI',
    status: 'pending',
    color: '#A855F7'
  },
  {
    id: 'parsing',
    name: 'Compliance Parser',
    description: 'Parse and format final output',
    status: 'pending',
    color: '#10B981'
  }
];

export const mockLogs: LogEntry[] = [
  {
    timestamp: '10:15:23',
    stage: 'System',
    message: 'Compliance Intelligence Platform initialized',
    type: 'info',
    process: 'System'
  },
  {
    timestamp: '10:15:24',
    stage: 'System',
    message: 'Backend services connected successfully',
    type: 'success',
    process: 'System'
  }
];

export const mockKPIData: KPIData = {
  totalRules: 114,
  uniqueObligations: 20,
  complianceAccuracy: 85.2,
  avgProcessingTime: 11.8
};

export const categoryBreakdown = [
  { category: 'Access Control', count: 24, passed: 20, failed: 4 },
  { category: 'Asset Management', count: 18, passed: 16, failed: 2 },
  { category: 'Operations Security', count: 22, passed: 16, failed: 6 },
  { category: 'Human Resource Security', count: 12, passed: 10, failed: 2 },
  { category: 'Physical Security', count: 14, passed: 12, failed: 2 },
  { category: 'Incident Management', count: 16, passed: 15, failed: 1 },
  { category: 'Compliance', count: 8, passed: 8, failed: 0 }
];

export const complianceRatio = [
  { name: 'Compliant', value: 13, color: '#10B981' },
  { name: 'Non-Compliant', value: 4, color: '#EF4444' },
  { name: 'Partial', value: 3, color: '#F59E0B' }
];

export const performanceData = [
  { time: '00:00', duration: 10.5 },
  { time: '04:00', duration: 11.2 },
  { time: '08:00', duration: 12.8 },
  { time: '12:00', duration: 13.5 },
  { time: '16:00', duration: 12.1 },
  { time: '20:00', duration: 11.8 },
  { time: '24:00', duration: 10.9 }
];

export const breachHeatmap = [
  { category: 'Access Control', Mon: 2, Tue: 1, Wed: 3, Thu: 2, Fri: 1, Sat: 0, Sun: 1 },
  { category: 'Asset Management', Mon: 1, Tue: 0, Wed: 1, Thu: 0, Fri: 1, Sat: 0, Sun: 0 },
  { category: 'Operations Security', Mon: 3, Tue: 2, Wed: 4, Thu: 3, Fri: 2, Sat: 1, Sun: 2 },
  { category: 'Physical Security', Mon: 1, Tue: 1, Wed: 0, Thu: 1, Fri: 0, Sat: 0, Sun: 0 },
  { category: 'Human Resources', Mon: 1, Tue: 2, Wed: 1, Thu: 1, Fri: 0, Sat: 0, Sun: 1 }
];
