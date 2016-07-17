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


phrases_query = sa.FieldsQuery(db.session, Phrase.__table__)

_GRAPH = Graph([
    Edge('phrase', [
        sa.Field('id', phrases_query),
        sa.Field('source_language', phrases_query),
        sa.Field('source_text', phrases_query),
        sa.Field('translated_language', phrases_query),
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
    user_id = current_user.id

    query = (
        select([Phrase.__table__.c.id])
        .where(and_(
            Phrase.__table__.c.user_id == user_id,
            Phrase.__table__.c.status == Phrase.Status.visible.value,
        ))
    )
    rows = db.session.execute(query).fetchall()
    return [r.id for r in rows]


def generate_phrases_for_practice(kwargs):
    limit = kwargs.get('limit')
    user = kwargs.get('user')
    assert user == 'me', "Phrase fetching supported " \
                         "only for current user's phrases"
    user_id = current_user.id

    source_language = kwargs.get('source_language')
    translated_language = kwargs.get('translated_language')

    phrase_ids = redis_store.lrange(
        PHRASE_REDIS_KEY_TEMPLATE.format(
            user_id=user_id,
            # FIXME: source and translated? WAT?
            source_language=translated_language,
            translated_language=source_language,
        ), 0, -1
    )
    phrase_ids = [int(phrase_id) for phrase_id in phrase_ids]

    print()
    print()
    print()
    print()
    print(phrase_ids)
    print()
    print()
    print()
    print()
    if not phrase_ids:
        phrase_ids = mark_available_phrases(
            user_id, source_language, translated_language, limit)
    print(phrase_ids)
    return phrase_ids


sg_phrase = SubGraph(_GRAPH, 'phrase')

GRAPH = Graph([
    Edge('phrase', [
        Expr('phraseId', sg_phrase, IntegerType, S.this.id),
        Expr('sourceLanguage', sg_phrase, StringType, S.this.source_language),
        Expr('sourceText', sg_phrase, StringType, S.this.source_text),
        Expr('translatedLanguage', sg_phrase, StringType,
             S.this.translated_language),
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
        options=[Option('user', default='me')]
    ),
    Link(
        'phrases-for-test', generate_phrases_for_practice,
        edge='phrase', requires=None, to_list=True,
        options=[
            Option('user', default='me'),
            Option('limit', IntegerType, default=50),
            Option('source_language', StringType, default='English'),
            Option('translated_language', StringType, default='French'),
        ]
    ),
])
