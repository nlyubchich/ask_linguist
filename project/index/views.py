import json
from flask import (
    request,
    redirect,
    url_for,
    render_template,
    jsonify,
    current_app,
    session
)
from flask.ext.login import login_required, login_user, logout_user
from werkzeug.security import generate_password_hash

from project import bl
from project.blueprints import index_app as app

from project.extensions import db
from project.models import User
from project.oauth import google
from project.bl import load_user
from .forms import RegisterForm, LoginForm

js_error_format = '''
Javascript error occured: %(message)s
Location:           %(url)s

Stacktrace:
%(stacktrace)s
'''


@login_required
@app.route('/')
def index():
    return redirect(url_for('dashboard.dashboard'))


@login_required
@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('.register'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        login_user(form.user, remember=True)
        return redirect(url_for('dashboard.dashboard'))
    return render_template('index/login.html', form=form)


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        user = bl.create_user(
            email=form.email.data,
            nick_name=form.nick_name.data,
            first_name=form.first_name.data,
            last_name=form.last_name.data,
            register_type=User.RegisterType.inplace.value,
        )
        user.password = generate_password_hash(form.password.data)
        db.session.add(user)
        db.session.commit()

        login_user(user, remember=True)
        return redirect(url_for('dashboard.dashboard'))
    return render_template('index/register.html', form=form)


@app.route('/google_login')
def google_login():
    return google.authorize(
        callback=url_for(
            '.google_authorized',
            _external=True,
            # next=request.args.get('next') or request.referrer or None
        )
    )


@app.route('/google_oauth')
def google_authorized():
    next_url = request.args.get('next') or url_for('.index')
    resp = google.authorized_response()
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        )
    session['google_token'] = (resp['access_token'], '')
    person = google.get('userinfo').data
    user_email = person['email']
    user = load_user(user_email)
    if not user:
        nick_name = person['name']
        first_name = person['given_name']
        last_name = person['family_name']
        user = bl.create_user(
            email=user_email,
            nick_name=nick_name,
            first_name=first_name,
            last_name=last_name,
            register_type=User.RegisterType.google_oauth.value,
        )

    login_user(user, remember=True)
    db.session.add(user)
    db.session.commit()

    return redirect(next_url)


@app.route('/js_errors', methods=['POST'])
def js_errors():
    payload = json.loads(request.data.decode("utf-8"))
    current_app.logger.error(js_error_format % payload)
    return jsonify(status='ok')
