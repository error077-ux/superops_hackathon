# api/upload.py - FIXED with proper filename handling

from flask import Blueprint, request, jsonify, current_app
import os
import uuid
from werkzeug.utils import secure_filename
from datetime import datetime

upload_bp = Blueprint('upload', __name__)

ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/upload', methods=['POST', 'OPTIONS'], strict_slashes=False)
@upload_bp.route('/upload/', methods=['POST', 'OPTIONS'], strict_slashes=False)
def upload_file():
    """Handle file upload"""
    
    # Handle OPTIONS preflight
    if request.method == 'OPTIONS':
        return '', 200
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Only CSV, XLSX, XLS allowed'}), 400
    
    try:
        # Generate unique filename with original extension
        original_filename = secure_filename(file.filename)
        file_extension = original_filename.rsplit('.', 1)[1].lower()
        unique_id = str(uuid.uuid4())
        file_id = f"{unique_id}.{file_extension}"  # ← Include extension!
        
        # Save file with extension
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], file_id)
        file.save(filepath)
        
        # Get file metadata
        file_size = os.path.getsize(filepath)
        
        # Convert XLSX/XLS to CSV if needed
        if file_extension in ['xlsx', 'xls']:
            import pandas as pd
            df = pd.read_excel(filepath)
            csv_file_id = f"{unique_id}.csv"
            csv_filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], csv_file_id)
            df.to_csv(csv_filepath, index=False)
            
            # Use CSV version for processing
            file_id = csv_file_id
            filepath = csv_filepath
            file_size = os.path.getsize(csv_filepath)
        
        # Get row count
        import pandas as pd
        df = pd.read_csv(filepath)
        row_count = len(df)
        
        # Log the upload
        try:
            from api.logs import add_log
            add_log('Upload', f'File uploaded: {original_filename} ({row_count} rows)', 'success', 'System')
        except:
            pass
        
        print(f"✅ File uploaded successfully: {file_id} ({row_count} rows)")
        
        return jsonify({
            'success': True,
            'file_id': file_id,
            'filename': original_filename,
            'size': file_size,
            'rows': row_count,
            'uploaded_at': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        print(f"❌ Upload error: {str(e)}")
        return jsonify({'error': str(e)}), 500
