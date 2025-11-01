# app.py - Fixed with request import

from flask import Flask, jsonify, request  # ← Added 'request' here
from flask_cors import CORS
import os

# Import API blueprints
from api.upload import upload_bp
from api.execute import execute_bp
from api.dashboard import dashboard_bp
from api.compliance import compliance_bp
from api.logs import logs_bp
from api.chat import chat_bp
from api.notifications import notifications_bp
from api.auth import auth_bp

app = Flask(__name__)

# CRITICAL: Enable CORS for ALL origins and ALL methods (development mode)
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": False
    }
})

# Configuration
app.config['UPLOAD_FOLDER'] = './data/uploads'
app.config['POLICY_RULES_FILE'] = './policy_rules.yaml'
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB

# Create directories
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('./data/kb_cache', exist_ok=True)
os.makedirs('./data/processed', exist_ok=True)

# Register blueprints
app.register_blueprint(upload_bp, url_prefix='/api')
app.register_blueprint(execute_bp, url_prefix='/api')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
app.register_blueprint(compliance_bp, url_prefix='/api/compliance')
app.register_blueprint(logs_bp, url_prefix='/api')
app.register_blueprint(chat_bp, url_prefix='/api/chat')
app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
# Add CORS headers to ALL responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Health check endpoint
@app.route('/api/health', methods=['GET', 'OPTIONS'])
def health():
    if request.method == 'OPTIONS':
        return '', 200
    return jsonify({'status': 'healthy', 'service': 'Compliance API'}), 200

# Root endpoint
@app.route('/', methods=['GET'])
def root():
    return jsonify({'message': 'Compliance Intelligence API Running'}), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error', 'message': str(error)}), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Starting Compliance Intelligence API")
    print("="*60)
    print("Port: 5000")
    print("CORS: Enabled for all origins (DEV MODE)")
    print("Health: http://localhost:5000/api/health")
    print("\n📡 API Endpoints:")
    print("   - POST /api/upload")
    print("   - POST /api/execute")
    print("   - GET  /api/logs")
    print("   - GET  /api/dashboard/metrics")
    print("   - GET  /api/compliance/results")
    print("   - POST /api/chat/")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)
