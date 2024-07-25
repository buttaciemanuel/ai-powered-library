from flask import jsonify
import re

CURRENCIES = [ 'USD', 'EUR' ]

def validate_book(
    title: str | None, 
    author: str | None, 
    publication_year: str | None, 
    price: str | None, 
    currency: str | None, 
    genre: str | None,
    allow_empty_field: bool = False
) -> tuple[bool, tuple]:
    if not allow_empty_field and (title is None or author is None or publication_year is None or price is None):
        return False, (jsonify({
            'error': 'Missing fields, you need to fill (title, author, publication_year, price)' 
        }), 400)
    
    if publication_year is not None and re.match(r'^\d+$', publication_year.strip()) is None:
        return False, (jsonify({
            'error': 'Invalid publication_year field, it must be a positive integer'
        }), 400)

    if price is not None and re.match(r'^\d+(?:\.\d+)$', price.strip()) is None:
        return False, (jsonify({
            'error': 'Invalid price field, it must be a positive floating point number'
        }), 400)
    
    if currency is not None and currency.strip() not in CURRENCIES:
        return False, (jsonify({
            'error': 'Invalid currency field, it must be one of {}'.format(', '.join(CURRENCIES))
        }), 400)
    
    return True, (
        title.strip() if title is not None else None, 
        author.strip() if author is not None else None, 
        int(publication_year) if publication_year is not None else None, 
        float(price) if price is not None else None, 
        currency.strip() if currency is not None else None, 
        genre.strip() if genre is not None else None
    )