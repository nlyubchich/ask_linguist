from flask_debugtoolbar import DebugToolbarExtension
from flask_login import LoginManager
from flask_redis import FlaskRedis
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import CsrfProtect
from flask_oauthlib.client import OAuth

csrf = CsrfProtect()
toolbar = DebugToolbarExtension()
db = SQLAlchemy()
login_manager = LoginManager()
redis_store = FlaskRedis()
oauth = OAuth()
