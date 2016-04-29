from flask_wtf import Form
from werkzeug.security import check_password_hash
from wtforms import StringField, PasswordField
from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired, Email

from project.models import User


class RegisterForm(Form):
    email = EmailField('Email', validators=[DataRequired(), Email()])
    nick_name = StringField('Nickname', validators=[DataRequired()])
    first_name = StringField('First name', validators=[DataRequired()])
    last_name = StringField('Last name', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])

    def validate(self, *args, **kwargs):
        rv = Form.validate(self)
        if not rv:
            return False

        user = User.query.filter_by(email=self.email.data).first()
        if user:
            self.email.errors.append('Email already registered')
            return False
        return True


class LoginForm(Form):
    email = EmailField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])

    def __init__(self, *args, **kwargs):
        Form.__init__(self, *args, **kwargs)
        self.user = None

    def validate(self, *args, **kwargs):
        rv = Form.validate(self)
        if not rv:
            return False

        user = User.query.filter_by(email=self.email.data).first()
        if user is None:
            self.email.errors.append('Unknown username')
            return False

        if not check_password_hash(user.password, self.password.data):
            self.password.errors.append('Invalid password')
            return False

        self.user = user
        return True
