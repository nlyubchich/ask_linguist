from flask import abort
from flask import jsonify
from flask import render_template
from flask import redirect
from flask import url_for
from flask_login import current_user

from project.bl import get_user_languages
from project.blueprints import dashboard_app as app
from project.extensions import db
from project import bl
from .forms import EditPhraseForm, DeletePhraseForm, PhraseForm


@app.route('/')
def default_dashboard():
    return redirect(url_for('.dashboard', language='French'))


@app.route('/<language>')
def dashboard(language):
    return render_template(
        'dashboard/phrase_list.html',
        language=language,
    )


@app.route("/create/", methods=["POST"])
def create_phrase():
    phrase_form = PhraseForm()
    if not phrase_form.validate_on_submit():
        return jsonify(status="error", errors=phrase_form.errors)

    phrase = bl.create_phrase(
        user_id=current_user.id,
        language=phrase_form.language.data,
        source_text=phrase_form.source_text.data,
        translated_text=phrase_form.translated_text.data
    )
    db.session.add(phrase)
    db.session.commit()
    return jsonify(status="success", phrase_id=phrase.id)


@app.route("/edit/", methods=["POST"])
def edit_phrase():
    form = EditPhraseForm()

    if not form.validate_on_submit():
        return jsonify(status="error", errors=form.errors)

    phrase = bl.edit_phrase(
        user_id=current_user.id,
        phrase_id=form.phrase_id.data,
        source_text=form.source_text.data,
        translated_text=form.translated_text.data,
    )

    if not phrase:
        abort(400)

    db.session.add(phrase)
    db.session.commit()

    return jsonify(status="success")


@app.route("/delete/", methods=["POST"])
def delete_phrase():
    form = DeletePhraseForm()
    if not form.validate_on_submit():
        return jsonify(status="error", errors=form.errors)

    phrase = bl.delete_phrase(
        user_id=current_user.id,
        phrase_id=form.phrase_id.data
    )
    if not phrase:
        abort(400)

    db.session.commit()
    return jsonify(status="success")


@app.context_processor
def utility_processor():
    return dict(get_user_languages=get_user_languages)
