from flask import jsonify, render_template
from flask.ext.login import current_user

from project.blueprints import dashboard_app as app
from project.extensions import db
from project.models import Phrase
from project import bl
from .forms import EditPhraseForm, DeletePhraseForm, PhraseForm


@app.route('/list')
def phrase_list():
    phrases = (
        bl.get_phrases_by_user(current_user.id)
        .order_by(Phrase.id.desc())
    )
    phrases = [{
        "phraseId": phrase.id,
        "sourceLanguage": phrase.source_language,
        "sourceText": phrase.source_text,
        "translatedLanguage": phrase.translated_language,
        "translatedText": phrase.translated_text,
        "dateCreated": phrase.date_created,
        "dateAvailable": phrase.date_available,
        "progressStatus": (
            Phrase.ProgressStatus(phrase.progress_status)
            .get_progress_percent()
        )
    } for phrase in phrases]
    return jsonify(phrases=phrases)


@app.route('/', methods=['GET', 'POST'])
def dashboard():
    phrase_form = PhraseForm()
    if phrase_form.validate_on_submit():
        phrase = bl.create_phrase(**phrase_form.data)

        db.session.add(phrase)
        db.session.commit()

        phrase_form.source_text.data, phrase_form.translated_text.data = "", ""
    return render_template('dashboard/post.html', phrase_form=phrase_form)


@app.route("/edit/", methods=["POST"])
def edit_phrase():
    form = EditPhraseForm()
    if form.validate_on_submit():
        # TODO: only owner can edit the phrase
        phrase = bl.edit_phrase(**form.data)
        db.session.add(phrase)
        db.session.commit()

        return jsonify(status="OK")
    return jsonify(status="not OK", errors=form.errors)


@app.route("/delete/", methods=["POST"])
def delete_phrase():
    form = DeletePhraseForm()
    if form.validate_on_submit():
        # TODO: only owner can delete the phrase
        phrase = bl.delete_phrase(form.phrase_id.data)
        db.session.add(phrase)
        db.session.commit()

        return jsonify(status="OK")
    return jsonify(status="not OK", errors=form.errors)
