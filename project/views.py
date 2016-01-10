from flask import jsonify, render_template

from project import app, bl
from project.extensions import db
from project.forms import WordForm, EditWordForm, DeleteWordForm
from project.models import Word
from project.utils import Hashabledict


@app.route('/list')
def word_list():
    words = Word.query.order_by(Word.id.desc())
    dicted_words = [{
                        "id": word.id,
                        "text": word.text,
                        "language": word.language,
                        "translate": tuple(map(lambda w: w.text, word.translate))
                    } for word in words]
    return jsonify(words=dicted_words)


@app.route('/', methods=['GET', 'POST'])
def hello_world():
    word_form = WordForm(prefix="word")
    translate_form = WordForm(prefix="translate")
    if word_form.validate_on_submit() and translate_form.validate_on_submit():
        translated_word = Word.query.filter_by(
            language=word_form.language.data,
            text=word_form.word.data
        ).first() or Word(language=word_form.language.data, text=word_form.word.data)

        translate = Word.query.filter_by(
            language=translate_form.language.data,
            text=translate_form.word.data
        ).first() or Word(language=translate_form.language.data, text=translate_form.word.data)

        translated_word.translate.append(translate)
        db.session.add(translated_word)
        db.session.add(translate)
        db.session.commit()

        word_form.word.data, translate_form.word.data = "", ""

    words = Word.query.order_by(Word.id.desc()).all()
    return render_template('post.html', word_form=word_form, translate_form=translate_form, words=words)


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
    print("a: " +str(a))

    return jsonify(words=a)


@app.route("/words")
def words():
    return render_template('question.html')


@app.route("/edit/", methods=["POST"])
def editword():
    form = EditWordForm()
    if form.validate_on_submit():
        bl.edit_word_text(form.target_id.data, form.text.data)
        return jsonify(status="OK")
    return jsonify(status="not OK", errors=form.errors)


@app.route("/delete/", methods=["POST"])
def deleteword():
    form = DeleteWordForm()
    if form.validate_on_submit():
        bl.delete_word(form.target_id.data)
        return jsonify(status="OK")
    return jsonify(status="not OK", errors=form.errors)
