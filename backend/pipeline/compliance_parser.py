import pandas as pd
from typing import Dict
import json
from openai import OpenAI  # NEW: Use modern client
import os

class ComplianceParser:
    """Parse all records using KB (with LLM fallback if not in KB)"""
    
    def __init__(self, knowledge_base: Dict, mode: str = 'full'):
        self.kb = knowledge_base
        self.mode = mode
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))  # NEW: Modern client
    
    def parse(self, df: pd.DataFrame) -> pd.DataFrame:
        """Parse all records and fill compliance columns"""
        
        results = []
        
        for _, row in df.iterrows():
            record = row.to_dict()
            
            action = record.get('action', '')
            reason = record.get('reason', '')
            key = f"{action}||{reason}"
            
            # Check KB first
            if key in self.kb and self.kb[key] is not None:
                compliance_data = self.kb[key]
            else:
                # Not in KB - fallback to LLM (only in full mode)
                if self.mode == 'full':
                    print(f"Calling LLM directly for: {key}")
                    compliance_data = self._call_llm_directly(action, reason)
                else:
                    # Quick mode - use defaults
                    compliance_data = {
                        'compliance_framework': 'ISO 27001',
                        'obligation_id': 'UNKNOWN',
                        'description': f'{action}: {reason}',
                        'category': 'Security',
                        'severity': 'Medium'
                    }
            
            # Add compliance data to record
            record['framework'] = compliance_data['compliance_framework']
            record['obligationId'] = compliance_data['obligation_id']
            record['description'] = compliance_data['description']
            record['category'] = compliance_data['category']
            record['severity'] = compliance_data['severity']
            
            # Determine status based on action
            if action == 'deny':
                record['status'] = 'Non-Compliant'
            elif action in ['quarantine', 'mfa']:
                record['status'] = 'Requires Action'
            elif action in ['monitor', 'allow']:
                record['status'] = 'Compliant'
            else:
                record['status'] = 'Unknown'
            
            # Calculate confidence score (convert to 0-100 scale)
            confidence = float(record.get('final_confidence_score', 0.5))
            record['confidence_score'] = round(confidence * 100, 2)
            
            results.append(record)
        
        return pd.DataFrame(results)
    
    def _call_llm_directly(self, action: str, reason: str) -> Dict:
        """Direct LLM call if not in KB"""
        
        prompt = f"""Given: Action={action}, Reason={reason}

Provide compliance metadata in JSON format:
{{
  "compliance_framework": "...",
  "obligation_id": "...",
  "description": "...",
  "category": "...",
  "severity": "..."
}}"""
        
        try:
            response = self.client.chat.completions.create(  # NEW: Modern API
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a compliance expert. Respond with valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=300
            )
            
            content = response.choices[0].message.content.strip()
            return json.loads(content)
            
        except:
            return {
                'compliance_framework': 'ISO 27001',
                'obligation_id': 'UNKNOWN',
                'description': f'{action}: {reason}',
                'category': 'Security',
                'severity': 'Medium'
            }
