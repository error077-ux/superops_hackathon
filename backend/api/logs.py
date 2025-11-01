# api/logs.py

from flask import Blueprint, request, jsonify
from datetime import datetime

logs_bp = Blueprint('logs', __name__)

# In-memory log storage
system_logs = []

# Add trailing slash handling
@logs_bp.route('/logs', methods=['GET', 'OPTIONS'], strict_slashes=False)
@logs_bp.route('/logs/', methods=['GET', 'OPTIONS'], strict_slashes=False)
def get_logs():
    """Get system logs"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        limit = int(request.args.get('limit', 50))
        
        # Return recent logs
        recent_logs = system_logs[-limit:] if system_logs else []
        
        # If no logs, return sample logs
        if not recent_logs:
            recent_logs = [
                {
                    'timestamp': datetime.now().isoformat(),
                    'stage': 'System',
                    'message': 'Backend initialized and ready',
                    'type': 'info',
                    'process': 'System'
                }
            ]
        
        return jsonify({
            'logs': recent_logs,
            'total': len(system_logs)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def add_log(stage, message, log_type='info', process='System'):
    """Helper function to add logs"""
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'stage': stage,
        'message': message,
        'type': log_type,
        'process': process
    }
    system_logs.append(log_entry)
    
    # Keep only last 1000 logs
    if len(system_logs) > 1000:
        system_logs.pop(0)
