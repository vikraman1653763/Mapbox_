"""ChatGPT3-layer delete

Revision ID: 7c6e30eb33e4
Revises: c5972cdb5d47
Create Date: 2023-01-17 21:39:36.476200

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7c6e30eb33e4'
down_revision = 'c5972cdb5d47'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('layer')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('layer',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('layer_name', sa.VARCHAR(length=200), autoincrement=False, nullable=False),
    sa.Column('layer_owner', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('project_no', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['layer_owner'], ['user.id'], name='layer_layer_owner_fkey'),
    sa.PrimaryKeyConstraint('id', name='layer_pkey'),
    sa.UniqueConstraint('layer_name', name='layer_layer_name_key')
    )
    # ### end Alembic commands ###