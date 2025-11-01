# api/compliance.py - Simplified without database dependency

from flask import Blueprint, request, jsonify
import math

compliance_bp = Blueprint('compliance', __name__)

# In-memory storage for compliance results
compliance_results = []

@compliance_bp.route('/results', methods=['GET'], strict_slashes=False)
@compliance_bp.route('/results/', methods=['GET'], strict_slashes=False)
def get_results():
    """Get compliance results with filtering and pagination"""
    
    try:
        # Query parameters
        framework = request.args.get('framework')
        status = request.args.get('status')
        severity = request.args.get('severity')
        action = request.args.get('action')
        limit = int(request.args.get('limit', 100))
        offset = int(request.args.get('offset', 0))
        
        # Filter results
        filtered_results = compliance_results.copy()
        
        if framework:
            filtered_results = [r for r in filtered_results if r.get('framework') == framework]
        if status:
            filtered_results = [r for r in filtered_results if r.get('status') == status]
        if severity:
            filtered_results = [r for r in filtered_results if r.get('severity') == severity]
        if action:
            filtered_results = [r for r in filtered_results if r.get('action') == action]
        
        # Apply pagination
        paginated_results = filtered_results[offset:offset+limit]
        
        # Clean NaN values before returning
        cleaned_results = []
        for result in paginated_results:
            cleaned = {}
            for key, value in result.items():
                # Check for NaN
                if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
                    cleaned[key] = None
                else:
                    cleaned[key] = value
            cleaned_results.append(cleaned)
        
        return jsonify({
            'results': cleaned_results,
            'count': len(cleaned_results),
            'total': len(filtered_results),
            'limit': limit,
            'offset': offset
        }), 200
        
    except Exception as e:
        print(f"Error in /compliance/results: {str(e)}")
        return jsonify({
            'results': [],
            'count': 0,
            'total': 0,
            'error': str(e)
        }), 500


@compliance_bp.route('/results/<result_id>', methods=['GET'])
def get_result_by_id(result_id):
    """Get specific compliance result by ID"""
    
    try:
        result = next((r for r in compliance_results if str(r.get('id')) == result_id), None)
        
        if not result:
            return jsonify({'error': 'Result not found'}), 404
        
        # Clean NaN values
        cleaned = {}
        for key, value in result.items():
            if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
                cleaned[key] = None
            else:
                cleaned[key] = value
        
        return jsonify(cleaned), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@compliance_bp.route('/summary', methods=['GET'])
def get_summary():
    """Get compliance summary statistics"""
    
    try:
        if not compliance_results:
            return jsonify({
                'total': 0,
                'compliant': 0,
                'non_compliant': 0,
                'requires_action': 0,
                'compliance_rate': 0,
                'by_framework': {},
                'by_severity': {}
            }), 200
        
        # Calculate summary stats
        total = len(compliance_results)
        compliant = sum(1 for r in compliance_results if r.get('status') == 'Compliant')
        non_compliant = sum(1 for r in compliance_results if r.get('status') == 'Non-Compliant')
        requires_action = sum(1 for r in compliance_results if r.get('status') == 'Requires Action')
        
        # Group by framework
        by_framework = {}
        for r in compliance_results:
            fw = r.get('framework', 'Unknown')
            by_framework[fw] = by_framework.get(fw, 0) + 1
        
        # Group by severity
        by_severity = {}
        for r in compliance_results:
            sev = r.get('severity', 'Unknown')
            by_severity[sev] = by_severity.get(sev, 0) + 1
        
        return jsonify({
            'total': total,
            'compliant': compliant,
            'non_compliant': non_compliant,
            'requires_action': requires_action,
            'compliance_rate': round((compliant / total * 100) if total > 0 else 0, 1),
            'by_framework': by_framework,
            'by_severity': by_severity
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def add_compliance_result(result):
    """Helper function to add compliance results"""
    # Clean NaN values before adding
    cleaned_result = {}
    for key, value in result.items():
        if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
            cleaned_result[key] = None
        else:
            cleaned_result[key] = value
    
    compliance_results.append(cleaned_result)


def clear_compliance_results():
    """Helper function to clear all compliance results"""
    global compliance_results
    compliance_results = []
