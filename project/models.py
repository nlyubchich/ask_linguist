# coding=utf-8
from datetime import datetime
from enum import Enum, unique
from oauth2client import client
from project.extensions import db

translation = db.Table('translation',
                       db.Column('word_id', db.Integer, db.ForeignKey('word.id')),
                       db.Column('translated_id', db.Integer, db.ForeignKey('word.id')))


@unique
class WordStatus(Enum):
    visible = 0
    deleted = 1


class Word(db.Model):
    @unique
    class ProgressStatus(Enum):
        started = 0
        after_day = 10
        after_three_days = 20
        after_week = 30
        after_two_week = 40

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.Integer, default=WordStatus.visible.value)
    language = db.Column(db.Unicode(80))
    text = db.Column(db.Unicode(80))

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    progress_status = db.Column(db.Integer, nullable=False, default=ProgressStatus.started)

    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    date_is_available_after = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    translate = db.relationship(
        'Word',
        lazy='dynamic',
        secondary=translation,
        primaryjoin=(translation.c.word_id == id),
        secondaryjoin=(translation.c.translated_id == id),
        backref=db.backref('translated', lazy='dynamic'),
    )

    def __init__(self, language, text):
        self.language = language.title()
        self.text = text

    def __repr__(self):
        return '<Language %s, Text %s>' % (self.language, self.text)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.Unicode, unique=True, nullable=False)

    nick_name = db.Column(db.Unicode)
    first_name = db.Column(db.Unicode)
    last_name = db.Column(db.Unicode)

    # Google OAuth
    auth_data = db.Column(db.Unicode, nullable=False)

    words = db.relationship('Word', backref='user', lazy='dynamic')

    @property
    def is_active(self):
        return True

    @property
    def is_authenticated(self):
        credentials = client.OAuth2Credentials.from_json(self.auth_data)
        if credentials.access_token_expired:
            return False
        return True

    def get_id(self):
        return self.email
