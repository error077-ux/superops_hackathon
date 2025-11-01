# api/notifications.py - Real-time notifications for critical compliance issues

from flask import Blueprint, jsonify
from datetime import datetime

notifications_bp = Blueprint('notifications', __name__)

# In-memory notification storage (for demo - use database in production)
notifications_list = []

def add_notification(title, message, severity='info', category='compliance'):
    """Add a new notification"""
    notification = {
        'id': f'notif-{len(notifications_list) + 1}-{datetime.now().timestamp()}',
        'title': title,
        'message': message,
        'severity': severity,  # 'critical', 'high', 'medium', 'low', 'info'
        'category': category,
        'timestamp': datetime.now().isoformat(),
        'read': False
    }
    notifications_list.insert(0, notification)  # Add to beginning
    
    # Keep only last 50 notifications
    if len(notifications_list) > 50:
        notifications_list.pop()
    
    return notification

def check_compliance_issues():
    """Check for critical/high severity compliance issues and create notifications"""
    try:
        from api.compliance import compliance_results
        
        if not compliance_results:
            return
        
        # Check for critical severity issues
        critical_issues = [r for r in compliance_results if r.get('severity') == 'High']
        non_compliant = [r for r in compliance_results if r.get('status') == 'Non-Compliant']
        
        # Create notifications for critical issues
        for issue in critical_issues[:5]:  # Limit to top 5
            framework = issue.get('framework', 'Unknown')
            obligation = issue.get('obligationId', 'Unknown')
            description = issue.get('description', 'No description')
            
            add_notification(
                title=f'High Severity: {framework} - {obligation}',
                message=f'{description[:100]}...' if len(description) > 100 else description,
                severity='critical',
                category='high_severity'
            )
        
        # Create notification for non-compliant summary
        if non_compliant:
            add_notification(
                title=f'{len(non_compliant)} Non-Compliant Records Detected',
                message=f'Found {len(non_compliant)} compliance violations requiring immediate attention.',
                severity='high',
                category='non_compliant'
            )
        
    except Exception as e:
        print(f"Error checking compliance issues: {str(e)}")

@notifications_bp.route('/', methods=['GET'], strict_slashes=False)
@notifications_bp.route('', methods=['GET'], strict_slashes=False)
def get_notifications():
    """Get all notifications"""
    return jsonify({
        'notifications': notifications_list,
        'unread_count': len([n for n in notifications_list if not n['read']])
    }), 200

@notifications_bp.route('/unread', methods=['GET'])
def get_unread_notifications():
    """Get only unread notifications"""
    unread = [n for n in notifications_list if not n['read']]
    return jsonify({
        'notifications': unread,
        'count': len(unread)
    }), 200

@notifications_bp.route('/<notification_id>/read', methods=['POST'])
def mark_as_read(notification_id):
    """Mark notification as read"""
    for notification in notifications_list:
        if notification['id'] == notification_id:
            notification['read'] = True
            return jsonify({'success': True}), 200
    
    return jsonify({'error': 'Notification not found'}), 404

@notifications_bp.route('/read-all', methods=['POST'])
def mark_all_as_read():
    """Mark all notifications as read"""
    for notification in notifications_list:
        notification['read'] = False
    
    return jsonify({'success': True}), 200

@notifications_bp.route('/clear', methods=['POST'])
def clear_notifications():
    """Clear all notifications"""
    global notifications_list
    notifications_list = []
    return jsonify({'success': True}), 200
