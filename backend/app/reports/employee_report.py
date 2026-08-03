from io import BytesIO

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
)


def generate_employee_report(employee):

    buffer = BytesIO()

    doc = SimpleDocTemplate(buffer)

    styles = getSampleStyleSheet()

    story = []

    story.append(
        Paragraph(
            "<b>BuildTrack AI</b>",
            styles["Title"],
        )
    )

    story.append(
        Paragraph(
            "Employee Report",
            styles["Heading2"],
        )
    )

    story.append(
        Paragraph(
            f"Employee ID : {employee.employee_id}",
            styles["BodyText"],
        )
    )

    story.append(
        Paragraph(
            f"Name : {employee.full_name}",
            styles["BodyText"],
        )
    )

    story.append(
        Paragraph(
            f"Department : {employee.department}",
            styles["BodyText"],
        )
    )

    story.append(
        Paragraph(
            f"Designation : {employee.designation}",
            styles["BodyText"],
        )
    )

    story.append(
        Paragraph(
            f"Salary : ₹{employee.salary}",
            styles["BodyText"],
        )
    )

    story.append(
        Paragraph(
            f"Status : {'Active' if employee.is_active else 'Inactive'}",
            styles["BodyText"],
        )
    )

    doc.build(story)

    buffer.seek(0)

    return buffer