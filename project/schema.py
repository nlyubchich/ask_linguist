import graphene
from graphene import relay
from graphene.contrib.sqlalchemy import SQLAlchemyNode, SQLAlchemyConnectionField
from .models import Phrase as PhraseModel, User as UserModel

schema = graphene.Schema()


@schema.register
class Phrase(SQLAlchemyNode):
    class Meta:
        model = PhraseModel


@schema.register
class User(SQLAlchemyNode):
    class Meta:
        model = UserModel


class Query(graphene.ObjectType):
    node = relay.NodeField()
    all_users = SQLAlchemyConnectionField(User)

schema.query = Query
