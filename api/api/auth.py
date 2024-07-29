from flask import Blueprint, jsonify, request, current_app
from hashlib import sha256
import uuid

api_auth = Blueprint("api_auth", __name__)

@api_auth.route('/signin', methods = [ 'POST' ])
def signin():
    cursor = current_app.config["db"].connection.cursor()

    try:
        cursor.execute("SELECT email, password FROM users WHERE email=\"{}\";".format(
            request.args.get('email').strip()
        ))
    except:
        cursor.close()
        return jsonify({ 'error': 'Unable to the sign in the user' }), 500

    entry = cursor.fetchone()

    if entry is None or len(entry) < 1:
        return jsonify({ 'error': 'User does not exist' }), 400

    email = entry[0]
    password = entry[1]
    token = str(uuid.uuid4())

    if password != sha256(request.args.get('password').strip().encode('utf-8')).hexdigest():
        return jsonify({ 'error': 'Invalid password crendential' }), 400

    try:        
        cursor.execute('INSERT INTO sessions (email, token) VALUES(\"{}\", \"{}\");'.format(
            email,
            token
        ))
        current_app.config['db'].connection.commit()
    except:
        cursor.close()
        return jsonify({ 'error': 'Unable to the sign in the user' }), 500

    cursor.close()

    return jsonify({ 'message': 'User has successfully signed in', 'token': token }), 200

@api_auth.route('/signup', methods = [ 'POST' ])
def signup():
    cursor = current_app.config["db"].connection.cursor()

    try:
        cursor.execute("SELECT email, password FROM users WHERE email=\"{}\";".format(
            request.args.get('email').strip()
        ))
    except:
        cursor.close()
        return jsonify({ 'error': 'Unable to the sign up the user' }), 500
    
    entry = cursor.fetchone()

    if entry is not None and len(entry) > 0:
        return jsonify({ 'error': 'User already exists' }), 400
    
    email = request.args.get('email').strip()
    password = sha256(request.args.get('password').strip().encode('utf-8')).hexdigest()
    token = str(uuid.uuid4())

    try:
        cursor.execute('INSERT INTO users (email, password) VALUES(\"{}\", \"{}\");'.format(
            email,
            password,
        ))
        cursor.execute('INSERT INTO sessions (email, token) VALUES(\"{}\", \"{}\");'.format(
            email,
            token,
        ))
        current_app.config['db'].connection.commit()
    except:
        cursor.close()
        return jsonify({ 'error': 'Unable to the sign up the user' }), 500
    
    cursor.close()

    return jsonify({ 'message': 'User has successfully signed up and in', 'token': token }), 200

@api_auth.route('/signout', methods = [ 'POST' ])
def signout():
    if not request.args.get('email') or not request.args.get('token'):
        return jsonify({ 'error': 'You lack authorization to make this call' }), 401
    
    cursor = current_app.config["db"].connection.cursor()

    try:
        cursor.execute("SELECT email, token FROM sessions WHERE email=\"{}\" AND token=\"{}\";".format(
            request.args.get('email').strip(),
            request.args.get('token').strip(),
        ))
    except:
        cursor.close()
        return jsonify({ 'error': 'Unable to sign out' }), 500

    entry = cursor.fetchone()

    if entry is None or len(entry) < 1:
        return jsonify({ 'error': 'Invalid request due to session expiration or invalid credentials' }), 400
    
    try:
        cursor.execute("DELETE FROM sessions WHERE email=\"{}\" AND token=\"{}\";".format(
            entry[0],
            entry[1]
        ))
        current_app.config['db'].connection.commit()
    except:
        cursor.close()
        return jsonify({ 'error': 'Unable to sign out' }), 500

    return jsonify({ 'message': 'User has successfully signed out' }), 200