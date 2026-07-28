"""create project_employees table

Revision ID: ee49e4f8b067
Revises: c9ef93aa8c4b
Create Date: 2026-07-28 13:11:26.309317

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ee49e4f8b067'
down_revision: Union[str, Sequence[str], None] = 'c9ef93aa8c4b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
