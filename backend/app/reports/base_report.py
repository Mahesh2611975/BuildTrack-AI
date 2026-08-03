from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


styles = getSampleStyleSheet()


def report_title(title: str):
    style = styles["Title"]
    style.alignment = TA_CENTER

    return Paragraph(
        f"<b>BuildTrack AI</b><br/>{title}",
        style,
    )


def report_subtitle(text: str):
    style = styles["Heading2"]
    style.alignment = TA_CENTER

    return Paragraph(text, style)


def info_table(data):

    table = Table(
        data,
        colWidths=[150, 300],
    )

    table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
                ("BACKGROUND", (0, 0), (0, -1), colors.lightgrey),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )

    return table


def space():
    return Spacer(1, 15)