from flask_wtf import Form
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired


class PhraseForm(Form):
    source_language = StringField('Source language', validators=[DataRequired()])
    source_text = StringField('Source text', validators=[DataRequired()])
    translated_language = StringField('Language translated to', validators=[DataRequired()])
    translated_text = StringField('Translated text', validators=[DataRequired()])


class EditPhraseForm(Form):
    phrase_id = IntegerField('phrase_id', validators=[DataRequired()])
    source_language = StringField('Source language', validators=[DataRequired()])
    source_text = StringField('Source text', validators=[DataRequired()])
    translated_language = StringField('Language translated to', validators=[DataRequired()])
    translated_text = StringField('Translated text', validators=[DataRequired()])


class DeletePhraseForm(Form):
    phrase_id = IntegerField('phrase_id', validators=[DataRequired()])
