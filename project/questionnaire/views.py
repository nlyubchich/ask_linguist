from flask import jsonify, render_template
from flask_login import current_user

from project import bl
from project.blueprints import questionnaire_app as app
from project.extensions import db


@app.route("/mark_done")
def mark_done():
    phrases = bl.questionnaire_done(current_user.id, 'French')
    map(db.session.add, phrases)
    db.session.commit()
    return jsonify(status='ok')


@app.route("/words")
def words():
    return render_template('questionnaire/question.html')
