from flask import Flask, render_template
from forms import WordForm
from models import Word, db
from flask.ext.heroku import Heroku


app = Flask(__name__)
app.secret_key = "really secret"
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
heroku = Heroku(app)

db.init_app(app)

@app.route('/', methods=['GET', 'POST'])
def hello_world():
    word_form = WordForm(prefix="word")
    translate_form = WordForm(prefix="translate")
    if word_form.validate_on_submit() and word_form.validate_on_submit():
        translated_word = Word.query.filter_by(
            language=word_form.language.data.title(),
            text=word_form.word.data.title()
        ).first() or Word(
            language=word_form.language.data.title(),
            text=word_form.word.data.title()
        )

        translate = Word.query.filter_by(
            language=translate_form.language.data.title(),
            text=translate_form.word.data.title()
        ).first() or Word(
            language=translate_form.language.data.title(),
            text=translate_form.word.data.title()
        )

        translated_word.translate.append(translate)
        db.session.add(translated_word)
        db.session.add(translate)
        db.session.commit()

    return render_template('post.html', word_form=word_form, translate_form=translate_form)


if __name__ == '__main__':
    app.run(debug=True)
