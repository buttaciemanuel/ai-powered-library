from flask import Blueprint, jsonify, request, current_app

api_ai = Blueprint('api_ai', __name__)

@api_ai.route('/summary/<int:id>', methods = [ 'GET' ])
def summary(id: int):
    cursor = current_app.config['db'].connection.cursor()

    try:
        cursor.execute('SELECT * FROM books WHERE id={};'.format(id))
    except:
        cursor.close() 
        return jsonify({ 'error': 'Unable to search the book inside the database' }), 500
    
    entry = cursor.fetchone()

    if entry is None or len(entry) < 1:
        cursor.close()
        return jsonify({ 'error': 'Unable to find the book within the database' }), 400
    
    cursor.close()

    _, title, author, _, _, _, _ = entry

    completion = current_app.config['ai'].chat.completions.create(
        model = 'llama3-8b-8192',
        messages = [
            { 
                'role': 'user', 
                'content': 'Write a brief summary for book \'{}\' from {}'.format(title, author)
            }
        ],
        max_tokens = 1024
    )

    return jsonify({
        'summary': completion.choices[0].message.content
    })

@api_ai.route('/recommendation/<int:id>', methods = [ 'GET' ])
def recommendation(id: int):
    description = request.args.get('description')
    mood = request.args.get('mood')
    goal = request.args.get('goal')
    age = request.args.get('age')

    features = {}

    if description is not None and len(description.strip()) > 0:
        features['description'] = description.strip()

    if mood is not None and len(mood.strip()) > 0:
        features['mood'] = mood.strip()

    if goal is not None and len(goal.strip()) > 0:
        features['goal'] = goal.strip()


    cursor = current_app.config['db'].connection.cursor()

    try:
        cursor.execute('SELECT * FROM books WHERE id={};'.format(id))
    except:
        cursor.close() 
        return jsonify({ 'error': 'Unable to search the book inside the database' }), 500
    
    entry = cursor.fetchone()

    if entry is None or len(entry) < 1:
        cursor.close()
        return jsonify({ 'error': 'Unable to find the book within the database' }), 400
    
    cursor.close()

    _, title, author, _, _, _, genre = entry

    completion = current_app.config['ai'].chat.completions.create(
        model = 'llama3-8b-8192',
        messages = [
            { 
                'role': 'system', 
                'content': 'Hello helpful assistant! You will give me future recommendations based on my personal features \'{}\''.format(
                    features
                )
            },
            { 
                'role': 'user', 
                'content': 'Tell me how much the book {} from {} of genre {} aligns with me in percentage and briefly explain why in prose. Do not provide additional recommendations and do not ask additional questions.'.format(
                    title,
                    author,
                    genre
                )
            }
        ],
        max_tokens = 1024
    )

    return jsonify({
        'recommendation': completion.choices[0].message.content
    })