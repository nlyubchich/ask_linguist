from flask.ext.debugtoolbar import DebugToolbarExtension
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.wtf import CsrfProtect

csrf = CsrfProtect()
toolbar = DebugToolbarExtension()
db = SQLAlchemy()
