from flask import Flask
from flask_cors import CORS
from flask_mysqldb import MySQL
from groq import Groq
import os

ai = Groq(api_key = os.getenv('GROQ_API_KEY'))
api = Flask(__name__)

CORS(api)

api.config['MYSQL_HOST'] = 'localhost'
api.config['MYSQL_USER'] = 'root'
api.config['MYSQL_PASSWORD'] = ''
api.config['MYSQL_DB'] = 'bookdb'
api.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

db = MySQL(api)

api.config['db'] = db
api.config['ai'] = ai

with api.app_context():
    from .ai import api_ai
    from .books import api_books
    from .auth import api_auth
    
    api.register_blueprint(api_books, url_prefix = '/books')
    api.register_blueprint(api_ai, url_prefix = '/ai')
    api.register_blueprint(api_auth, url_prefix = '/auth')