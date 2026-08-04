class PayrollCalculator:

    @staticmethod
    def calculate(
        salary_structure,
        present_days,
        total_working_days,
    ):
        basic = salary_structure.basic_salary
        hra = salary_structure.hra
        allowance = salary_structure.allowance

        gross_salary = (
            basic +
            hra +
            allowance
        )

        daily_salary = gross_salary / total_working_days

        earned_salary = (
            daily_salary * present_days
        )

        deductions = (
            salary_structure.pf +
            salary_structure.professional_tax
        )

        net_salary = (
            earned_salary - deductions
        )

        return {
            "basic_salary": basic,
            "hra": hra,
            "allowance": allowance,
            "gross_salary": round(gross_salary, 2),
            "present_days": present_days,
            "total_working_days": total_working_days,
            "earned_salary": round(earned_salary, 2),
            "pf": salary_structure.pf,
            "professional_tax": salary_structure.professional_tax,
            "total_deductions": deductions,
            "net_salary": round(net_salary, 2),
        }