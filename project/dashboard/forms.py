from flask_wtf import Form
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired


class PhraseForm(Form):
    language = StringField(validators=[DataRequired()])
    source_text = StringField(validators=[DataRequired()])
    translated_text = StringField(validators=[DataRequired()])


class EditPhraseForm(Form):
    phrase_id = IntegerField(validators=[DataRequired()])
    source_text = StringField(validators=[DataRequired()])
    translated_text = StringField(validators=[DataRequired()])


class DeletePhraseForm(Form):
    phrase_id = IntegerField(validators=[DataRequired()])
