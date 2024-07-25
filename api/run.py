from dotenv import load_dotenv

load_dotenv('./settings/.env')

from api.routes import api

if __name__ == '__main__':
    api.run(host = 'localhost', port = 8000)