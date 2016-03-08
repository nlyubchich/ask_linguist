import json
import os

BASEDIR = os.path.abspath(os.path.dirname(__file__))

try:
    stats_json = json.load(open('project/static/stats.json'))
except FileNotFoundError:
    stats_json = dict()


class Config:
    DEBUG = False
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = 'really secret'

    CSRF = True
    CSRF_SECRET = 'really secret'

    JSONIFY_PRETTYPRINT_REGULAR = False

    STATIC_ASSETS_HASH = "trunk"

    # Logger configuration
    LOG_CONFIG = {
        'version': 1,
        'disable_existing_loggers': False,
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
                'level': 'INFO',
                'formatter': 'detailed',
                'stream': 'ext://sys.stdout',
            }
        },
        'formatters': {
            'detailed': {
                'format': '%(message)s',
            },
        },
        'root': {
            'level': 'INFO',
            'handlers': [
                'console',
            ]
        }
    }

    GOOGLE_OAUTH_PARAMS = {
        'client_id': os.getenv('GOOGLE_OAUTH_CLIENT_ID'),
        'client_secret': os.getenv('GOOGLE_OAUTH_CLIENT_SECRET'),
        'scope': ['email', 'profile'],
        'auth_uri':  os.getenv('GOOGLE_OAUTH_AUTH_URI'),
        'token_uri':  os.getenv('GOOGLE_OAUTH_TOKEN_URI'),
        'login_hint':  os.getenv('GOOGLE_OAUTH_LOGIN_HINT'),
    }


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SECRET_KEY = os.getenv('SECRET_KEY')
    CSRF_SECRET = os.getenv('CSRF_SECRET')
    STATIC_ASSETS_HASH = stats_json.get('hash')


class DevelopmentConfig(Config):
    # Flask
    DEBUG = True
    DEVELOPMENT = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True

    # Database
    SQLALCHEMY_DATABASE_URI = 'sqlite:///../db.sqlite3'

    DEBUG_TB_INTERCEPT_REDIRECTS = False


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
