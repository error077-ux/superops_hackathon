# database/csv_storage.py - CSV-Based Data Storage

import pandas as pd
import os
from typing import Dict, List, Optional
from datetime import datetime
import json

# Storage file paths
COMPLIANCE_RESULTS_FILE = './data/processed/compliance_results.csv'
LOGS_FILE = './data/processed/execution_logs.csv'
KB_CACHE_FILE = './data/kb_cache/knowledge_base.csv'

def ensure_files_exist():
    """Create CSV files if they don't exist"""
    os.makedirs('./data/processed', exist_ok=True)
    os.makedirs('./data/kb_cache', exist_ok=True)
    
    # Create compliance results file
    if not os.path.exists(COMPLIANCE_RESULTS_FILE):
        df = pd.DataFrame(columns=[
            'id', 'framework', 'obligationId', 'description', 'status',
            'confidence_score', 'category', 'severity', 'action', 'reason',
            'rule_id', 'created_at'
        ])
        df.to_csv(COMPLIANCE_RESULTS_FILE, index=False)
    
    # Create logs file
    if not os.path.exists(LOGS_FILE):
        df = pd.DataFrame(columns=[
            'id', 'timestamp', 'stage', 'message', 'type', 'process'
        ])
        df.to_csv(LOGS_FILE, index=False)
    
    # Create KB cache file
    if not os.path.exists(KB_CACHE_FILE):
        df = pd.DataFrame(columns=['key', 'value', 'created_at'])
        df.to_csv(KB_CACHE_FILE, index=False)

# ============================================
# COMPLIANCE RESULTS OPERATIONS
# ============================================

def save_compliance_result(data: Dict) -> Dict:
    """Save compliance result to CSV"""
    try:
        ensure_files_exist()
        
        # Add ID and timestamp
        data['id'] = datetime.utcnow().strftime('%Y%m%d%H%M%S%f')
        data['created_at'] = datetime.utcnow().isoformat()
        
        # Read existing data
        try:
            df = pd.read_csv(COMPLIANCE_RESULTS_FILE)
        except:
            # If file is corrupted, create fresh one
            df = pd.DataFrame(columns=[
                'id', 'framework', 'obligationId', 'description', 'status',
                'confidence_score', 'category', 'severity', 'action', 'reason',
                'rule_id', 'created_at'
            ])
        
        # Ensure data has all required columns
        for col in df.columns:
            if col not in data:
                data[col] = None
        
        # Append new record
        new_row = pd.DataFrame([data])
        df = pd.concat([df, new_row], ignore_index=True)
        
        # Save back to CSV
        df.to_csv(COMPLIANCE_RESULTS_FILE, index=False)
        
        return data
    except Exception as e:
        print(f"Error saving compliance result: {str(e)}")
        return {}

def get_compliance_results(filters: Optional[Dict] = None, limit: int = 100, offset: int = 0) -> List[Dict]:
    """Get compliance results from CSV with optional filters"""
    try:
        ensure_files_exist()
        
        if not os.path.exists(COMPLIANCE_RESULTS_FILE):
            return []
        
        # Read CSV
        df = pd.read_csv(COMPLIANCE_RESULTS_FILE)
        
        if df.empty:
            return []
        
        # Apply filters
        if filters:
            for key, value in filters.items():
                if key in df.columns:
                    df = df[df[key] == value]
        
        # Sort by created_at descending
        if 'created_at' in df.columns:
            df = df.sort_values('created_at', ascending=False)
        
        # Apply pagination
        df = df.iloc[offset:offset + limit]
        
        # Convert to list of dicts
        return df.to_dict('records')
    except Exception as e:
        print(f"Error getting compliance results: {str(e)}")
        return []

def clear_all_compliance_results() -> bool:
    """Clear all compliance results"""
    try:
        df = pd.DataFrame(columns=[
            'id', 'framework', 'obligationId', 'description', 'status',
            'confidence_score', 'category', 'severity', 'action', 'reason',
            'rule_id', 'created_at'
        ])
        df.to_csv(COMPLIANCE_RESULTS_FILE, index=False)
        return True
    except Exception as e:
        print(f"Error clearing compliance results: {str(e)}")
        return False

# ============================================
# EXECUTION LOGS OPERATIONS
# ============================================

def save_log(stage: str, message: str, log_type: str = 'info', process: str = 'system') -> Dict:
    """Save execution log to CSV"""
    try:
        ensure_files_exist()
        
        log_entry = {
            'id': datetime.utcnow().strftime('%Y%m%d%H%M%S%f'),
            'timestamp': datetime.utcnow().isoformat(),
            'stage': stage,
            'message': message,
            'type': log_type,
            'process': process
        }
        
        # Read existing logs
        df = pd.read_csv(LOGS_FILE)
        
        # Append new log
        new_row = pd.DataFrame([log_entry])
        df = pd.concat([df, new_row], ignore_index=True)
        
        # Keep only last 1000 logs to prevent file from growing too large
        if len(df) > 1000:
            df = df.tail(1000)
        
        # Save back to CSV
        df.to_csv(LOGS_FILE, index=False)
        
        return log_entry
    except Exception as e:
        print(f"Error saving log: {str(e)}")
        return {}

def get_logs(limit: int = 100, filters: Optional[Dict] = None) -> List[Dict]:
    """Get execution logs from CSV"""
    try:
        ensure_files_exist()
        
        if not os.path.exists(LOGS_FILE):
            return []
        
        # Read CSV
        df = pd.read_csv(LOGS_FILE)
        
        if df.empty:
            return []
        
        # Apply filters
        if filters:
            for key, value in filters.items():
                if key in df.columns:
                    df = df[df[key] == value]
        
        # Sort by timestamp descending
        if 'timestamp' in df.columns:
            df = df.sort_values('timestamp', ascending=False)
        
        # Limit results
        df = df.head(limit)
        
        # Convert to list of dicts
        return df.to_dict('records')
    except Exception as e:
        print(f"Error getting logs: {str(e)}")
        return []

def clear_all_logs() -> bool:
    """Clear all execution logs"""
    try:
        df = pd.DataFrame(columns=['id', 'timestamp', 'stage', 'message', 'type', 'process'])
        df.to_csv(LOGS_FILE, index=False)
        return True
    except Exception as e:
        print(f"Error clearing logs: {str(e)}")
        return False

# ============================================
# KNOWLEDGE BASE CACHE OPERATIONS
# ============================================

def get_kb_entry(key: str) -> Optional[Dict]:
    """Get knowledge base entry from CSV cache"""
    try:
        ensure_files_exist()
        
        if not os.path.exists(KB_CACHE_FILE):
            return None
        
        # Read CSV
        df = pd.read_csv(KB_CACHE_FILE)
        
        if df.empty:
            return None
        
        # Find matching key
        matches = df[df['key'] == key]
        
        if matches.empty:
            return None
        
        # Parse JSON value
        value_str = matches.iloc[0]['value']
        return json.loads(value_str)
    except Exception as e:
        print(f"Error getting KB entry: {str(e)}")
        return None

def save_kb_entry(key: str, value: Dict) -> Dict:
    """Save knowledge base entry to CSV cache"""
    try:
        ensure_files_exist()
        
        # Read existing cache
        df = pd.read_csv(KB_CACHE_FILE)
        
        # Remove existing entry with same key (upsert behavior)
        df = df[df['key'] != key]
        
        # Create new entry
        entry = {
            'key': key,
            'value': json.dumps(value),
            'created_at': datetime.utcnow().isoformat()
        }
        
        # Append new entry
        new_row = pd.DataFrame([entry])
        df = pd.concat([df, new_row], ignore_index=True)
        
        # Save back to CSV
        df.to_csv(KB_CACHE_FILE, index=False)
        
        return entry
    except Exception as e:
        print(f"Error saving KB entry: {str(e)}")
        return {}

def get_all_kb_entries() -> List[Dict]:
    """Get all knowledge base entries"""
    try:
        ensure_files_exist()
        
        if not os.path.exists(KB_CACHE_FILE):
            return []
        
        df = pd.read_csv(KB_CACHE_FILE)
        
        if df.empty:
            return []
        
        # Parse all entries
        entries = []
        for _, row in df.iterrows():
            entries.append({
                'key': row['key'],
                'value': json.loads(row['value']),
                'created_at': row['created_at']
            })
        
        return entries
    except Exception as e:
        print(f"Error getting all KB entries: {str(e)}")
        return []

def clear_kb_cache() -> bool:
    """Clear all knowledge base cache"""
    try:
        df = pd.DataFrame(columns=['key', 'value', 'created_at'])
        df.to_csv(KB_CACHE_FILE, index=False)
        return True
    except Exception as e:
        print(f"Error clearing KB cache: {str(e)}")
        return False

def get_kb_stats() -> Dict:
    """Get statistics about the knowledge base cache"""
    try:
        entries = get_all_kb_entries()
        
        total_entries = len(entries)
        
        # Count by framework
        by_framework = {}
        for entry in entries:
            fw = entry['value'].get('compliance_framework', 'Unknown')
            by_framework[fw] = by_framework.get(fw, 0) + 1
        
        return {
            'total_entries': total_entries,
            'by_framework': by_framework,
            'cache_enabled': True
        }
    except Exception as e:
        print(f"Error getting KB stats: {str(e)}")
        return {'total_entries': 0, 'by_framework': {}, 'cache_enabled': False}

# ============================================
# DASHBOARD METRICS (AGGREGATED)
# ============================================

def get_dashboard_metrics() -> Dict:
    """Get aggregated metrics for dashboard"""
    try:
        results = get_compliance_results(limit=10000)
        
        if not results:
            return {
                'total_processed': 0,
                'compliant': 0,
                'non_compliant': 0,
                'requires_action': 0,
                'avg_confidence': 0,
                'high_severity': 0,
                'by_framework': {},
                'by_action': {}
            }
        
        total = len(results)
        compliant = sum(1 for r in results if r.get('status') == 'Compliant')
        non_compliant = sum(1 for r in results if r.get('status') == 'Non-Compliant')
        requires_action = sum(1 for r in results if r.get('status') == 'Requires Action')
        
        # Calculate average confidence
        confidence_scores = [float(r.get('confidence_score', 0)) for r in results]
        avg_confidence = sum(confidence_scores) / total if total > 0 else 0
        
        # Count high severity
        high_severity = sum(1 for r in results if str(r.get('severity', '')).lower() in ['high', 'critical'])
        
        # Group by framework
        by_framework = {}
        for r in results:
            fw = r.get('framework', 'Unknown')
            by_framework[fw] = by_framework.get(fw, 0) + 1
        
        # Group by action
        by_action = {}
        for r in results:
            action = r.get('action', 'unknown')
            by_action[action] = by_action.get(action, 0) + 1
        
        return {
            'total_processed': total,
            'compliant': compliant,
            'non_compliant': non_compliant,
            'requires_action': requires_action,
            'avg_confidence': round(avg_confidence, 2),
            'high_severity': high_severity,
            'by_framework': by_framework,
            'by_action': by_action
        }
    except Exception as e:
        print(f"Error getting dashboard metrics: {str(e)}")
        return {
            'total_processed': 0,
            'compliant': 0,
            'non_compliant': 0,
            'requires_action': 0,
            'avg_confidence': 0,
            'high_severity': 0
        }

# ============================================
# HEALTH CHECK
# ============================================

def check_storage_health() -> bool:
    """Check if CSV storage is accessible"""
    try:
        ensure_files_exist()
        return os.path.exists(COMPLIANCE_RESULTS_FILE) and \
               os.path.exists(LOGS_FILE) and \
               os.path.exists(KB_CACHE_FILE)
    except Exception as e:
        print(f"Storage health check failed: {str(e)}")
        return False
