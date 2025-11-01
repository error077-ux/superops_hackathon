from typing import Dict, Optional, List
from database.csv_storage import (
    get_kb_entry as csv_get_kb_entry,
    save_kb_entry as csv_save_kb_entry,
    get_all_kb_entries,
    get_kb_stats as csv_get_kb_stats
)

def get_kb_entry(key: str) -> Optional[Dict]:
    """Get knowledge base entry from cache"""
    return csv_get_kb_entry(key)

def save_kb_entry(key: str, value: Dict) -> Dict:
    """Save knowledge base entry to cache"""
    return csv_save_kb_entry(key, value)

def get_kb_stats() -> Dict:
    """Get statistics about the knowledge base cache"""
    return csv_get_kb_stats()

def search_kb_entries(search_term: str) -> List[Dict]:
    """Search knowledge base entries by key or value content"""
    try:
        all_entries = get_all_kb_entries()
        
        matching = []
        search_lower = search_term.lower()
        
        for entry in all_entries:
            if search_lower in entry['key'].lower():
                matching.append(entry)
                continue
            
            value = entry['value']
            if (search_lower in value.get('compliance_framework', '').lower() or
                search_lower in value.get('description', '').lower() or
                search_lower in value.get('category', '').lower()):
                matching.append(entry)
        
        return matching
    except Exception as e:
        print(f"Error searching KB entries: {str(e)}")
        return []

def build_kb_from_pairs(unique_pairs: List[Dict]) -> Dict:
    """Build knowledge base from unique action-reason pairs"""
    kb = {}
    
    for pair in unique_pairs:
        action = pair.get('action', '')
        reason = pair.get('reason', '')
        key = f"{action}||{reason}"
        
        cached = get_kb_entry(key)
        if cached:
            kb[key] = cached
            print(f"KB Cache HIT for: {key}")
        else:
            print(f"KB Cache MISS for: {key}")
            kb[key] = None
    
    return kb