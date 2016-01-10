from project.models import Word, WordStatus, db


def delete_word(word_id):
    word = Word.query.get(word_id)
    word.status = WordStatus.deleted.value
    db.session.commit()


def edit_word_text(word_id, text):
    word = Word.query.get_or_404(word_id)
    word.text = text
    db.session.commit()
