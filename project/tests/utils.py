from mixer.backend.flask import mixer
from project.application import create_app
from flask.ext.testing import TestCase as FlaskTestCase


class TestCase(FlaskTestCase):
    def create_app(self):
        app = create_app()
        app.config['TESTING'] = True
        mixer.init_app(app)
        return app

    def login(self, username, password):
        return self.client.post('/login', data=dict(
            username=username,
            password=password
        ), follow_redirects=True)

    def logout(self):
        return self.client.post('/logout', follow_redirects=True)
