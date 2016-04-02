from flask import jsonify, render_template
from flask.ext.login import current_user

from project import bl
from project.bl import PHRASE_REDIS_KEY_TEMPLATE
from project.blueprints import questionnaire_app as app
from project.extensions import redis_store, db
from project.models import Phrase


@app.route("/<source_language>-<translated_language>/")
def questionnaire(source_language, translated_language):
    redis_key = dict(
        user_id=current_user.id,
        source_language=translated_language,
        translated_language=source_language,
    )

    phrase_ids = redis_store.lrange(
        PHRASE_REDIS_KEY_TEMPLATE.format(**redis_key), 0, -1
    )
    phrase_ids = [int(phrase_id) for phrase_id in phrase_ids]
    if not phrase_ids:
        phrase_ids = bl.mark_available_phrases(**redis_key)

    if not phrase_ids:
        return jsonify(status='no words')

    phrases = [
        {
            'source': phrase.translated_text,
            'target': phrase.source_text,
        }
        for phrase in Phrase.query.filter(Phrase.id.in_(phrase_ids))
    ]

    return jsonify(phrases=phrases)


@app.route("/mark_done")
def mark_done():
    phrases = bl.questionnaire_done(current_user.id, 'French', 'English')
    map(db.session.add, phrases)
    db.session.commit()
    return jsonify(status='ok')


@app.route("/words")
def words():
    return render_template('questionnaire/question.html')
