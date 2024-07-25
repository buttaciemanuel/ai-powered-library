import argparse
from flask import Flask
from flask_mysqldb import MySQL
import pandas

parser = argparse.ArgumentParser(
    prog = 'initdb', 
    usage = 'populate the SQL database with books',
    description = 'use a CSV file with (title, author, publication_year, price, currency, genre) schema to create and populate the SQL database'
)
parser.add_argument('datafile', type = str, help = 'CSV file with book entries to populate the database')

arguments = parser.parse_args()
dataset = pandas.read_csv(arguments.datafile)
api = Flask(__name__)

api.config['MYSQL_HOST'] = 'localhost'
api.config['MYSQL_USER'] = 'root'
api.config['MYSQL_PASSWORD'] = ''
api.config['MYSQL_DB'] = 'bookdb'

with api.app_context():
    db = MySQL(api)

    cursor = db.connection.cursor()

    cursor.execute('DROP TABLE IF EXISTS books;')

    cursor.execute('DROP TABLE IF EXISTS users;')

    cursor.execute('''CREATE TABLE books(
        id INT AUTO_INCREMENT, 
        title VARCHAR(255),
        author VARCHAR(255),
        publication_year INT,
        price FLOAT,
        currency VARCHAR(16),
        genre VARCHAR(255),
        PRIMARY KEY (id)
    );''')

    cursor.execute('''CREATE TABLE users(
        email VARCHAR(255),
        username VARCHAR(255),
        password VARCHAR(255),
        PRIMARY KEY (email)
    );''')

    for index, item in dataset.iterrows():
        cursor.execute('INSERT INTO books (title, author, publication_year, price, currency, genre) VALUES(\"{}\", \"{}\", \"{}\", \"{}\", \"{}\", \"{}\");'.format(
            item.title,
            item.author,
            item.publication_year,
            item.price,
            item.currency,
            item.genre
        ))

    db.connection.commit()
    
    cursor.close()