from flask_wtf import Form
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired


class WordForm(Form):
    language = StringField('Language', validators=[DataRequired()])
    word = StringField('Word', validators=[DataRequired()])


class EditWordForm(Form):
    target_id = IntegerField('target_id', validators=[DataRequired()])
    word = StringField('Word', validators=[DataRequired()])


class DeleteWordForm(Form):
    target_id = IntegerField('target_id', validators=[DataRequired()])
