# backend/app/reports/payslip_pdf.py

from io import BytesIO
from datetime import datetime
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
)
from reportlab.lib.colors import HexColor


class PayslipPDF:
    """
    Generates an employee salary slip PDF.

    Usage:
        pdf = PayslipPDF.generate(payroll)
    """

    # ---------------------------------------------------------
    # FONT SETUP
    # ---------------------------------------------------------

    @staticmethod
    def register_fonts():
        """
        Register a Unicode font so that ₹ and other characters
        render correctly in the PDF.
        """

        registered_fonts = pdfmetrics.getRegisteredFontNames()

        if "DejaVuSans" in registered_fonts:
            return "DejaVuSans", "DejaVuSans-Bold"

        possible_regular_fonts = [
            Path("C:/Windows/Fonts/arial.ttf"),
            Path("C:/Windows/Fonts/ARIAL.TTF"),
            Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
            Path("/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed.ttf"),
        ]

        possible_bold_fonts = [
            Path("C:/Windows/Fonts/arialbd.ttf"),
            Path("C:/Windows/Fonts/ARIALBD.TTF"),
            Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
            Path("/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf"),
        ]

        regular_font_path = next(
            (path for path in possible_regular_fonts if path.exists()),
            None,
        )

        bold_font_path = next(
            (path for path in possible_bold_fonts if path.exists()),
            None,
        )

        if regular_font_path and bold_font_path:
            try:
                pdfmetrics.registerFont(
                    TTFont("PayslipRegular", str(regular_font_path))
                )
                pdfmetrics.registerFont(
                    TTFont("PayslipBold", str(bold_font_path))
                )

                return "PayslipRegular", "PayslipBold"

            except Exception:
                pass

        # Fallback fonts
        return "Helvetica", "Helvetica-Bold"

    # ---------------------------------------------------------
    # HELPER METHODS
    # ---------------------------------------------------------

    @staticmethod
    def safe_number(value, default=0.0):
        """
        Safely convert a value into float.
        """
        try:
            if value is None:
                return float(default)

            return float(value)

        except (TypeError, ValueError):
            return float(default)

    @staticmethod
    def format_currency(value, blank_if_zero=False):
        """
        Format amount as Indian currency.

        Example:
            1433.33 -> ₹1,433.33

        If blank_if_zero=True:
            0 -> ""
        """

        amount = PayslipPDF.safe_number(value)

        if blank_if_zero and amount == 0:
            return ""

        return f"₹{amount:,.2f}"

    @staticmethod
    def format_number(value, decimals=1):
        """
        Format normal numeric values.
        """

        number = PayslipPDF.safe_number(value)

        if decimals == 0:
            return f"{number:,.0f}"

        return f"{number:,.{decimals}f}"

    @staticmethod
    def get_value(payroll, *keys, default=0):
        """
        Get the first available value from payroll dictionary.
        """

        for key in keys:
            if key in payroll and payroll.get(key) is not None:
                return payroll.get(key)

        return default

    @staticmethod
    def paragraph(
        text,
        font_name="Helvetica",
        font_size=8,
        leading=10,
        alignment=TA_LEFT,
        text_color=HexColor("#302820"),
        bold=False,
    ):
        """
        Create a styled Paragraph.
        """

        return Paragraph(
            str(text),
            ParagraphStyle(
                name="CustomParagraph",
                fontName=font_name,
                fontSize=font_size,
                leading=leading,
                alignment=alignment,
                textColor=text_color,
                spaceAfter=0,
                spaceBefore=0,
            ),
        )

    # ---------------------------------------------------------
    # MAIN PDF GENERATOR
    # ---------------------------------------------------------

    @staticmethod
    def generate(payroll):
        """
        Generate payslip PDF in memory.

        Returns:
            BytesIO
        """

        if not payroll:
            raise ValueError("Payroll data is empty")

        regular_font, bold_font = PayslipPDF.register_fonts()

        buffer = BytesIO()

        document = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=14 * mm,
            leftMargin=14 * mm,
            topMargin=12 * mm,
            bottomMargin=12 * mm,
            title="Employee Salary Slip",
            author="BuildTrack AI",
        )

        styles = getSampleStyleSheet()

        # -----------------------------------------------------
        # COLORS
        # -----------------------------------------------------

        dark_brown = HexColor("#302820")
        medium_brown = HexColor("#8D7765")
        light_brown = HexColor("#E8D1A7")
        very_light_brown = HexColor("#F5EBDD")
        border_color = HexColor("#D8C8B5")
        green = HexColor("#24702A")
        light_green = HexColor("#EAF5E9")
        white = colors.white

        story = []

        # -----------------------------------------------------
        # PAYROLL VALUES
        # -----------------------------------------------------

        employee_name = (
            payroll.get("employee_name")
            or payroll.get("name")
            or "-"
        )

        # Current service may return employee_id as EMP001
        employee_id = (
            payroll.get("employee_id")
            or payroll.get("employee_code")
            or "-"
        )

        # If employee_code is separately available, use it.
        # Otherwise keep it blank instead of duplicating employee ID.
        employee_code = payroll.get("employee_code") or "-"

        year = payroll.get("year") or payroll.get("payroll_year") or ""
        month = payroll.get("month") or payroll.get("payroll_month") or ""

        payroll_period = f"{month}/{year}" if month and year else "-"

        total_working_days = PayslipPDF.get_value(
            payroll,
            "total_working_days",
            "working_days",
            "total_days",
            default=0,
        )

        paid_days = PayslipPDF.get_value(
            payroll,
            "paid_days",
            "pay_days",
            default=0,
        )

        present_days = PayslipPDF.get_value(
            payroll,
            "present_days",
            "present",
            default=0,
        )

        half_days = PayslipPDF.get_value(
            payroll,
            "half_days",
            "half_day",
            default=0,
        )

        absent_days = PayslipPDF.get_value(
            payroll,
            "absent_days",
            "absent",
            default=0,
        )

        leave_days = PayslipPDF.get_value(
            payroll,
            "leave_days",
            "leaves",
            default=0,
        )

        basic_salary = PayslipPDF.get_value(
            payroll,
            "basic_salary",
            "basic",
            default=0,
        )

        hra = PayslipPDF.get_value(
            payroll,
            "hra",
            "house_rent_allowance",
            default=0,
        )

        allowance = PayslipPDF.get_value(
            payroll,
            "allowance",
            "other_allowance",
            "conveyance",
            default=0,
        )

        gross_salary = PayslipPDF.get_value(
            payroll,
            "gross_salary",
            "gross",
            default=0,
        )

        daily_salary = PayslipPDF.get_value(
            payroll,
            "daily_salary",
            default=0,
        )

        earned_salary = PayslipPDF.get_value(
            payroll,
            "earned_salary",
            "salary_earned",
            default=0,
        )

        pf = PayslipPDF.get_value(
            payroll,
            "pf",
            "provident_fund",
            "pf_deduction",
            default=0,
        )

        professional_tax = PayslipPDF.get_value(
            payroll,
            "professional_tax",
            "pt",
            "professional_tax_deduction",
            default=0,
        )

        daily_advance_deduction = PayslipPDF.get_value(
            payroll,
            "advance_deduction",
            "daily_advance_deduction",
            default=0,
        )

        total_deductions = PayslipPDF.get_value(
            payroll,
            "total_deductions",
            "deductions",
            default=0,
        )

        net_salary = PayslipPDF.get_value(
            payroll,
            "net_salary",
            "net_salary_payable",
            default=0,
        )

        # -----------------------------------------------------
        # ADVANCE VALUES
        # -----------------------------------------------------

        main_advance_amount = PayslipPDF.get_value(
            payroll,
            "main_advance_amount",
            "main_advance",
            "advance_amount",
            default=0,
        )

        # This value must be the total daily advances taken
        # during the selected payroll month.
        daily_advance_taken = PayslipPDF.get_value(
            payroll,
            "advance_taken",
            "daily_advance_taken",
            "daily_advances_taken",
            default=0,
        )

        advance_remaining = PayslipPDF.get_value(
            payroll,
            "advance_remaining",
            "remaining_advance",
            "advance_balance",
            default=0,
        )

        main_advance_amount = PayslipPDF.safe_number(main_advance_amount)
        daily_advance_taken = PayslipPDF.safe_number(daily_advance_taken)
        daily_advance_deduction = PayslipPDF.safe_number(
            daily_advance_deduction
        )
        advance_remaining = PayslipPDF.safe_number(advance_remaining)

        # -----------------------------------------------------
        # HEADER
        # -----------------------------------------------------

        story.append(
            PayslipPDF.paragraph(
                "BUILDTRACK AI",
                font_name=bold_font,
                font_size=20,
                leading=23,
                alignment=TA_CENTER,
                text_color=dark_brown,
            )
        )

        story.append(
            PayslipPDF.paragraph(
                "CONSTRUCTION ERP",
                font_name=regular_font,
                font_size=9,
                leading=11,
                alignment=TA_CENTER,
                text_color=medium_brown,
            )
        )

        story.append(
            PayslipPDF.paragraph(
                "EMPLOYEE SALARY SLIP",
                font_name=regular_font,
                font_size=8,
                leading=10,
                alignment=TA_CENTER,
                text_color=medium_brown,
            )
        )

        story.append(Spacer(1, 8))

        # -----------------------------------------------------
        # PAYROLL DOCUMENT INFORMATION
        # -----------------------------------------------------

        document_info = [
            [
                PayslipPDF.paragraph(
                    "<b>PAYROLL PERIOD</b>",
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
                PayslipPDF.paragraph(
                    payroll_period,
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
                PayslipPDF.paragraph(
                    "<b>DOCUMENT TYPE</b>",
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
                PayslipPDF.paragraph(
                    "Salary Statement",
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
            ]
        ]

        document_info_table = Table(
            document_info,
            colWidths=[
                38 * mm,
                48 * mm,
                38 * mm,
                52 * mm,
            ],
        )

        document_info_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), very_light_brown),
                    ("BOX", (0, 0), (-1, -1), 0.5, border_color),
                    ("INNERGRID", (0, 0), (-1, -1), 0.5, border_color),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )

        story.append(document_info_table)
        story.append(Spacer(1, 9))

        # -----------------------------------------------------
        # EMPLOYEE INFORMATION
        # -----------------------------------------------------

        employee_title = Table(
            [
                [
                    PayslipPDF.paragraph(
                        "EMPLOYEE INFORMATION",
                        font_name=bold_font,
                        font_size=10,
                        text_color=dark_brown,
                    )
                ]
            ],
            colWidths=[170 * mm],
        )

        employee_title.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), light_brown),
                    ("BOX", (0, 0), (-1, -1), 0.5, border_color),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ]
            )
        )

        story.append(employee_title)

        employee_data = [
            [
                PayslipPDF.paragraph(
                    "<b>Employee Name</b>",
                    font_name=regular_font,
                    font_size=8,
                    text_color=medium_brown,
                ),
                PayslipPDF.paragraph(
                    employee_name,
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
                PayslipPDF.paragraph(
                    "<b>Employee ID</b>",
                    font_name=regular_font,
                    font_size=8,
                    text_color=medium_brown,
                ),
                PayslipPDF.paragraph(
                    str(employee_id),
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
            ],
            [
                PayslipPDF.paragraph(
                    "<b>Employee Code</b>",
                    font_name=regular_font,
                    font_size=8,
                    text_color=medium_brown,
                ),
                PayslipPDF.paragraph(
                    str(employee_code),
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
                PayslipPDF.paragraph(
                    "<b>Payroll Period</b>",
                    font_name=regular_font,
                    font_size=8,
                    text_color=medium_brown,
                ),
                PayslipPDF.paragraph(
                    payroll_period,
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
            ],
            [
                PayslipPDF.paragraph(
                    "<b>Total Working Days</b>",
                    font_name=regular_font,
                    font_size=8,
                    text_color=medium_brown,
                ),
                PayslipPDF.paragraph(
                    PayslipPDF.format_number(total_working_days, 0),
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
                PayslipPDF.paragraph(
                    "<b>Paid Days</b>",
                    font_name=regular_font,
                    font_size=8,
                    text_color=medium_brown,
                ),
                PayslipPDF.paragraph(
                    PayslipPDF.format_number(paid_days, 1),
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
            ],
        ]

        employee_table = Table(
            employee_data,
            colWidths=[
                32 * mm,
                53 * mm,
                32 * mm,
                53 * mm,
            ],
        )

        employee_table.setStyle(
            TableStyle(
                [
                    ("BOX", (0, 0), (-1, -1), 0.5, border_color),
                    ("INNERGRID", (0, 0), (-1, -1), 0.5, border_color),
                    ("BACKGROUND", (0, 0), (0, -1), HexColor("#FBF8F3")),
                    ("BACKGROUND", (2, 0), (2, -1), HexColor("#FBF8F3")),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )

        story.append(employee_table)
        story.append(Spacer(1, 9))

        # -----------------------------------------------------
        # ATTENDANCE SUMMARY
        # -----------------------------------------------------

        attendance_title = PayslipPDF.paragraph(
            "ATTENDANCE SUMMARY",
            font_name=bold_font,
            font_size=10,
            text_color=dark_brown,
        )

        attendance_data = [
            [
                PayslipPDF.paragraph(
                    "<b>Attendance Type</b>",
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
                PayslipPDF.paragraph(
                    "<b>Days</b>",
                    font_name=regular_font,
                    font_size=8,
                    alignment=TA_RIGHT,
                    text_color=dark_brown,
                ),
            ],
            [
                "Present Days",
                PayslipPDF.format_number(present_days, 0),
            ],
            [
                "Half Days",
                PayslipPDF.format_number(half_days, 0),
            ],
            [
                "Absent Days",
                PayslipPDF.format_number(absent_days, 0),
            ],
            [
                "Leave Days",
                PayslipPDF.format_number(leave_days, 0),
            ],
            [
                PayslipPDF.paragraph(
                    "<b>Paid Days</b>",
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
                PayslipPDF.paragraph(
                    f"<b>{PayslipPDF.format_number(paid_days, 1)}</b>",
                    font_name=regular_font,
                    font_size=8,
                    alignment=TA_RIGHT,
                    text_color=dark_brown,
                ),
            ],
        ]

        attendance_table = Table(
            attendance_data,
            colWidths=[49 * mm, 28 * mm],
        )

        attendance_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), light_brown),
                    ("BOX", (0, 0), (-1, -1), 0.5, border_color),
                    ("INNERGRID", (0, 0), (-1, -1), 0.5, border_color),
                    ("ALIGN", (1, 1), (1, -1), "RIGHT"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("BACKGROUND", (0, -1), (-1, -1), very_light_brown),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )

        # -----------------------------------------------------
        # EARNINGS SUMMARY
        # -----------------------------------------------------

        earnings_title = PayslipPDF.paragraph(
            "EARNINGS",
            font_name=bold_font,
            font_size=10,
            text_color=dark_brown,
        )

        earnings_data = [
            [
                PayslipPDF.paragraph(
                    "<b>Earnings</b>",
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
                PayslipPDF.paragraph(
                    "<b>Amount</b>",
                    font_name=regular_font,
                    font_size=8,
                    alignment=TA_RIGHT,
                    text_color=dark_brown,
                ),
            ],
            [
                "Basic Salary",
                PayslipPDF.format_currency(basic_salary),
            ],
            [
                "HRA",
                PayslipPDF.format_currency(hra),
            ],
            [
                "Allowance",
                PayslipPDF.format_currency(allowance),
            ],
            [
                PayslipPDF.paragraph(
                    "<b>Gross Salary</b>",
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
                PayslipPDF.paragraph(
                    f"<b>{PayslipPDF.format_currency(gross_salary)}</b>",
                    font_name=regular_font,
                    font_size=8,
                    alignment=TA_RIGHT,
                    text_color=dark_brown,
                ),
            ],
            [
                "Daily Salary",
                PayslipPDF.format_currency(daily_salary),
            ],
            [
                PayslipPDF.paragraph(
                    "<b>Earned Salary</b>",
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
                PayslipPDF.paragraph(
                    f"<b>{PayslipPDF.format_currency(earned_salary)}</b>",
                    font_name=regular_font,
                    font_size=8,
                    alignment=TA_RIGHT,
                    text_color=dark_brown,
                ),
            ],
        ]

        earnings_table = Table(
            earnings_data,
            colWidths=[49 * mm, 28 * mm],
        )

        earnings_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), light_brown),
                    ("BOX", (0, 0), (-1, -1), 0.5, border_color),
                    ("INNERGRID", (0, 0), (-1, -1), 0.5, border_color),
                    ("ALIGN", (1, 1), (1, -1), "RIGHT"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("BACKGROUND", (0, 4), (-1, 4), very_light_brown),
                    ("BACKGROUND", (0, 6), (-1, 6), very_light_brown),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )

        attendance_section = Table(
            [
                [attendance_title, earnings_title],
                [attendance_table, earnings_table],
            ],
            colWidths=[77 * mm, 77 * mm],
        )

        attendance_section.setStyle(
            TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 0),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                ]
            )
        )

        story.append(attendance_section)
        story.append(Spacer(1, 9))

        # -----------------------------------------------------
        # DEDUCTIONS
        # -----------------------------------------------------

        deductions_title = Table(
            [
                [
                    PayslipPDF.paragraph(
                        "DEDUCTIONS",
                        font_name=bold_font,
                        font_size=10,
                        text_color=dark_brown,
                    )
                ]
            ],
            colWidths=[170 * mm],
        )

        deductions_title.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), light_brown),
                    ("BOX", (0, 0), (-1, -1), 0.5, border_color),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ]
            )
        )

        story.append(deductions_title)

        deductions_data = [
            [
                PayslipPDF.paragraph(
                    "<b>Deduction</b>",
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
                PayslipPDF.paragraph(
                    "<b>Amount</b>",
                    font_name=regular_font,
                    font_size=8,
                    alignment=TA_RIGHT,
                    text_color=dark_brown,
                ),
            ],
            [
                "Provident Fund (PF)",
                PayslipPDF.format_currency(pf),
            ],
            [
                "Professional Tax",
                PayslipPDF.format_currency(professional_tax),
            ],
            [
                "Daily Advance Deduction",
                PayslipPDF.format_currency(daily_advance_deduction),
            ],
            [
                PayslipPDF.paragraph(
                    "<b>Total Deductions</b>",
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
                PayslipPDF.paragraph(
                    f"<b>{PayslipPDF.format_currency(total_deductions)}</b>",
                    font_name=regular_font,
                    font_size=8,
                    alignment=TA_RIGHT,
                    text_color=dark_brown,
                ),
            ],
        ]

        deductions_table = Table(
            deductions_data,
            colWidths=[105 * mm, 65 * mm],
        )

        deductions_table.setStyle(
            TableStyle(
                [
                    ("BOX", (0, 0), (-1, -1), 0.5, border_color),
                    ("INNERGRID", (0, 0), (-1, -1), 0.5, border_color),
                    ("BACKGROUND", (0, 0), (-1, 0), HexColor("#FBF8F3")),
                    ("BACKGROUND", (0, -1), (-1, -1), very_light_brown),
                    ("ALIGN", (1, 1), (1, -1), "RIGHT"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )

        story.append(deductions_table)
        story.append(Spacer(1, 9))

        # -----------------------------------------------------
        # ADVANCE INFORMATION
        # -----------------------------------------------------

        advance_title = Table(
            [
                [
                    PayslipPDF.paragraph(
                        "ADVANCE INFORMATION",
                        font_name=bold_font,
                        font_size=10,
                        text_color=dark_brown,
                    )
                ]
            ],
            colWidths=[170 * mm],
        )

        advance_title.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), light_brown),
                    ("BOX", (0, 0), (-1, -1), 0.5, border_color),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ]
            )
        )

        story.append(advance_title)

        # Blank daily advance fields when no daily advance exists.
        daily_advance_taken_display = (
            PayslipPDF.format_currency(daily_advance_taken)
            if daily_advance_taken > 0
            else ""
        )

        daily_advance_deduction_display = (
            PayslipPDF.format_currency(daily_advance_deduction)
            if daily_advance_deduction > 0
            else ""
        )

        advance_data = [
            [
                PayslipPDF.paragraph(
                    "<b>Advance Details</b>",
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
                PayslipPDF.paragraph(
                    "<b>Amount</b>",
                    font_name=regular_font,
                    font_size=8,
                    alignment=TA_RIGHT,
                    text_color=dark_brown,
                ),
            ],
            [
                "Main Advance",
                PayslipPDF.format_currency(
                    main_advance_amount,
                    blank_if_zero=True,
                ),
            ],
            [
                "Daily Advances Taken",
                daily_advance_taken_display,
            ],
            [
                "Daily Advance Deducted",
                daily_advance_deduction_display,
            ],
            [
                PayslipPDF.paragraph(
                    "<b>Main Advance Remaining</b>",
                    font_name=regular_font,
                    font_size=8,
                    text_color=dark_brown,
                ),
                PayslipPDF.paragraph(
                    f"<b>{PayslipPDF.format_currency(advance_remaining)}</b>",
                    font_name=regular_font,
                    font_size=8,
                    alignment=TA_RIGHT,
                    text_color=dark_brown,
                ),
            ],
        ]

        advance_table = Table(
            advance_data,
            colWidths=[105 * mm, 65 * mm],
        )

        advance_table.setStyle(
            TableStyle(
                [
                    ("BOX", (0, 0), (-1, -1), 0.5, border_color),
                    ("INNERGRID", (0, 0), (-1, -1), 0.5, border_color),
                    ("BACKGROUND", (0, 0), (-1, 0), HexColor("#FBF8F3")),
                    ("BACKGROUND", (0, -1), (-1, -1), very_light_brown),
                    ("ALIGN", (1, 1), (1, -1), "RIGHT"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )

        story.append(advance_table)
        story.append(Spacer(1, 10))

        # -----------------------------------------------------
        # NET SALARY
        # -----------------------------------------------------

        net_salary_data = [
            [
                PayslipPDF.paragraph(
                    "NET SALARY PAYABLE",
                    font_name=bold_font,
                    font_size=12,
                    leading=14,
                    text_color=green,
                ),
                PayslipPDF.paragraph(
                    PayslipPDF.format_currency(net_salary),
                    font_name=bold_font,
                    font_size=14,
                    leading=16,
                    alignment=TA_RIGHT,
                    text_color=green,
                ),
            ]
        ]

        net_salary_table = Table(
            net_salary_data,
            colWidths=[105 * mm, 65 * mm],
        )

        net_salary_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), light_green),
                    ("BOX", (0, 0), (-1, -1), 1, HexColor("#66B66A")),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ]
            )
        )

        story.append(net_salary_table)
        story.append(Spacer(1, 22))

        # -----------------------------------------------------
        # SIGNATURES
        # -----------------------------------------------------

        signature_data = [
            [
                PayslipPDF.paragraph(
                    "Employee Signature",
                    font_name=regular_font,
                    font_size=8,
                    alignment=TA_CENTER,
                    text_color=medium_brown,
                ),
                PayslipPDF.paragraph(
                    "Authorized Signature",
                    font_name=regular_font,
                    font_size=8,
                    alignment=TA_CENTER,
                    text_color=medium_brown,
                ),
            ],
            [
                PayslipPDF.paragraph(
                    "________________________",
                    font_name=regular_font,
                    font_size=8,
                    alignment=TA_CENTER,
                    text_color=medium_brown,
                ),
                PayslipPDF.paragraph(
                    "________________________",
                    font_name=regular_font,
                    font_size=8,
                    alignment=TA_CENTER,
                    text_color=medium_brown,
                ),
            ],
        ]

        signature_table = Table(
            signature_data,
            colWidths=[85 * mm, 85 * mm],
        )

        signature_table.setStyle(
            TableStyle(
                [
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 2),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
                ]
            )
        )

        story.append(signature_table)
        story.append(Spacer(1, 12))

        # -----------------------------------------------------
        # FOOTER
        # -----------------------------------------------------

        generated_time = datetime.now().strftime("%d-%m-%Y %I:%M %p")

        story.append(
            PayslipPDF.paragraph(
                f"This is a computer-generated salary slip. Generated on {generated_time}.",
                font_name=regular_font,
                font_size=7,
                leading=9,
                alignment=TA_CENTER,
                text_color=medium_brown,
            )
        )

        story.append(
            PayslipPDF.paragraph(
                "BuildTrack AI Construction ERP",
                font_name=regular_font,
                font_size=7,
                leading=9,
                alignment=TA_CENTER,
                text_color=medium_brown,
            )
        )

        # -----------------------------------------------------
        # BUILD PDF
        # -----------------------------------------------------

        document.build(story)

        buffer.seek(0)

        return buffer