from flask import url_for
from oauth2client.client import OAuth2WebServerFlow

from project.extensions import login_manager
from project.models import User


def google_oauth_loader():
    from project import app
    return OAuth2WebServerFlow(
        redirect_uri=url_for('index.google_oauth', _external=True),
        **app.config['GOOGLE_OAUTH_PARAMS']
    )


@login_manager.user_loader
def load_user(user_email):
    return User.query.filter_by(email=user_email).first()
