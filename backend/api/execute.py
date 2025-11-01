# api/execute.py - COMPLETE WITH REAL PIPELINE INTEGRATION (FIXED)

from flask import Blueprint, request, jsonify, current_app
import time
import pandas as pd
import os
from datetime import datetime

# Import your REAL pipeline modules
from pipeline.rule_engine import RuleEngine
from pipeline.data_segregator import DataSegregator
from pipeline.llm_reasoner import LLMReasoner
from pipeline.compliance_parser import ComplianceParser
from pipeline.report_generator import ReportGenerator

# ✅ REMOVED: check_compliance_issues() call from here (line 11)
# ✅ REMOVED: duplicate import (line 18)

execute_bp = Blueprint('execute', __name__)

@execute_bp.route('/execute', methods=['POST', 'OPTIONS'], strict_slashes=False)
@execute_bp.route('/execute/', methods=['POST', 'OPTIONS'], strict_slashes=False)
def execute_pipeline():
    """Execute the complete compliance pipeline with REAL data processing"""
    
    # Handle OPTIONS preflight for CORS
    if request.method == 'OPTIONS':
        return '', 200
    
    print("\n=== EXECUTE ENDPOINT HIT (REAL PIPELINE) ===")
    
    try:
        data = request.get_json()
        print(f"Received data: {data}")
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        file_id = data.get('file_id')
        mode = data.get('mode', 'quick')
        
        print(f"File ID: {file_id}, Mode: {mode}")
        
        if not file_id:
            return jsonify({'error': 'No file_id provided'}), 400
        
        # Get the uploaded file path (normalize for cross-platform)
        filepath = os.path.normpath(os.path.join(current_app.config['UPLOAD_FOLDER'], file_id))
        print(f"Looking for file: {filepath}")
        print(f"File exists: {os.path.exists(filepath)}")
        
        if not os.path.exists(filepath):
            # List all files in upload directory for debugging
            upload_dir = current_app.config['UPLOAD_FOLDER']
            if os.path.exists(upload_dir):
                files_in_dir = os.listdir(upload_dir)
                print(f"Files in {upload_dir}: {files_in_dir}")
            
            return jsonify({
                'error': f'File not found: {filepath}',
                'file_id': file_id,
                'upload_folder': current_app.config['UPLOAD_FOLDER']
            }), 404
        
        # Read the CSV file
        print(f"Reading file: {filepath}")
        df = pd.read_csv(filepath)
        print(f"Loaded {len(df)} records from CSV")
        
        stages = [
            {'name': 'Data Upload', 'description': 'File uploaded and validated', 'status': 'completed', 'executionTime': 0.0, 'recordsProcessed': len(df)},
            {'name': 'Rule Application', 'description': 'Applying policy rules to data', 'status': 'pending'},
            {'name': 'Data Segregation', 'description': 'Extracting unique action-reason pairs', 'status': 'pending'},
            {'name': 'LLM Reasoner', 'description': 'Fetching compliance metadata', 'status': 'pending'},
            {'name': 'Compliance Parser', 'description': 'Parsing compliance obligations', 'status': 'pending'},
            {'name': 'Report Generation', 'description': 'Generating final report', 'status': 'pending'}
        ]
        
        # STAGE 2: Rule Application
        print("\n--- STAGE 2: Rule Application ---")
        try:
            from api.logs import add_log
            add_log('Rule Application', 'Applying policy rules...', 'info', 'rule_engine')
        except:
            pass
        
        stages[1]['status'] = 'running'
        start_time = time.time()
        
        rule_engine = RuleEngine(current_app.config['POLICY_RULES_FILE'])
        df = rule_engine.apply_rules(df)
        
        execution_time = time.time() - start_time
        stages[1]['status'] = 'completed'
        stages[1]['executionTime'] = round(execution_time, 2)
        stages[1]['recordsProcessed'] = len(df)
        
        print(f"Rule Application completed: {len(df)} records in {execution_time:.2f}s")
        try:
            add_log('Rule Application', f'Applied rules to {len(df)} records', 'success', 'rule_engine')
        except:
            pass
        
        # STAGE 3: Data Segregation
        print("\n--- STAGE 3: Data Segregation ---")
        try:
            add_log('Data Segregation', 'Extracting unique action-reason pairs...', 'info', 'data_segregation')
        except:
            pass
        
        stages[2]['status'] = 'running'
        start_time = time.time()
        
        segregator = DataSegregator()
        unique_pairs = segregator.extract_unique_pairs(df)
        
        execution_time = time.time() - start_time
        stages[2]['status'] = 'completed'
        stages[2]['executionTime'] = round(execution_time, 2)
        stages[2]['recordsProcessed'] = len(unique_pairs)
        
        print(f"Data Segregation completed: {len(unique_pairs)} unique pairs in {execution_time:.2f}s")
        try:
            add_log('Data Segregation', f'Extracted {len(unique_pairs)} unique pairs', 'success', 'data_segregation')
        except:
            pass
        
        # STAGE 4: LLM Reasoner (only if full mode)
        if mode == 'full':
            print("\n--- STAGE 4: LLM Reasoner (FULL MODE) ---")
            try:
                add_log('LLM Reasoner', 'Fetching compliance metadata from LLM...', 'info', 'llm_reasoner')
            except:
                pass
            
            stages[3]['status'] = 'running'
            start_time = time.time()
            
            llm_reasoner = LLMReasoner()
            knowledge_base = llm_reasoner.build_knowledge_base(unique_pairs)
            
            execution_time = time.time() - start_time
            stages[3]['status'] = 'completed'
            stages[3]['executionTime'] = round(execution_time, 2)
            stages[3]['recordsProcessed'] = len(knowledge_base)
            
            print(f"LLM Reasoner completed: {len(knowledge_base)} KB entries in {execution_time:.2f}s")
            try:
                add_log('LLM Reasoner', f'Built KB with {len(knowledge_base)} entries', 'success', 'llm_reasoner')
            except:
                pass
        else:
            print("\n--- STAGE 4: LLM Reasoner (SKIPPED - QUICK MODE) ---")
            knowledge_base = {}
            stages[3]['status'] = 'completed'
            stages[3]['executionTime'] = 0.0
            stages[3]['recordsProcessed'] = 0
            try:
                add_log('LLM Reasoner', 'Skipped (quick mode)', 'info', 'llm_reasoner')
            except:
                pass
        
        # STAGE 5: Compliance Parser
        print("\n--- STAGE 5: Compliance Parser ---")
        try:
            add_log('Compliance Parser', 'Parsing compliance obligations...', 'info', 'compliance_parser')
        except:
            pass
        
        stages[4]['status'] = 'running'
        start_time = time.time()
        
        parser = ComplianceParser(knowledge_base, mode=mode)
        df = parser.parse(df)
        
        execution_time = time.time() - start_time
        stages[4]['status'] = 'completed'
        stages[4]['executionTime'] = round(execution_time, 2)
        stages[4]['recordsProcessed'] = len(df)
        
        print(f"Compliance Parser completed: {len(df)} records in {execution_time:.2f}s")
        try:
            add_log('Compliance Parser', f'Parsed {len(df)} records', 'success', 'compliance_parser')
        except:
            pass
        
        # STAGE 6: Report Generation
        print("\n--- STAGE 6: Report Generation ---")
        try:
            add_log('Report Generation', 'Generating compliance report...', 'info', 'report_generation')
        except:
            pass
        
        stages[5]['status'] = 'running'
        start_time = time.time()
        
        generator = ReportGenerator()
        report = generator.generate(df)
        
        execution_time = time.time() - start_time
        stages[5]['status'] = 'completed'
        stages[5]['executionTime'] = round(execution_time, 2)
        stages[5]['recordsProcessed'] = len(report['obligations'])
        
        print(f"Report Generation completed: {len(report['obligations'])} obligations in {execution_time:.2f}s")
        try:
            add_log('Report Generation', 'Report generated successfully', 'success', 'report_generation')
        except:
            pass
        
        # Save REAL compliance results
        print("\n--- Saving Compliance Results ---")
        try:
            from api.compliance import add_compliance_result, clear_compliance_results
            
            # Clear old data first
            clear_compliance_results()
            
            # Add real data from report
            for record in report['obligations']:
                add_compliance_result(record)
            
            print(f"Saved {len(report['obligations'])} REAL compliance records")
            try:
                add_log('Execute', f'Saved {len(report["obligations"])} compliance records', 'success', 'System')
            except:
                pass
        except Exception as e:
            print(f"Warning: Could not save compliance data: {str(e)}")
        
        # ✅ FIXED: Check for compliance issues AFTER processing
        try:
            from api.notifications import check_compliance_issues
            check_compliance_issues()
            print("Checked for critical compliance issues and generated notifications")
        except Exception as e:
            print(f"Warning: Could not generate notifications: {str(e)}")
        
        print("\n=== EXECUTE SUCCESS (REAL PIPELINE) ===\n")
        
        return jsonify({
            'success': True,
            'stages': stages,
            'report': report,
            'message': f'Compliance workflow completed successfully in {mode} mode!',
            'file_id': file_id,
            'mode': mode,
            'records_processed': len(df),
            'obligations_generated': len(report['obligations']),
            'completed_at': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        print(f"\n=== EXECUTE ERROR: {str(e)} ===")
        import traceback
        traceback.print_exc()
        
        try:
            from api.logs import add_log
            add_log('Execute', f'Execution failed: {str(e)}', 'error', 'System')
        except:
            pass
        
        return jsonify({
            'success': False,
            'error': str(e),
            'stages': stages if 'stages' in locals() else []
        }), 500
