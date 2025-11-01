import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    # OpenAI (for LLM Reasoner and Chatbot)
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    
    # File Upload
    MAX_FILE_SIZE = int(os.getenv('MAX_FILE_SIZE', 50 * 1024 * 1024))
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', './data/uploads')
    ALLOWED_EXTENSIONS = {'csv', 'json'}
    
    # CORS
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
    
    # CSV Storage Paths (No database needed!)
    COMPLIANCE_RESULTS_FILE = './data/processed/compliance_results.csv'
    LOGS_FILE = './data/processed/execution_logs.csv'
    KB_CACHE_FILE = './data/kb_cache/knowledge_base.csv'
    
    # Policy Rules
    POLICY_RULES_FILE = os.getenv('POLICY_RULES_FILE', 'policy_rules.yaml')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}