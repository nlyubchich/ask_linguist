from sqlalchemy import select

from hiku.expr import S, define
from hiku.graph import Graph, Edge, Link
from hiku.types import StringType, IntegerType
from hiku.sources import sqlalchemy as sa
from hiku.sources.graph import SubGraph, Expr
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


def all_phrases():
    # with app.app_context():
    rows = db.session.execute(select([Phrase.__table__.c.id])).fetchall()
    # rows = db.session.query(Phrase.id).all()
    return [r.id for r in rows]


sg_phrase = SubGraph(_GRAPH, 'phrase')

GRAPH = Graph([
    Edge('phrase', [
        Expr('phraseId', sg_phrase, IntegerType, S.this.id),
        Expr('sourceLanguage', sg_phrase, StringType, S.this.source_language),
        Expr('sourceText', sg_phrase, StringType, S.this.source_text),
        Expr('translatedLanguage', sg_phrase, StringType,
             S.this.translated_language),
        Expr('translatedText', sg_phrase, StringType, S.this.translated_text),
        Expr('dateCreated', sg_phrase, StringType, str_datetime(S.this.date_created)),
        Expr('dateAvailable', sg_phrase, StringType, str_datetime(S.this.date_available)),
        Expr('progressStatus', sg_phrase, IntegerType, get_progress_percent(S.this.progress_status)),
    ]),
    Link('phrases', all_phrases, edge='phrase', requires=None, to_list=True),
])
