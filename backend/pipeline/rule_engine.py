import yaml
import pandas as pd
from typing import Dict, Any

class RuleEngine:
    """Apply policy_rules.yaml to determine action and reason for each record"""
    
    def __init__(self, policy_file: str):
        with open(policy_file, 'r') as f:
            self.policy = yaml.safe_load(f)
        # Sort rules by priority (1 = highest)
        self.rules = sorted(self.policy['rules'], key=lambda x: x['priority'])
    
    def apply_rules(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply policy rules to entire dataframe"""
        
        results = []
        
        for _, row in df.iterrows():
            record = row.to_dict()
            
            # Find matching rule
            matched_rule = self._match_rule(record)
            
            if matched_rule:
                record['action'] = matched_rule['action']
                record['reason'] = matched_rule['reason']
                record['rule_id'] = matched_rule['id']
            else:
                record['action'] = 'allow'
                record['reason'] = 'No matching rule found - default allow'
                record['rule_id'] = 'default'
            
            results.append(record)
        
        return pd.DataFrame(results)
    
    def _match_rule(self, record: Dict[str, Any]) -> Dict[str, Any]:
        """Find first matching rule for this record"""
        
        confidence = float(record.get('final_confidence_score', 0))
        fp_likelihood = float(record.get('false_positive_likelihood', 0))
        correlation = float(record.get('correlation_score', 0))
        severity = str(record.get('severity', 'low')).lower()
        
        for rule in self.rules:
            conditions = rule['conditions']
            
            # Check all conditions
            if not self._check_condition(confidence, conditions['final_confidence_score']):
                continue
            
            if not self._check_condition(fp_likelihood, conditions['false_positive_likelihood']):
                continue
            
            if not self._check_condition(correlation, conditions['correlation_score']):
                continue
            
            if severity not in conditions['severity']:
                continue
            
            # All conditions matched!
            return rule
        
        return None
    
    def _check_condition(self, value: float, condition: str) -> bool:
        """Check if value meets condition string"""
        
        if '>=' in condition:
            threshold = float(condition.replace('>=', ''))
            return value >= threshold
        elif '<' in condition:
            threshold = float(condition.replace('<', ''))
            return value < threshold
        
        return False