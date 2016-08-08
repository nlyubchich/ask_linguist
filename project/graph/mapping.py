from typing import Any, List
from typing import Dict

from flask_login import current_user
from sqlalchemy import and_
from sqlalchemy import select

from hiku.expr import S, define
from hiku.graph import Graph, Edge, Link, Option
from hiku.types import StringType, IntegerType
from hiku.sources import sqlalchemy as sa
from hiku.sources.graph import SubGraph, Expr

from project.bl import mark_available_phrases, PHRASE_REDIS_KEY_TEMPLATE
from project.extensions import redis_store
from project.models import db, Phrase

PHRASES_FOR_QUESTIONNAIRE_LIMIT = 50

phrases_query = sa.FieldsQuery(db.session, Phrase.__table__)

_GRAPH = Graph([
    Edge('phrase', [
        sa.Field('id', phrases_query),
        sa.Field('language', phrases_query),
        sa.Field('source_text', phrases_query),
        sa.Field('translated_text', phrases_query),
        sa.Field('date_created', phrases_query),
        sa.Field('date_available', phrases_query),
        sa.Field('progress_status', phrases_query),
    ]),
])


@define(None)
def str_datetime(datetime):
    return str(datetime)


@define(None)
def get_progress_percent(value):
    return Phrase.ProgressStatus(value).get_progress_percent()


def all_phrases(kwargs):
    user = kwargs.get('user')
    assert user == 'me', "Phrase fetching supported " \
                         "only for current user's phrases"

    language = kwargs.get('language')
    user_id = current_user.id

    query = (
        select([Phrase.__table__.c.id])
        .where(and_(
            Phrase.__table__.c.user_id == user_id,
            Phrase.__table__.c.status == Phrase.Status.visible.value,
            Phrase.__table__.c.language == language,
        ))
        .order_by(Phrase.__table__.c.id.desc())
    )
    rows = db.session.execute(query).fetchall()
    return [r.id for r in rows]


def generate_phrases_for_practice(kwargs: Dict[str, Any]) -> List[int]:
    user = kwargs.get('user')
    assert user == 'me', "Phrase fetching supported " \
                         "only for current user's phrases"
    language = kwargs.get('language')
    limit = kwargs.get('limit')
    user_id = current_user.id

    phrase_ids = redis_store.lrange(
        PHRASE_REDIS_KEY_TEMPLATE.format(
            user_id=user_id,
            language=language,
        ), start=0, end=-1
    )
    phrase_ids = [int(phrase_id) for phrase_id in phrase_ids]

    if not phrase_ids:
        phrase_ids = mark_available_phrases(user_id, language, limit)

    return phrase_ids


sg_phrase = SubGraph(_GRAPH, 'phrase')

GRAPH = Graph([
    Edge('phrase', [
        Expr('phraseId', sg_phrase, IntegerType, S.this.id),
        Expr('language', sg_phrase, StringType,
             S.this.language),
        Expr('sourceText', sg_phrase, StringType, S.this.source_text),
        Expr('translatedText', sg_phrase, StringType, S.this.translated_text),
        Expr(
            'dateCreated',
            sg_phrase, StringType,
            str_datetime(S.this.date_created)
        ),
        Expr(
            'dateAvailable',
            sg_phrase, StringType,
            str_datetime(S.this.date_available)
        ),
        Expr(
            'progressStatus',
            sg_phrase, IntegerType,
            get_progress_percent(S.this.progress_status)
        ),
    ]),
    Link(
        'phrases', all_phrases,
        edge='phrase', requires=None, to_list=True,
        options=[
            Option('user', default='me'),
            Option('language', StringType, default='French'),
        ]
    ),
    Link(
        'phrases-for-test', generate_phrases_for_practice,
        edge='phrase', requires=None, to_list=True,
        options=[
            Option('user', default='me'),
            Option('limit', IntegerType, default=50),
            Option('language', StringType, default='French'),
        ]
    ),
])
