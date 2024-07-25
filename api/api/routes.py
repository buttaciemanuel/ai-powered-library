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

db = MySQL(api)

api.config['db'] = db
api.config['ai'] = ai

with api.app_context():
    from .ai import api_ai
    from .books import api_books
    
    api.register_blueprint(api_books, url_prefix = '/books')
    api.register_blueprint(api_ai, url_prefix = '/ai')