from project.models import Word, WordStatus, db


def delete_word(word_id):
    word = Word.query.get(word_id)
    word.status = WordStatus.deleted.value
    db.session.commit()
