"""empty message

Revision ID: 09a2461dda83
Revises: None
Create Date: 2016-03-13 09:51:24.068992

"""

# revision identifiers, used by Alembic.
revision = '09a2461dda83'
down_revision = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.Unicode(), nullable=False),
    sa.Column('nick_name', sa.Unicode(), nullable=True),
    sa.Column('first_name', sa.Unicode(), nullable=True),
    sa.Column('last_name', sa.Unicode(), nullable=True),
    sa.Column('auth_data', sa.Unicode(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('word',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('status', sa.Integer(), nullable=True),
    sa.Column('language', sa.Unicode(length=80), nullable=True),
    sa.Column('text', sa.Unicode(length=80), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('progress_status', sa.Integer(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=False),
    sa.Column('date_is_available_after', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('translation',
    sa.Column('word_id', sa.Integer(), nullable=True),
    sa.Column('translated_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['translated_id'], ['word.id'], ),
    sa.ForeignKeyConstraint(['word_id'], ['word.id'], )
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('translation')
    op.drop_table('word')
    op.drop_table('user')
    ### end Alembic commands ###
