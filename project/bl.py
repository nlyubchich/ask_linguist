from datetime import datetime
from flask.ext.login import current_user
from sqlalchemy.sql.expression import func
from project.extensions import redis_store
from project.models import Phrase, db, User

PHRASE_REDIS_KEY_TEMPLATE = "{user_id}-{source_language}-{translated_language}"

PHRASES_FOR_QUESTIONNAIRE_LIMIT = 50


def questionnaire_done(user_id, source_language, translated_language):
    redis_key = PHRASE_REDIS_KEY_TEMPLATE.format(
        user_id=user_id,
        source_language=source_language,
        translated_language=translated_language,
    )
    ids = redis_store.lrange(
        redis_key,
        0, -1
    )
    ids = map(int, ids)
    if not ids:
        return []

    phrases = Phrase.query.filter(Phrase.id.in_(ids))

    statuses = [ps.value for ps in Phrase.ProgressStatus]
    for phrase in phrases:
        next_statuses = list(
            filter(lambda ns: phrase.progress_status < ns, statuses)
        )
        if not next_statuses:
            phrase.status = Phrase.Status.finished.value
            continue
        phrase.progress_status = next_statuses[0]
        phrase.date_available = (
            datetime.utcnow() +
            Phrase.ProgressStatus(phrase.progress_status).get_progress_delta()
        )

    redis_store.delete(redis_key)
    return phrases


def mark_available_phrases(user_id, source_language, translated_language):
    phrases = db.session.query(
        Phrase.id
    ).filter(
        Phrase.user_id == user_id,
        Phrase.source_language == source_language,
        Phrase.translated_language == translated_language,
        Phrase.status == Phrase.Status.visible.value,
        Phrase.date_available < datetime.now(),
        Phrase.progress_status < Phrase.ProgressStatus.after_two_week.value,
    ).order_by(
        func.random()
    ).limit(PHRASES_FOR_QUESTIONNAIRE_LIMIT)
    phrase_ids = [phrase.id for phrase in phrases]
    if not phrase_ids:
        return []

    redis_store.lpush(
        PHRASE_REDIS_KEY_TEMPLATE.format(
            user_id=user_id,
            source_language=source_language,
            translated_language=translated_language,
        ),
        *phrase_ids
    )
    return phrase_ids


def create_phrase(source_language, source_text,
                  translated_language, translated_text):
    phrase = Phrase()
    phrase.user = current_user
    phrase.source_language = source_language
    phrase.source_text = source_text
    phrase.translated_language = translated_language
    phrase.translated_text = translated_text
    return phrase


def get_phrases_by_user(user_id):
    query = db.session.query(
        Phrase
    ).filter(
        Phrase.user_id == user_id,
        Phrase.status == Phrase.Status.visible.value,
    )
    return query


def delete_phrase(phrase_id):
    word = Phrase.query.get_or_404(phrase_id)
    word.status = Phrase.Status.deleted.value


def edit_phrase(phrase_id, source_language, source_text,
                translated_language, translated_text):
    phrase = Phrase.query.get_or_404(phrase_id)
    phrase.source_language = source_language
    phrase.source_text = source_text
    phrase.translated_language = translated_language
    phrase.translated_text = translated_text
    return phrase


def create_user(email, nick_name, first_name, last_name, register_type):
    user = User()
    user.email = email
    user.nick_name = nick_name
    user.first_name = first_name
    user.last_name = last_name
    user.register_type = register_type
    return user
