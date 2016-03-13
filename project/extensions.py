from flask.ext.debugtoolbar import DebugToolbarExtension
from flask.ext.login import LoginManager
from flask.ext.migrate import Migrate
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.wtf import CsrfProtect

csrf = CsrfProtect()
toolbar = DebugToolbarExtension()
db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()
