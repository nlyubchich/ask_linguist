from flask import jsonify, render_template
from flask import redirect
from flask import url_for
from flask_login import current_user

from project import bl
from project.bl import get_user_languages
from project.blueprints import questionnaire_app as app
from project.extensions import db
from project.questionnaire.forms import MarkDoneForm


@app.route("/mark_done", methods=["POST"])
def mark_done():
    form = MarkDoneForm()
    if not form.validate_on_submit():
        return jsonify(status="error", errors=form.errors)
    phrases = bl.questionnaire_done(current_user.id, form.language.data)
    map(db.session.add, phrases)
    db.session.commit()
    return jsonify(status='success')


@app.route('/')
@app.route('/words')
def default_words():
    return redirect(url_for('.words', language='French'))


@app.route('/<language>')
def words(language):
    return render_template(
        'questionnaire/question.html',
        language=language,
    )


@app.context_processor
def utility_processor():
    return dict(get_user_languages=get_user_languages)
