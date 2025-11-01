import pandas as pd
from typing import List, Dict

class DataSegregator:
    """Extract unique action-reason combinations"""
    
    def extract_unique_pairs(self, df: pd.DataFrame) -> List[Dict]:
        """Get unique (action, reason) pairs from dataframe"""
        
        if 'action' not in df.columns or 'reason' not in df.columns:
            return []
        
        # Get unique combinations
        unique = df[['action', 'reason']].drop_duplicates()
        
        pairs = []
        for _, row in unique.iterrows():
            pairs.append({
                'action': row['action'],
                'reason': row['reason']
            })
        
        return pairs
