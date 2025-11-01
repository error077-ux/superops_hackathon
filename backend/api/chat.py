# api/chat.py - COMPLETE WITH OPENAI GPT + DATASET CONTEXT

from flask import Blueprint, request, jsonify
import os
from datetime import datetime
from openai import OpenAI

chat_bp = Blueprint('chat', __name__)

# Initialize OpenAI client
client = None

def get_openai_client():
    """Initialize OpenAI client with API key from environment"""
    global client
    if client is None:
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        client = OpenAI(api_key=api_key)
    return client

def get_compliance_context():
    """Get current compliance data for context"""
    try:
        from api.compliance import compliance_results
        from api.dashboard import calculate_metrics
        
        if not compliance_results:
            return "No compliance data available yet. Please upload and execute a dataset first."
        
        # Get summary metrics
        total = len(compliance_results)
        compliant = len([r for r in compliance_results if r.get('status') == 'Compliant'])
        non_compliant = len([r for r in compliance_results if r.get('status') == 'Non-Compliant'])
        requires_action = len([r for r in compliance_results if r.get('status') == 'Requires Action'])
        
        # Get framework breakdown
        frameworks = {}
        for record in compliance_results:
            fw = record.get('framework', 'Unknown')
            frameworks[fw] = frameworks.get(fw, 0) + 1
        
        # Get severity breakdown
        severities = {}
        for record in compliance_results:
            sev = record.get('severity', 'Unknown')
            severities[sev] = severities.get(sev, 0) + 1
        
        context = f"""
Current Compliance Data Summary:
- Total Records: {total}
- Compliant: {compliant} ({round(compliant/total*100, 1)}%)
- Non-Compliant: {non_compliant} ({round(non_compliant/total*100, 1)}%)
- Requires Action: {requires_action} ({round(requires_action/total*100, 1)}%)

Framework Distribution:
{chr(10).join([f'- {fw}: {count} records' for fw, count in frameworks.items()])}

Severity Distribution:
{chr(10).join([f'- {sev}: {count} records' for sev, count in severities.items()])}

Recent Compliance Issues:
{chr(10).join([f'- {r.get("obligation", "Unknown")}: {r.get("description", "No description")}' for r in compliance_results[:5] if r.get('status') != 'Compliant'])}
"""
        return context.strip()
        
    except Exception as e:
        return f"Unable to retrieve compliance context: {str(e)}"

@chat_bp.route('/', methods=['POST', 'OPTIONS'], strict_slashes=False)
@chat_bp.route('', methods=['POST', 'OPTIONS'], strict_slashes=False)
def chat():
    """LLM-powered chatbot for compliance queries with dataset context"""
    
    # Handle OPTIONS preflight
    if request.method == 'OPTIONS':
        return '', 200
    
    data = request.json
    message = data.get('message')
    
    if not message:
        return jsonify({'error': 'No message provided'}), 400
    
    try:
        # Get OpenAI client
        try:
            openai_client = get_openai_client()
        except ValueError as e:
            return jsonify({
                'reply': 'OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.',
                'timestamp': datetime.utcnow().isoformat()
            }), 200
        
        # Get compliance context
        compliance_context = get_compliance_context()
        
        # Build system prompt with context
        system_prompt = f"""You are an expert compliance assistant specializing in IT security frameworks including ISO 27001, HIPAA, GDPR, PCI-DSS, SOC 2, and NIST.

Your role is to:
1. Answer questions about compliance frameworks, controls, and obligations
2. Explain compliance results and data from the current system
3. Provide actionable guidance on security and compliance requirements
4. Help users understand their compliance posture and areas for improvement

{compliance_context}

When answering:
- Be specific and reference actual data from the system when available
- Provide clear, actionable advice
- Explain compliance terms in simple language
- If asked about current data, use the context provided above
- Be professional but friendly and helpful"""

        # Call OpenAI API
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",  # Using gpt-4o-mini for cost efficiency
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            temperature=0.7,
            max_tokens=800
        )
        
        reply = response.choices[0].message.content
        
        return jsonify({
            'reply': reply,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        print(f"Chat error: {str(e)}")
        
        # Fallback response
        return jsonify({
            'reply': f"I apologize, but I encountered an error processing your request. Error: {str(e)}",
            'timestamp': datetime.utcnow().isoformat()
        }), 200


@chat_bp.route('/suggestions', methods=['GET', 'OPTIONS'])
def get_suggestions():
    """Get suggested questions for the chatbot"""
    
    if request.method == 'OPTIONS':
        return '', 200
    
    suggestions = [
        "What's the current compliance status of my dataset?",
        "Explain the non-compliant records in my data",
        "What are the critical severity issues I should address first?",
        "How does ISO 27001 apply to my organization?",
        "What are the key differences between GDPR and HIPAA?",
        "Explain SOC 2 Type II certification requirements",
        "What security controls should I implement?",
        "How can I improve my compliance score?"
    ]
    
    return jsonify({
        'suggestions': suggestions
    }), 200


@chat_bp.route('/context', methods=['POST', 'OPTIONS'])
def chat_with_context():
    """Chat with additional user-provided context"""
    
    if request.method == 'OPTIONS':
        return '', 200
    
    data = request.json
    message = data.get('message')
    user_context = data.get('context', {})
    
    if not message:
        return jsonify({'error': 'No message provided'}), 400
    
    try:
        openai_client = get_openai_client()
        
        # Get compliance context
        compliance_context = get_compliance_context()
        
        # Build enhanced context
        context_info = ""
        if user_context:
            if 'total_records' in user_context:
                context_info += f"\n- User viewing {user_context['total_records']} total records"
            if 'selected_framework' in user_context:
                context_info += f"\n- Currently filtering by {user_context['selected_framework']}"
            if 'selected_severity' in user_context:
                context_info += f"\n- Currently filtering by {user_context['selected_severity']} severity"
        
        system_prompt = f"""You are an expert compliance assistant specializing in IT security frameworks.

{compliance_context}

Additional Context:
{context_info if context_info else "No additional context provided"}

Provide specific, actionable guidance based on this context and the user's question."""

        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            temperature=0.7,
            max_tokens=800
        )
        
        reply = response.choices[0].message.content
        
        return jsonify({
            'reply': reply,
            'timestamp': datetime.utcnow().isoformat(),
            'context_used': bool(user_context)
        }), 200
        
    except Exception as e:
        print(f"Chat error: {str(e)}")
        return jsonify({
            'reply': f"I apologize, but I encountered an error: {str(e)}",
            'timestamp': datetime.utcnow().isoformat()
        }), 200
