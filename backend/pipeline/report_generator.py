import pandas as pd
from typing import Dict, List

class ReportGenerator:
    """Generate final compliance report from parsed data"""
    
    def generate(self, df: pd.DataFrame) -> Dict:
        """Generate comprehensive compliance report"""
        
        obligations = []
        
        for _, row in df.iterrows():
            obligations.append({
                'framework': row.get('framework', 'Unknown'),
                'obligationId': row.get('obligationId', 'UNKNOWN'),
                'description': row.get('description', ''),
                'status': row.get('status', 'Unknown'),
                'confidence_score': row.get('confidence_score', 0),
                'category': row.get('category', 'Security'),
                'severity': row.get('severity', 'Medium'),
                'action': row.get('action', 'unknown'),
                'reason': row.get('reason', '')
            })
        
        # Generate summary statistics
        total = len(obligations)
        compliant = sum(1 for o in obligations if o['status'] == 'Compliant')
        non_compliant = sum(1 for o in obligations if o['status'] == 'Non-Compliant')
        requires_action = sum(1 for o in obligations if o['status'] == 'Requires Action')
        
        report = {
            'obligations': obligations,
            'summary': {
                'total': total,
                'compliant': compliant,
                'non_compliant': non_compliant,
                'requires_action': requires_action,
                'compliance_rate': round((compliant / total * 100) if total > 0 else 0, 1)
            }
        }
        
        return report
