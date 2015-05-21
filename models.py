# coding=utf-8
from flask.ext.sqlalchemy import SQLAlchemy

db = SQLAlchemy()

translation = db.Table('translation',
                       db.Column('word_id', db.Integer, db.ForeignKey('word.id')),
                       db.Column('translated_id', db.Integer, db.ForeignKey('word.id')))


class Word(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    language = db.Column(db.Unicode(80))
    text = db.Column(db.Unicode(80))
    translate = db.relationship('Word',
                                secondary=translation,
                                primaryjoin=(translation.c.word_id == id),
                                secondaryjoin=(translation.c.translated_id == id),
                                backref=db.backref('translated', lazy='dynamic'))

    def __init__(self, language, text):
        self.language = language.title()
        self.text = text

    def __repr__(self):
        return u'<Language %s, Text %s>' % (self.language, self.text)

# darl_eng = Word(u"english", u"darling")
# darl_fr = Word(u"french", u"chéri")
#
#
# darl_eng.translate.append(darl_fr)
#
# db.session.add(darl_eng)
# db.session.add(darl_fr)
# db.session.commit()