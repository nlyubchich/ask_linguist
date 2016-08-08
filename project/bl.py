from datetime import datetime
from typing import Optional, List
from flask import session
from sqlalchemy.orm import Query
from sqlalchemy.sql.expression import func, distinct

from project.extensions import redis_store\
    # , cache
from project.models import Phrase, db, User
from project.oauth import google

PHRASE_REDIS_KEY_TEMPLATE = "{user_id}-{language}"
# GET_USER_LANGUAGES_TIMEOUT = 10


def questionnaire_done(user_id: int, language: str) -> List[Phrase]:
    redis_key = PHRASE_REDIS_KEY_TEMPLATE.format(
        user_id=user_id,
        language=language,
    )
    ids = redis_store.lrange(
        redis_key,
        0, -1
    )
    ids = map(int, ids)
    if not ids:
        return []

    phrases = Phrase.query.filter(Phrase.id.in_(ids))

    statuses = [ps.value for ps in Phrase.ProgressStatus]  # type: ignore
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


def mark_available_phrases(
        user_id: int, language: str,
        limit: int) -> List[int]:
    phrases = db.session.query(
        Phrase.id
    ).filter(
        Phrase.user_id == user_id,
        Phrase.language == language,
        Phrase.status == Phrase.Status.visible.value,
        Phrase.date_available < datetime.now(),
        Phrase.progress_status < Phrase.ProgressStatus.after_two_week.value,
    ).order_by(
        func.random()
    ).limit(limit)
    phrase_ids = [phrase.id for phrase in phrases]

    if not phrase_ids:
        return []

    redis_store.lpush(
        PHRASE_REDIS_KEY_TEMPLATE.format(
            user_id=user_id,
            language=language,
        ),
        *phrase_ids
    )
    return phrase_ids


def create_phrase(user_id: int, language: str,
                  source_text: str, translated_text: str) -> Phrase:
    phrase = Phrase()
    phrase.user_id = user_id
    phrase.language = language
    phrase.source_text = source_text
    phrase.translated_text = translated_text
    return phrase


def get_phrases_by_user(user_id: int, language: str) -> Query:
    query = (
        db.session.query(
            Phrase
        )
        .filter(
            Phrase.user_id == user_id,
            Phrase.status == Phrase.Status.visible.value,
            Phrase.language == language
        )
    )
    return query


def delete_phrase(user_id: int, phrase_id: int) -> Optional[Phrase]:
    phrase = Phrase.query.filter(
        Phrase.id == phrase_id,
        Phrase.user_id == user_id,
    ).first()

    if phrase:
        phrase.status = Phrase.Status.deleted.value

    return phrase


def edit_phrase(user_id: int, phrase_id: int,
                source_text: str, translated_text: str) -> Optional[Phrase]:
    phrase = Phrase.query.filter(
        Phrase.id == phrase_id,
        Phrase.user_id == user_id,
    ).first()

    if phrase:
        phrase.source_text = source_text
        phrase.translated_text = translated_text

    return phrase


def create_user(email: str, nick_name: str,
                first_name: str, last_name: str, register_type: int) -> User:
    user = User()
    user.email = email
    user.nick_name = nick_name
    user.first_name = first_name
    user.last_name = last_name
    user.register_type = register_type
    return user


def load_user(user_email: str) -> Optional[User]:
    return User.query.filter_by(email=user_email).first()


@google.tokengetter
def get_google_oauth_token() -> str:
    return session.get('google_token')


# @cache.memoize(timeout=GET_USER_LANGUAGES_TIMEOUT)
def get_user_languages(user_id):
    return ([
        p for p, in (
            db.session.query(distinct(Phrase.language))
            .filter(
                Phrase.user_id == user_id,
                Phrase.status == Phrase.Status.visible.value,
            )
        )
    ])
