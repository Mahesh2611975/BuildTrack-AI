from io import BytesIO
import os

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import (
    getSampleStyleSheet,
    ParagraphStyle,
)
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.units import mm

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


# ==========================================================
# UNICODE FONT SETUP
# ==========================================================

def register_unicode_fonts():

    # ------------------------------------------------------
    # Try DejaVu Sans from matplotlib
    # ------------------------------------------------------

    try:

        from matplotlib.font_manager import findfont

        regular_font = findfont("DejaVu Sans")
        bold_font = findfont("DejaVu Sans:bold")

        if os.path.exists(regular_font):

            pdfmetrics.registerFont(
                TTFont(
                    "BuildTrackUnicode",
                    regular_font,
                )
            )

            if os.path.exists(bold_font):

                pdfmetrics.registerFont(
                    TTFont(
                        "BuildTrackUnicodeBold",
                        bold_font,
                    )
                )

            else:

                pdfmetrics.registerFont(
                    TTFont(
                        "BuildTrackUnicodeBold",
                        regular_font,
                    )
                )

            return (
                "BuildTrackUnicode",
                "BuildTrackUnicodeBold",
            )

    except Exception:
        pass


    # ------------------------------------------------------
    # Windows Arial fallback
    # ------------------------------------------------------

    windows_regular = (
        r"C:\Windows\Fonts\arial.ttf"
    )

    windows_bold = (
        r"C:\Windows\Fonts\arialbd.ttf"
    )


    if os.path.exists(windows_regular):

        pdfmetrics.registerFont(
            TTFont(
                "BuildTrackArial",
                windows_regular,
            )
        )

        if os.path.exists(windows_bold):

            pdfmetrics.registerFont(
                TTFont(
                    "BuildTrackArialBold",
                    windows_bold,
                )
            )

        else:

            pdfmetrics.registerFont(
                TTFont(
                    "BuildTrackArialBold",
                    windows_regular,
                )
            )

        return (
            "BuildTrackArial",
            "BuildTrackArialBold",
        )


    # ------------------------------------------------------
    # If no Unicode font found
    # ------------------------------------------------------

    raise RuntimeError(
        "No Unicode font found. "
        "Please install DejaVu Sans or Arial."
    )


UNICODE_FONT, UNICODE_BOLD = (
    register_unicode_fonts()
)


# ==========================================================
# PAYSLIP PDF
# ==========================================================

class PayslipPDF:

    @staticmethod
    def generate(payroll: dict):

        buffer = BytesIO()

        # ==================================================
        # DOCUMENT
        # ==================================================

        document = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=15 * mm,
            leftMargin=15 * mm,
            topMargin=15 * mm,
            bottomMargin=15 * mm,
        )

        styles = getSampleStyleSheet()

        # ==================================================
        # STYLES
        # ==================================================

        title_style = ParagraphStyle(
            "TitleStyle",
            parent=styles["Title"],
            fontName=UNICODE_BOLD,
            alignment=TA_CENTER,
            fontSize=20,
            spaceAfter=5,
        )

        subtitle_style = ParagraphStyle(
            "SubtitleStyle",
            parent=styles["Normal"],
            fontName=UNICODE_FONT,
            alignment=TA_CENTER,
            fontSize=10,
            spaceAfter=15,
        )

        heading_style = ParagraphStyle(
            "HeadingStyle",
            parent=styles["Heading2"],
            fontName=UNICODE_BOLD,
            fontSize=14,
            spaceBefore=5,
            spaceAfter=7,
        )

        right_style = ParagraphStyle(
            "RightStyle",
            parent=styles["Normal"],
            fontName=UNICODE_FONT,
            alignment=TA_RIGHT,
        )

        story = []

        # ==================================================
        # HEADER
        # ==================================================

        story.append(
            Paragraph(
                "BUILDTRACK AI",
                title_style,
            )
        )

        story.append(
            Paragraph(
                "Employee Salary Slip",
                subtitle_style,
            )
        )

        # ==================================================
        # EMPLOYEE INFORMATION
        # ==================================================

        employee_data = [
            [
                "Employee Name",
                payroll["employee_name"],
                "Employee ID",
                payroll["employee_id"],
            ],
            [
                "Payroll Month",
                f'{payroll["month"]}/{payroll["year"]}',
                "Working Days",
                str(
                    payroll["total_working_days"]
                ),
            ],
        ]

        employee_table = Table(
            employee_data,
            colWidths=[
                35 * mm,
                55 * mm,
                35 * mm,
                55 * mm,
            ],
        )

        employee_table.setStyle(
            TableStyle(
                [
                    (
                        "GRID",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        colors.grey,
                    ),
                    (
                        "BACKGROUND",
                        (0, 0),
                        (0, -1),
                        colors.lightgrey,
                    ),
                    (
                        "BACKGROUND",
                        (2, 0),
                        (2, -1),
                        colors.lightgrey,
                    ),
                    (
                        "FONTNAME",
                        (0, 0),
                        (-1, -1),
                        UNICODE_FONT,
                    ),
                    (
                        "FONTNAME",
                        (0, 0),
                        (0, -1),
                        UNICODE_BOLD,
                    ),
                    (
                        "FONTNAME",
                        (2, 0),
                        (2, -1),
                        UNICODE_BOLD,
                    ),
                    (
                        "VALIGN",
                        (0, 0),
                        (-1, -1),
                        "MIDDLE",
                    ),
                    (
                        "PADDING",
                        (0, 0),
                        (-1, -1),
                        7,
                    ),
                ]
            )
        )

        story.append(employee_table)

        story.append(
            Spacer(1, 10)
        )

        # ==================================================
        # ATTENDANCE
        # ==================================================

        story.append(
            Paragraph(
                "Attendance Summary",
                heading_style,
            )
        )

        attendance_data = [
            [
                "Description",
                "Days",
            ],
            [
                "Present Days",
                str(
                    payroll["present_days"]
                ),
            ],
            [
                "Half Days",
                str(
                    payroll["half_days"]
                ),
            ],
            [
                "Absent Days",
                str(
                    payroll["absent_days"]
                ),
            ],
            [
                "Leave Days",
                str(
                    payroll["leave_days"]
                ),
            ],
            [
                "Paid Days",
                str(
                    payroll["paid_days"]
                ),
            ],
        ]

        attendance_table = Table(
            attendance_data,
            colWidths=[
                100 * mm,
                80 * mm,
            ],
        )

        attendance_table.setStyle(
            TableStyle(
                [
                    (
                        "GRID",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        colors.grey,
                    ),
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, 0),
                        colors.lightgrey,
                    ),
                    (
                        "FONTNAME",
                        (0, 0),
                        (-1, -1),
                        UNICODE_FONT,
                    ),
                    (
                        "FONTNAME",
                        (0, 0),
                        (-1, 0),
                        UNICODE_BOLD,
                    ),
                    (
                        "ALIGN",
                        (1, 1),
                        (1, -1),
                        "RIGHT",
                    ),
                    (
                        "PADDING",
                        (0, 0),
                        (-1, -1),
                        6,
                    ),
                ]
            )
        )

        story.append(
            attendance_table
        )

        story.append(
            Spacer(1, 10)
        )

        # ==================================================
        # SALARY DETAILS
        # ==================================================

        story.append(
            Paragraph(
                "Salary Details",
                heading_style,
            )
        )

        earnings_data = [
            [
                "Earnings",
                "Amount",
            ],
            [
                "Basic Salary",
                f'₹{payroll["basic_salary"]:,.2f}',
            ],
            [
                "HRA",
                f'₹{payroll["hra"]:,.2f}',
            ],
            [
                "Allowance",
                f'₹{payroll["allowance"]:,.2f}',
            ],
            [
                "Gross Salary",
                f'₹{payroll["gross_salary"]:,.2f}',
            ],
            [
                "Daily Salary",
                f'₹{payroll["daily_salary"]:,.2f}',
            ],
            [
                "Earned Salary",
                f'₹{payroll["earned_salary"]:,.2f}',
            ],
        ]

        earnings_table = Table(
            earnings_data,
            colWidths=[
                100 * mm,
                80 * mm,
            ],
        )

        earnings_table.setStyle(
            TableStyle(
                [
                    (
                        "GRID",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        colors.grey,
                    ),
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, 0),
                        colors.lightgrey,
                    ),
                    (
                        "FONTNAME",
                        (0, 0),
                        (-1, -1),
                        UNICODE_FONT,
                    ),
                    (
                        "FONTNAME",
                        (0, 0),
                        (-1, 0),
                        UNICODE_BOLD,
                    ),
                    (
                        "FONTNAME",
                        (0, -1),
                        (-1, -1),
                        UNICODE_BOLD,
                    ),
                    (
                        "ALIGN",
                        (1, 1),
                        (1, -1),
                        "RIGHT",
                    ),
                    (
                        "PADDING",
                        (0, 0),
                        (-1, -1),
                        6,
                    ),
                ]
            )
        )

        story.append(
            earnings_table
        )

        story.append(
            Spacer(1, 10)
        )

        # ==================================================
        # DEDUCTIONS
        # ==================================================

        story.append(
            Paragraph(
                "Deductions",
                heading_style,
            )
        )

        # --------------------------------------------------
        # SAFE ADVANCE VALUES
        # --------------------------------------------------

        advance_deduction = float(
            payroll.get(
                "advance_deduction",
                0,
            )
            or 0
        )

        advance_taken = float(
            payroll.get(
                "advance_taken",
                0,
            )
            or 0
        )

        deductions_data = [
            [
                "Deduction",
                "Amount",
            ],
            [
                "Provident Fund (PF)",
                f'₹{payroll["pf"]:,.2f}',
            ],
            [
                "Professional Tax",
                f'₹{payroll["professional_tax"]:,.2f}',
            ],
            [
                "Daily Advance",
                f'₹{advance_deduction:,.2f}',
            ],
            [
                "Total Deductions",
                f'₹{payroll["total_deductions"]:,.2f}',
            ],
        ]

        deductions_table = Table(
            deductions_data,
            colWidths=[
                100 * mm,
                80 * mm,
            ],
        )

        deductions_table.setStyle(
            TableStyle(
                [
                    (
                        "GRID",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        colors.grey,
                    ),
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, 0),
                        colors.lightgrey,
                    ),
                    (
                        "FONTNAME",
                        (0, 0),
                        (-1, -1),
                        UNICODE_FONT,
                    ),
                    (
                        "FONTNAME",
                        (0, 0),
                        (-1, 0),
                        UNICODE_BOLD,
                    ),
                    (
                        "FONTNAME",
                        (0, -1),
                        (-1, -1),
                        UNICODE_BOLD,
                    ),
                    (
                        "ALIGN",
                        (1, 1),
                        (1, -1),
                        "RIGHT",
                    ),
                    (
                        "PADDING",
                        (0, 0),
                        (-1, -1),
                        6,
                    ),
                ]
            )
        )

        story.append(
            deductions_table
        )

        story.append(
            Spacer(1, 10)
        )

        # ==================================================
        # ADVANCE INFORMATION
        # ==================================================

        story.append(
            Paragraph(
                "Advance Information",
                heading_style,
            )
        )

        main_advance_amount = float(
            payroll.get(
                "main_advance_amount",
                0,
            )
            or 0
        )

        advance_remaining = float(
            payroll.get(
                "advance_remaining",
                0,
            )
            or 0
        )

        advance_data = [
            [
                "Advance Details",
                "Amount",
            ],
            [
                "Main Advance",
                f'₹{main_advance_amount:,.2f}',
            ],
            [
                "Daily Advances Taken",
                f'₹{advance_taken:,.2f}',
            ],
            [
                "Daily Advance Deducted",
                f'₹{advance_deduction:,.2f}',
            ],
            [
                "Main Advance Remaining",
                f'₹{advance_remaining:,.2f}',
            ],
        ]

        advance_table = Table(
            advance_data,
            colWidths=[
                100 * mm,
                80 * mm,
            ],
        )

        advance_table.setStyle(
            TableStyle(
                [
                    (
                        "GRID",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        colors.grey,
                    ),
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, 0),
                        colors.lightgrey,
                    ),
                    (
                        "FONTNAME",
                        (0, 0),
                        (-1, -1),
                        UNICODE_FONT,
                    ),
                    (
                        "FONTNAME",
                        (0, 0),
                        (-1, 0),
                        UNICODE_BOLD,
                    ),
                    (
                        "FONTNAME",
                        (0, 1),
                        (0, -1),
                        UNICODE_BOLD,
                    ),
                    (
                        "ALIGN",
                        (1, 1),
                        (1, -1),
                        "RIGHT",
                    ),
                    (
                        "PADDING",
                        (0, 0),
                        (-1, -1),
                        6,
                    ),
                ]
            )
        )

        story.append(
            advance_table
        )

        story.append(
            Spacer(1, 15)
        )

        # ==================================================
        # NET SALARY
        # ==================================================

        net_salary_data = [
            [
                "NET SALARY",
                f'₹{payroll["net_salary"]:,.2f}',
            ]
        ]

        net_salary_table = Table(
            net_salary_data,
            colWidths=[
                100 * mm,
                80 * mm,
            ],
        )

        net_salary_table.setStyle(
            TableStyle(
                [
                    (
                        "GRID",
                        (0, 0),
                        (-1, -1),
                        1,
                        colors.black,
                    ),
                    (
                        "FONTNAME",
                        (0, 0),
                        (-1, -1),
                        UNICODE_BOLD,
                    ),
                    (
                        "FONTSIZE",
                        (0, 0),
                        (-1, -1),
                        14,
                    ),
                    (
                        "ALIGN",
                        (1, 0),
                        (1, 0),
                        "RIGHT",
                    ),
                    (
                        "PADDING",
                        (0, 0),
                        (-1, -1),
                        10,
                    ),
                ]
            )
        )

        story.append(
            net_salary_table
        )

        story.append(
            Spacer(1, 20)
        )

        # ==================================================
        # FOOTER
        # ==================================================

        story.append(
            Paragraph(
                "This is a computer-generated salary slip.",
                subtitle_style,
            )
        )

        # ==================================================
        # BUILD PDF
        # ==================================================

        document.build(story)

        buffer.seek(0)

        return buffer