from flask import Flask, render_template, jsonify
from flask.ext.heroku import Heroku

from forms import WordForm
from models import Word, db

# stream_handler = logging.StreamHandler()

app = Flask(__name__)
# app.logger.addHandler(stream_handler)
# app.logger.setLevel(logging.INFO)
# app.logger.info('ask-linguist startup')

app.secret_key = "really secret"
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
heroku = Heroku(app)
app.config["DEBUG"] = True
db.init_app(app)


# with app.app_context():
#     db.create_all()
#

class Hashabledict(dict):
    def __key(self):
        return tuple((k, self[k]) for k in sorted(self))
    def __hash__(self):
        return hash(self.__key())
    def __eq__(self, other):
        return self.__key() == other.__key()


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


if __name__ == '__main__':
    app.run(debug=True)
