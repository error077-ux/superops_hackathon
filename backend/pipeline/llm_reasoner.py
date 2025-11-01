import os
from typing import List, Dict
import json
from database.knowledge_base import get_kb_entry, save_kb_entry
from openai import OpenAI  # NEW: Use modern client

class LLMReasoner:
    """Use LLM to get compliance metadata for unique action-reason pairs"""
    
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))  # NEW: Modern client
    
    def build_knowledge_base(self, unique_pairs: List[Dict]) -> Dict:
        """Build KB for unique pairs"""
        kb = {}
        
        for pair in unique_pairs:
            action = pair.get('action', '')
            reason = pair.get('reason', '')
            key = f"{action}||{reason}"
            
            # Check if already in cache
            cached = get_kb_entry(key)
            if cached:
                kb[key] = cached
                print(f"✓ KB Cache HIT for: {key}")
                continue
            
            # Not in cache - call LLM
            print(f"✗ KB Cache MISS for: {key} - calling LLM...")
            compliance_data = self._get_compliance_data(action, reason)
            
            # Save to cache for future use
            save_kb_entry(key, compliance_data)
            kb[key] = compliance_data
        
        return kb
    
    def _get_compliance_data(self, action: str, reason: str) -> Dict:
        """Call LLM to get compliance framework, obligation_id, description"""
        
        prompt = f"""Given the following security action and reason, provide compliance metadata:

Action: {action}
Reason: {reason}

Please provide:
1. compliance_framework (e.g., ISO 27001, HIPAA, GDPR, PCI-DSS, SOC 2, NIST)
2. obligation_id (specific control ID from the framework)
3. description (detailed explanation of the compliance obligation)
4. category (e.g., Access Control, Data Protection, Incident Response, Network Security, etc.)
5. severity (High, Medium, or Low)

Respond ONLY with valid JSON in this exact format:
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
                    {"role": "system", "content": "You are a compliance expert. Provide accurate compliance framework mappings. Always respond with valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=300
            )
            
            content = response.choices[0].message.content.strip()
            
            # Try to parse JSON
            data = json.loads(content)
            
            return {
                'compliance_framework': data.get('compliance_framework', 'ISO 27001'),
                'obligation_id': data.get('obligation_id', 'UNKNOWN'),
                'description': data.get('description', f'Action: {action}. {reason}'),
                'category': data.get('category', 'Security'),
                'severity': data.get('severity', 'Medium')
            }
            
        except Exception as e:
            print(f"LLM call failed: {str(e)}")
            # Fallback data
            return {
                'compliance_framework': 'ISO 27001',
                'obligation_id': 'UNKNOWN',
                'description': f'Action: {action}. Reason: {reason}',
                'category': 'Security',
                'severity': 'Medium'
            }
