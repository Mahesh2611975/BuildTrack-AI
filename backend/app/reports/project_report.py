from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


def generate_project_report(project):

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )

    styles = getSampleStyleSheet()

    story = []

    # =====================================================
    # HEADER
    # =====================================================

    story.append(
        Paragraph(
            "<b>BuildTrack AI</b>",
            styles["Title"],
        )
    )

    story.append(
        Spacer(1, 8)
    )

    story.append(
        Paragraph(
            "Project Report",
            styles["Heading2"],
        )
    )

    story.append(
        Spacer(1, 15)
    )

    # =====================================================
    # PROJECT INFORMATION
    # =====================================================

    project_data = [

        [
            Paragraph(
                "<b>Project ID</b>",
                styles["BodyText"],
            ),
            str(project.project_id),
        ],

        [
            Paragraph(
                "<b>Project Name</b>",
                styles["BodyText"],
            ),
            str(project.project_name),
        ],

        [
            Paragraph(
                "<b>Client Name</b>",
                styles["BodyText"],
            ),
            str(project.client_name),
        ],

        [
            Paragraph(
                "<b>Location</b>",
                styles["BodyText"],
            ),
            str(project.location),
        ],

        [
            Paragraph(
                "<b>Description</b>",
                styles["BodyText"],
            ),
            str(
                project.description
                if project.description
                else "N/A"
            ),
        ],

        [
            Paragraph(
                "<b>Start Date</b>",
                styles["BodyText"],
            ),
            str(project.start_date),
        ],

        [
            Paragraph(
                "<b>Expected End Date</b>",
                styles["BodyText"],
            ),
            str(project.expected_end_date),
        ],

        [
            Paragraph(
                "<b>Budget</b>",
                styles["BodyText"],
            ),
            f"₹{project.budget:,.2f}",
        ],

        [
            Paragraph(
                "<b>Status</b>",
                styles["BodyText"],
            ),
            str(project.status),
        ],

        [
            Paragraph(
                "<b>Contractor ID</b>",
                styles["BodyText"],
            ),
            str(project.contractor_id),
        ],

        [
            Paragraph(
                "<b>Created At</b>",
                styles["BodyText"],
            ),
            str(
                project.created_at
                if project.created_at
                else "N/A"
            ),
        ],
    ]

    # =====================================================
    # PROJECT TABLE
    # =====================================================

    table = Table(
        project_data,
        colWidths=[
            55 * mm,
            105 * mm,
        ],
    )

    table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (0, -1),
                    colors.lightgrey,
                ),

                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey,
                ),

                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "TOP",
                ),

                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),

                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),

                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),

                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
            ]
        )
    )

    story.append(table)

    story.append(
        Spacer(1, 20)
    )

    # =====================================================
    # FOOTER
    # =====================================================

    story.append(
        Paragraph(
            "Generated by BuildTrack AI",
            styles["BodyText"],
        )
    )

    # =====================================================
    # BUILD PDF
    # =====================================================

    doc.build(story)

    buffer.seek(0)

    return buffer