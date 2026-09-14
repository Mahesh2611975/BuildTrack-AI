"""create advance transactions table

Revision ID: 100c3b148d04
Revises: 5316178d331b
Create Date: 2026-08-26 15:36:30.376829

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# ==========================================================
# REVISION
# ==========================================================

revision: str = "100c3b148d04"

down_revision: Union[
    str,
    Sequence[str],
    None,
] = "5316178d331b"

branch_labels = None
depends_on = None


# ==========================================================
# UPGRADE
# ==========================================================

def upgrade() -> None:

    # ======================================================
    # MAIN EMPLOYEE ADVANCES
    # ======================================================

    op.create_table(
        "advances",

        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "advance_code",
            sa.String(length=20),
            nullable=False,
        ),

        sa.Column(
            "employee_id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "amount",
            sa.Float(),
            nullable=False,
        ),

        sa.Column(
            "remaining_amount",
            sa.Float(),
            nullable=False,
        ),

        sa.Column(
            "advance_date",
            sa.Date(),
            nullable=False,
        ),

        sa.Column(
            "reason",
            sa.String(length=255),
            nullable=True,
        ),

        sa.Column(
            "status",
            sa.String(length=20),
            nullable=False,
        ),

        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),

        sa.ForeignKeyConstraint(
            ["employee_id"],
            ["employees.id"],
            ondelete="CASCADE",
        ),

        sa.PrimaryKeyConstraint("id"),

        sa.UniqueConstraint(
            "advance_code"
        ),
    )

    op.create_index(
        op.f("ix_advances_id"),
        "advances",
        ["id"],
        unique=False,
    )

    # ======================================================
    # ADVANCE TRANSACTIONS / RECOVERIES
    # ======================================================

    op.create_table(
        "advance_transactions",

        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "employee_id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "advance_id",
            sa.Integer(),
            nullable=True,
        ),

        sa.Column(
            "amount",
            sa.Float(),
            nullable=False,
        ),

        sa.Column(
            "transaction_date",
            sa.Date(),
            nullable=False,
        ),

        sa.Column(
            "reason",
            sa.String(length=255),
            nullable=True,
        ),

        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),

        sa.ForeignKeyConstraint(
            ["employee_id"],
            ["employees.id"],
            ondelete="CASCADE",
        ),

        sa.ForeignKeyConstraint(
            ["advance_id"],
            ["advances.id"],
            ondelete="SET NULL",
        ),

        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_advance_transactions_id"),
        "advance_transactions",
        ["id"],
        unique=False,
    )


# ==========================================================
# DOWNGRADE
# ==========================================================

def downgrade() -> None:

    op.drop_index(
        op.f("ix_advance_transactions_id"),
        table_name="advance_transactions",
    )

    op.drop_table(
        "advance_transactions",
    )

    op.drop_index(
        op.f("ix_advances_id"),
        table_name="advances",
    )

    op.drop_table(
        "advances",
    )