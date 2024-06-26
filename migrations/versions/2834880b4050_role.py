"""role

Revision ID: 2834880b4050
Revises: 9723bf5c746d
Create Date: 2023-01-21 19:00:08.412526

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2834880b4050'
down_revision = '9723bf5c746d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('role', sa.String(length=100), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('role')

    # ### end Alembic commands ###
