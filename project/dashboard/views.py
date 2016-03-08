from flask import jsonify, render_template

from project.blueprints import dashboard_app as app
from project.extensions import db
from project.models import Word
from project import bl
from .forms import WordForm, EditWordForm, DeleteWordForm


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
    return render_template('dashboard/post.html', word_form=word_form, translate_form=translate_form)


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
