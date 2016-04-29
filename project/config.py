import json
import os

BASEDIR = os.path.abspath(os.path.dirname(__file__))

try:
    stats_json = json.load(open('project/static/stats.json'))
except FileNotFoundError:
    stats_json = dict()

try:
    google_oauth_json = json.load(open('client_secret.json'))['web']
except FileNotFoundError:
    google_oauth_json = dict()


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
        'client_id': google_oauth_json.get('client_id'),
        'client_secret': google_oauth_json.get('client_secret'),
        'scope': ['email', 'profile'],
        'auth_uri': google_oauth_json.get('auth_uri'),
        'token_uri': google_oauth_json.get('token_uri'),
        'login_hint': 'hello there',
    }


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SECRET_KEY = os.getenv('SECRET_KEY')
    CSRF_SECRET = os.getenv('CSRF_SECRET')
    STATIC_ASSETS_HASH = stats_json.get('hash')
    REDIS_URL = os.getenv('REDISCLOUD_URL')

    GOOGLE_OAUTH_PARAMS = {
        'client_id': os.getenv('GOOGLE_OAUTH_CLIENT_ID'),
        'client_secret': os.getenv('GOOGLE_OAUTH_CLIENT_SECRET'),
        'scope': ['email', 'profile'],
        'auth_uri': os.getenv('GOOGLE_OAUTH_AUTH_URI'),
        'token_uri': os.getenv('GOOGLE_OAUTH_TOKEN_URI'),
        'login_hint': os.getenv('GOOGLE_OAUTH_LOGIN_HINT'),
    }


class DevelopmentConfig(Config):
    # Flask
    DEBUG = True
    DEVELOPMENT = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True

    # Database
    # SQLALCHEMY_DATABASE_URI = 'sqlite:///../db.sqlite3'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///db.sqlite3'

    DEBUG_TB_INTERCEPT_REDIRECTS = False


class VaggaConfig(DevelopmentConfig):
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')


class VaggaTestingConfig(VaggaConfig):
    DEBUG = False


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
