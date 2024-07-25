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