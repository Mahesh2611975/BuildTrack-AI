class PayrollCalculator:

    @staticmethod
    def calculate(
        salary_structure,
        present_days,
        half_days,
        absent_days,
        leave_days,
        total_working_days,
    ):

        # =================================================
        # SALARY COMPONENTS
        # =================================================

        basic = salary_structure.basic_salary

        hra = (
            salary_structure.hra
            if salary_structure.hra is not None
            else 0
        )

        allowance = (
            salary_structure.allowance
            if salary_structure.allowance is not None
            else 0
        )

        # =================================================
        # GROSS SALARY
        # =================================================

        gross_salary = (
            basic
            + hra
            + allowance
        )

        # =================================================
        # PAID DAYS
        #
        # Present  = 1 day
        # Half Day = 0.5 day
        # Leave    = 1 day
        # Absent   = 0 day
        # =================================================

        paid_days = (
            present_days
            + (half_days * 0.5)
            + leave_days
        )

        # =================================================
        # DAILY SALARY
        # =================================================

        daily_salary = (
            gross_salary
            / total_working_days
        )

        # =================================================
        # EARNED SALARY
        # =================================================

        earned_salary = (
            daily_salary
            * paid_days
        )

        # =================================================
        # DEDUCTIONS
        # =================================================

        pf = (
            salary_structure.pf
            if salary_structure.pf is not None
            else 0
        )

        professional_tax = (
            salary_structure.professional_tax
            if salary_structure.professional_tax is not None
            else 0
        )

        total_deductions = (
            pf
            + professional_tax
        )

        # =================================================
        # NET SALARY
        # =================================================

        net_salary = (
            earned_salary
            - total_deductions
        )

        # =================================================
        # RESULT
        # =================================================

        return {

            "basic_salary": round(
                basic,
                2,
            ),

            "hra": round(
                hra,
                2,
            ),

            "allowance": round(
                allowance,
                2,
            ),

            "gross_salary": round(
                gross_salary,
                2,
            ),

            "total_working_days":
                total_working_days,

            "present_days":
                present_days,

            "half_days":
                half_days,

            "absent_days":
                absent_days,

            "leave_days":
                leave_days,

            "paid_days": round(
                paid_days,
                2,
            ),

            "daily_salary": round(
                daily_salary,
                2,
            ),

            "earned_salary": round(
                earned_salary,
                2,
            ),

            "pf": round(
                pf,
                2,
            ),

            "professional_tax": round(
                professional_tax,
                2,
            ),

            "total_deductions": round(
                total_deductions,
                2,
            ),

            "net_salary": round(
                net_salary,
                2,
            ),
        }