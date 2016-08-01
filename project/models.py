from datetime import datetime, timedelta
from enum import Enum, unique
from project.extensions import db


class Phrase(db.Model):
    _progress_day_map = {
        0: timedelta(days=0),
        10: timedelta(days=1),
        20: timedelta(days=3),
        30: timedelta(days=7),
        40: timedelta(days=14),
    }

    _progress_percent_map = {
        0: "0%",
        10: "25%",
        20: "50%",
        30: "75%",
        40: "100%",
    }

    @unique
    class Status(Enum):
        visible = 0
        deleted = 1
        finished = 2

    @unique
    class ProgressStatus(Enum):
        started = 0
        after_day = 10
        after_three_days = 20
        after_week = 30
        after_two_week = 40

        def get_progress_delta(self):
            return Phrase._progress_day_map[self.value]

        def get_progress_percent(self):
            return Phrase._progress_percent_map[self.value]

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    status = db.Column(db.Integer, default=Status.visible.value)
    progress_status = db.Column(db.Integer, nullable=False,
                                default=ProgressStatus.started.value)

    language = db.Column(db.Unicode, nullable=False)

    date_created = db.Column(db.DateTime, nullable=False,
                             default=datetime.utcnow)
    date_available = db.Column(db.DateTime, nullable=False,
                               default=datetime.utcnow)

    source_text = db.Column(db.Unicode)
    translated_text = db.Column(db.Unicode)

    def __repr__(self):
        return '<Language %s, Text %s>' % (self.language, self.text)


class User(db.Model):
    @unique
    class RegisterType(Enum):
        google_oauth = 1
        inplace = 2

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.Unicode, unique=True, nullable=False)
    register_type = db.Column(db.Integer, nullable=False)

    nick_name = db.Column(db.Unicode)
    first_name = db.Column(db.Unicode)
    last_name = db.Column(db.Unicode)

    password = db.Column(db.Unicode)

    phrases = db.relationship('Phrase', backref='user', lazy='dynamic')

    @property
    def is_active(self):
        return True

    @property
    def is_authenticated(self):
        return True

    def get_id(self):
        return self.email
