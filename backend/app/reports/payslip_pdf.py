from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


class PayslipPDF:

    @staticmethod
    def generate(payroll: dict):

        buffer = BytesIO()

        document = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=15 * mm,
            leftMargin=15 * mm,
            topMargin=15 * mm,
            bottomMargin=15 * mm,
        )

        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            "TitleStyle",
            parent=styles["Title"],
            alignment=TA_CENTER,
            fontSize=20,
            spaceAfter=5,
        )

        subtitle_style = ParagraphStyle(
            "SubtitleStyle",
            parent=styles["Normal"],
            alignment=TA_CENTER,
            fontSize=10,
            spaceAfter=15,
        )

        right_style = ParagraphStyle(
            "RightStyle",
            parent=styles["Normal"],
            alignment=TA_RIGHT,
        )

        story = []

        # ==========================================
        # HEADER
        # ==========================================

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

        # ==========================================
        # EMPLOYEE INFORMATION
        # ==========================================

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
                str(payroll["total_working_days"]),
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
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                    ("BACKGROUND", (0, 0), (0, -1), colors.lightgrey),
                    ("BACKGROUND", (2, 0), (2, -1), colors.lightgrey),
                    ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                    ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("PADDING", (0, 0), (-1, -1), 7),
                ]
            )
        )

        story.append(employee_table)

        story.append(Spacer(1, 10))

        # ==========================================
        # ATTENDANCE
        # ==========================================

        story.append(
            Paragraph(
                "Attendance Summary",
                styles["Heading2"],
            )
        )

        attendance_data = [
            ["Description", "Days"],
            ["Present Days", str(payroll["present_days"])],
            ["Half Days", str(payroll["half_days"])],
            ["Absent Days", str(payroll["absent_days"])],
            ["Leave Days", str(payroll["leave_days"])],
            ["Paid Days", str(payroll["paid_days"])],
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
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                    ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("ALIGN", (1, 1), (1, -1), "RIGHT"),
                    ("PADDING", (0, 0), (-1, -1), 6),
                ]
            )
        )

        story.append(attendance_table)

        story.append(Spacer(1, 10))

        # ==========================================
        # SALARY DETAILS
        # ==========================================

        story.append(
            Paragraph(
                "Salary Details",
                styles["Heading2"],
            )
        )

        earnings_data = [
            ["Earnings", "Amount"],
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
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                    ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
                    ("ALIGN", (1, 1), (1, -1), "RIGHT"),
                    ("PADDING", (0, 0), (-1, -1), 6),
                ]
            )
        )

        story.append(earnings_table)

        story.append(Spacer(1, 10))

        # ==========================================
        # DEDUCTIONS
        # ==========================================

        story.append(
            Paragraph(
                "Deductions",
                styles["Heading2"],
            )
        )

        deductions_data = [
            ["Deduction", "Amount"],
            [
                "Provident Fund (PF)",
                f'₹{payroll["pf"]:,.2f}',
            ],
            [
                "Professional Tax",
                f'₹{payroll["professional_tax"]:,.2f}',
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
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                    ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
                    ("ALIGN", (1, 1), (1, -1), "RIGHT"),
                    ("PADDING", (0, 0), (-1, -1), 6),
                ]
            )
        )

        story.append(deductions_table)

        story.append(Spacer(1, 15))

        # ==========================================
        # NET SALARY
        # ==========================================

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
                    ("GRID", (0, 0), (-1, -1), 1, colors.black),
                    ("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"),
                    ("FONTSIZE", (0, 0), (-1, -1), 14),
                    ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                    ("PADDING", (0, 0), (-1, -1), 10),
                ]
            )
        )

        story.append(net_salary_table)

        story.append(Spacer(1, 20))

        story.append(
            Paragraph(
                "This is a computer-generated salary slip.",
                subtitle_style,
            )
        )

        # ==========================================
        # BUILD PDF
        # ==========================================

        document.build(story)

        buffer.seek(0)

        return buffer