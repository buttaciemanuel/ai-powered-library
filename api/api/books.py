from flask import Blueprint, jsonify, request, current_app
from .utilities import validate_book

api_books = Blueprint('api_books', __name__)

@api_books.route('/show', methods = [ 'GET', 'POST' ])
def show():
    # selection filters based on column matching
    title = request.args.get('title')
    author = request.args.get('author')
    publication_year = request.args.get('publication_year')
    price = request.args.get('price')
    currency = request.args.get('currency')
    genre = request.args.get('genre')
    # limit count and ordering options
    limit = request.args.get('count')
    sortby = request.args.get('sortby')
    reverse = request.args.get('reverse', 0, type = int)

    cursor = current_app.config['db'].connection.cursor()
    command = [ 'SELECT id, title, author, publication_year, price, currency, genre FROM books' ]

    filters = []

    if title is not None:
        filters.append('LOWER(title) LIKE \"%{}%\"'.format(title.lower()))

    if author is not None:
        filters.append('LOWER(author) LIKE \"%{}%\"'.format(author.lower()))

    if publication_year is not None:
        filters.append('publication_year={}'.format(publication_year))

    if price is not None:
        filters.append('CAST(price AS UNSIGNED)={}'.format(int(price)))

    if currency is not None:
        filters.append('LOWER(currency)=\"{}\"'.format(currency.lower()))
    
    if genre is not None:
        filters.append('LOWER(genre) LIKE \"%{}%\"'.format(genre.lower()))

    if len(filters) > 0:
        command.append('WHERE {}'.format(' AND '.join(filters)))

    if sortby is not None:
        command.append('ORDER BY {} {}'.format(
            'LOWER(TRIM({}))'.format(sortby) if sortby in [ 'title', 'author', 'genre', 'currency' ] else sortby, 
            'ASC' if reverse != 1 else 'DESC'
        ))
    
    if limit is not None:
        command.append('LIMIT {}'.format(limit))

    command = ' '.join(command)

    try:
        cursor.execute(command)
        entries = cursor.fetchall()
    except:
        cursor.close()
        return jsonify({ 'error': 'Unable to fetch the books from the database' }), 500
    
    cursor.close()
    
    return jsonify([
        dict(zip([ 'id', 'title', 'author', 'publication_year', 'price', 'currency', 'genre' ], entry))
        for entry in entries
    ])

@api_books.route('/edit/<int:id>', methods = [ 'POST' ])
def edit(id: int):
    valid, result = validate_book(
        title = request.args.get('title'),
        author = request.args.get('author'),
        publication_year = request.args.get('publication_year'),
        price = request.args.get('price'),
        currency = request.args.get('currency', 'USD'),
        genre = request.args.get('genre', ''),
        allow_empty_field = True
    )

    if not valid:
        return result
    
    title, author, publication_year, price, currency, genre = result    
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

    updates = []

    if title is not None and len(title) > 0:
        updates.append('title=\"{}\"'.format(title))

    if author is not None and len(author) > 0:
        updates.append('author=\"{}\"'.format(author))

    if publication_year is not None:
        updates.append('publication_year={}'.format(publication_year))

    if price is not None:
        updates.append('price={}'.format(price))

    if currency is not None and len(currency) > 0:
        updates.append('currency=\"{}\"'.format(currency))

    if genre is not None and len(genre) > 0:
        updates.append('genre=\"{}\"'.format(genre))

    try:
        cursor.execute('UPDATE books SET {} WHERE id={};'.format(
            ', '.join(updates),
            id
        ))
        current_app.config['db'].connection.commit()
    except:
        cursor.close()
        return jsonify({ 'error': 'Unable to edit the book from the database' }), 500
    
    cursor.close()

    return jsonify({ 'message': 'Your book has been successfully edited' }), 200

@api_books.route('/delete/<int:id>', methods = [ 'DELETE' ])
def delete(id: int):
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

    try:
        cursor.execute('DELETE FROM books WHERE id={};'.format(id))
        current_app.config['db'].connection.commit()
    except:
        cursor.close()
        return jsonify({ 'error': 'Unable to delete the book from the database' }), 500
    
    cursor.close()

    return jsonify({ 'message': 'Your book has been successfully deleted from the collection' }), 200

@api_books.route('/add', methods = [ 'POST' ])
def add():
    valid, result = validate_book(
        title = request.args.get('title'),
        author = request.args.get('author'),
        publication_year = request.args.get('publication_year'),
        price = request.args.get('price'),
        currency = request.args.get('currency', 'USD'),
        genre = request.args.get('genre', '')
    )

    if not valid:
        return result
    
    title, author, publication_year, price, currency, genre = result
    cursor = current_app.config['db'].connection.cursor()

    try:
        cursor.execute('SELECT * FROM books WHERE LOWER(title)=\"{}\" AND LOWER(author)=\"{}\" LIMIT 1;'.format(title.lower(), author.lower()))
    except:
        cursor.close()
        return jsonify({ 'error': 'Unable to add the new book to the database' }), 500
        
    entry = cursor.fetchone()

    if entry is not None and len(entry) > 0:
        cursor.close()
        return jsonify({ 'error': 'Unable to add the new book since it already exists' }), 400

    try:
        cursor.execute('INSERT INTO books (title, author, publication_year, price, currency, genre) VALUES(\"{}\", \"{}\", \"{}\", \"{}\", \"{}\", \"{}\");'.format(
            title,
            author,
            publication_year,
            price,
            currency,
            genre
        ))
        current_app.config['db'].connection.commit()
    except:
        cursor.close()
        return jsonify({ 'error': 'Unable to add the new book to the database' }), 500
    
    cursor.close()

    return jsonify({ 'message': 'Your book has been successfully added to the collection' }), 200

@api_books.route('/review/<int:id>', methods = [ 'POST' ])
def review(id: int):
    if not request.args.get('email') or not request.args.get('token'):
        return jsonify({ 'error': 'You lack authorization to make this call' }), 401
    
    cursor = current_app.config["db"].connection.cursor()

    email = request.args.get('email').strip()
    token = request.args.get('token').strip()

    try:
        cursor.execute("SELECT email, token FROM sessions WHERE email=\"{}\" AND token=\"{}\";".format(
            email,
            token,
        ))
    except:
        cursor.close()
        return jsonify({ 'error': 'Unable to sign out' }), 500

    entry = cursor.fetchone()

    if entry is None or len(entry) < 1:
        return jsonify({ 'error': 'Invalid request due to session expiration or invalid user' }), 400
    
    try:
        cursor.execute('SELECT * FROM books WHERE id={};'.format(id))
    except:
        cursor.close() 
        return jsonify({ 'error': 'Unable to search the book inside the database' }), 500
    
    entry = cursor.fetchone()

    if entry is None or len(entry) < 1:
        cursor.close()
        return jsonify({ 'error': 'Unable to find the book within the database' }), 400
    
    n_stars = request.args.get('n_stars', type = int)
    content = request.args.get('content')

    if n_stars is None or n_stars < 0 or n_stars > 5:
        cursor.close()
        return jsonify({ 'error': 'The number of stars must be in range 1...5' }), 400
    
    if content is None or len(content.strip()) < 1:
        cursor.close()
        return jsonify({ 'error': 'The textual comment must be non-empty' }), 400

    try:
        cursor.execute('INSERT INTO reviews (email, bookid, n_stars, content) VALUES(\"{}\", {}, {}, \"{}\");'.format(
            email,
            id,
            n_stars,
            content
        ))
        current_app.config['db'].connection.commit()
    except:
        cursor.close()
        return jsonify({ 'error': 'Unable to add a review of the book into the database' }), 500
    
    cursor.close()

    return jsonify({ 'message': 'Your review has been successfully added', 'token': token }), 200

@api_books.route('/getreviews/<int:id>', methods = [ 'GET' ])
def getreviews(id: int):
    cursor = current_app.config["db"].connection.cursor()
    
    try:
        cursor.execute('SELECT * FROM books WHERE id={};'.format(id))
    except:
        cursor.close() 
        return jsonify({ 'error': 'Unable to search the book inside the database' }), 500
    
    entry = cursor.fetchone()

    if entry is None or len(entry) < 1:
        cursor.close()
        return jsonify({ 'error': 'Unable to find the book within the database' }), 400
    
    try:
        cursor.execute('SELECT email, n_stars, content, creation_timestamp FROM reviews WHERE bookid={} ORDER BY creation_timestamp DESC LIMIT {};'.format(
            id,
            request.args.get('count') if request.args.get('count') else 100
        ))
    except:
        cursor.close() 
        return jsonify({ 'error': 'Unable to search for the reviewers of the book' }), 500
    
    entries = cursor.fetchall()
    
    cursor.close()

    if not entries:
        return jsonify({ 'message': 'This book has not been reviewed yet', 'reviews': [] }), 200

    return jsonify({ 'message': 'The reviewers of the selected book have been computed', 'reviews': [
        dict(zip([ 'email', 'n_stars', 'content', 'creation_timestamp'], entry)) 
        for entry in entries
    ] }), 200

@api_books.route('/getreviewedbooks/<string:email>', methods = [ 'POST' ])
def getreviewedbooks(email: str):
    if not email or not request.args.get('token'):
        return jsonify({ 'error': 'You lack authorization to make this call' }), 401
    
    token = request.args.get('token').strip()
    cursor = current_app.config["db"].connection.cursor()

    try:
        cursor.execute("SELECT email, token FROM sessions WHERE email=\"{}\" AND token=\"{}\";".format(
            email,
            token,
        ))
    except:
        cursor.close()
        return jsonify({ 'error': 'Unable to search the reviewed books of requested user' }), 500

    entry = cursor.fetchone()

    if entry is None or len(entry) < 1:
        return jsonify({ 'error': 'Invalid request due to session expiration or invalid credentials' }), 400
    
    try:
        cursor.execute('SELECT bookid FROM reviews where email=\"{}\";'.format(email))
    except:
        cursor.close() 
        return jsonify({ 'error': 'Unable to search for the reviews of the user' }), 500
    
    entries = cursor.fetchall()
    
    cursor.close()

    if not entries:
        return jsonify({ 'message': 'This user has not reviewed any books yet', 'reviewed_books': [], 'token': token }), 200

    return jsonify({ 'message': 'The reviewers of the selected book have been computed', 'reviewed_books': [
        entry[0] for entry in entries
    ], 'token': token }), 200