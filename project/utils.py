# OPPA GOVNOCODE
from flask import url_for
from oauth2client.client import OAuth2WebServerFlow

from project.extensions import login_manager
from project.models import User


class Hashabledict(dict):
    def __key(self):
        return tuple((k, self[k]) for k in sorted(self))

    def __hash__(self):
        return hash(self.__key())

    def __eq__(self, other):
        return self.__key() == other.__key()


def google_oauth_loader():
    from project import app
    return OAuth2WebServerFlow(
        redirect_uri=url_for('index.google_oauth', _external=True),
        **app.config['GOOGLE_OAUTH_PARAMS']
    )


@login_manager.user_loader
def load_user(user_email):
    return User.query.filter_by(email=user_email).first()
