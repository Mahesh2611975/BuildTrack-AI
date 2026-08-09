from io import BytesIO

from calendar import month_name

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


def generate_attendance_report(
    employee,
    attendance,
    year,
    month,
    total_days,
):

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
            "Attendance Report",
            styles["Heading2"],
        )
    )

    story.append(
        Spacer(1, 15)
    )

    # =====================================================
    # EMPLOYEE INFORMATION
    # =====================================================

    employee_data = [

        [
            Paragraph(
                "<b>Employee ID</b>",
                styles["BodyText"],
            ),
            str(employee.employee_id),
        ],

        [
            Paragraph(
                "<b>Employee Name</b>",
                styles["BodyText"],
            ),
            str(employee.full_name),
        ],

        [
            Paragraph(
                "<b>Department</b>",
                styles["BodyText"],
            ),
            str(
                employee.department
                if employee.department
                else "N/A"
            ),
        ],

        [
            Paragraph(
                "<b>Designation</b>",
                styles["BodyText"],
            ),
            str(
                employee.designation
                if employee.designation
                else "N/A"
            ),
        ],

        [
            Paragraph(
                "<b>Payroll Month</b>",
                styles["BodyText"],
            ),
            f"{month_name[month]} {year}",
        ],
    ]

    employee_table = Table(
        employee_data,
        colWidths=[
            55 * mm,
            105 * mm,
        ],
    )

    employee_table.setStyle(
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

    story.append(employee_table)

    story.append(
        Spacer(1, 20)
    )

    # =====================================================
    # ATTENDANCE SUMMARY
    # =====================================================

    story.append(
        Paragraph(
            "Attendance Summary",
            styles["Heading3"],
        )
    )

    story.append(
        Spacer(1, 10)
    )

    present_days = attendance["present_days"]
    half_days = attendance["half_days"]
    absent_days = attendance["absent_days"]
    leave_days = attendance["leave_days"]

    paid_days = (
        present_days
        + (half_days * 0.5)
        + leave_days
    )

    attendance_data = [

        [
            Paragraph(
                "<b>Attendance Type</b>",
                styles["BodyText"],
            ),
            Paragraph(
                "<b>Days</b>",
                styles["BodyText"],
            ),
        ],

        [
            "Total Days",
            str(total_days),
        ],

        [
            "Present Days",
            str(present_days),
        ],

        [
            "Half Days",
            str(half_days),
        ],

        [
            "Absent Days",
            str(absent_days),
        ],

        [
            "Leave Days",
            str(leave_days),
        ],

        [
            "Paid Days",
            f"{paid_days:.1f}",
        ],
    ]

    attendance_table = Table(
        attendance_data,
        colWidths=[
            110 * mm,
            50 * mm,
        ],
    )

    attendance_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
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
                    "ALIGN",
                    (1, 0),
                    (1, -1),
                    "CENTER",
                ),

                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
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

    story.append(attendance_table)

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