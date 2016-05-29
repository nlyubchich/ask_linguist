from project.extensions import oauth
from flask_oauthlib.contrib.apps import google as google_app


google = google_app.register_to(oauth, name='GOOGLE_OAUTH_PARAMS')

