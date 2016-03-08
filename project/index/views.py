import httplib2
from apiclient import discovery
from flask import request, redirect, url_for, render_template
from flask.ext.login import login_required, login_user
from project.blueprints import index_app as app

from project.extensions import db
from project.models import User
from project.utils import google_oauth_loader


@app.route('/')
@login_required
def index():
    return redirect(url_for('dashboard.hello_world'))


@app.route('/login')
def login():
    return render_template('index/login.html')


@app.route('/google_oauth')
def google_oauth():
    flow = google_oauth_loader()

    if 'code' not in request.args:
        auth_uri = flow.step1_get_authorize_url()
        return redirect(auth_uri)

    auth_code = request.args.get('code')

    credentials = flow.step2_exchange(auth_code)
    user_email = credentials.id_token['email']

    user = User.query.filter_by(email=user_email).first()
    if not user:
        http_auth = credentials.authorize(httplib2.Http())
        service = discovery.build(
            serviceName='plus',
            version='v1',
            http=http_auth,
        )
        person = service.people().get(userId='me').execute()
        nick_name = person['displayName']
        first_name = person['name']['givenName']
        last_name = person['name']['familyName']
        user = User(
            email=user_email,
            nick_name=nick_name,
            first_name=first_name,
            last_name=last_name,
        )

    user.auth_data = credentials.to_json()

    db.session.add(user)
    db.session.commit()

    login_user(user, remember=True)

    return redirect(url_for('index.index'))
