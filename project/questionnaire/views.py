from flask import jsonify, render_template

from project.blueprints import questionnaire_app as app
from project.models import Word
from project.utils import Hashabledict


@app.route("/<source>-<target>/")
def questionnaire(source, target):
    my_words = Word.query.filter_by(language=target)

    w = [
        Hashabledict(
            source=tuple(source.text for source in word.translated.filter_by(language=source)),
            target=word.text
        )
        for word in my_words
        if word.translated.filter_by(language=source).first()
        ]

    my_d = Word.query.filter_by(language=source)
    d = [
        Hashabledict(
            source=(word.text,),
            target=word.translated.filter_by(language=target).first().text,
        )
        for word in my_d
        if word.translated.filter_by(language=target).first()]

    q = w+d
    a = list(filter(lambda el: el["source"] and el["target"], set(q)))

    return jsonify(words=a)


@app.route("/words")
def words():
    return render_template('questionnaire/question.html')


