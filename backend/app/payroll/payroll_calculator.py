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

        # ==========================================
        # SALARY COMPONENTS
        # ==========================================

        basic = salary_structure.basic_salary or 0
        hra = salary_structure.hra or 0
        allowance = salary_structure.allowance or 0

        gross_salary = (
            basic
            + hra
            + allowance
        )

        # ==========================================
        # DAILY SALARY
        # ==========================================

        if total_working_days <= 0:
            daily_salary = 0
        else:
            daily_salary = (
                gross_salary
                / total_working_days
            )

        # ==========================================
        # PAID DAYS
        # ==========================================
        #
        # Present = 1 day
        # Half Day = 0.5 day
        # Leave = 1 paid day
        # Absent = 0 day
        #

        paid_days = (
            present_days
            + (half_days * 0.5)
            + leave_days
        )

        # Prevent invalid paid days

        paid_days = max(
            0,
            min(
                paid_days,
                total_working_days,
            ),
        )

        # ==========================================
        # EARNED SALARY
        # ==========================================

        earned_salary = (
            daily_salary
            * paid_days
        )

        # ==========================================
        # MONTHLY DEDUCTIONS
        # ==========================================

        monthly_pf = (
            salary_structure.pf or 0
        )

        monthly_professional_tax = (
            salary_structure.professional_tax or 0
        )

        # ==========================================
        # PRORATED DEDUCTIONS
        # ==========================================
        #
        # Example:
        #
        # Monthly PF = ₹1800
        # Working days = 31
        # Paid days = 1
        #
        # PF = 1800 / 31 * 1
        #

        if total_working_days > 0:

            pf = (
                monthly_pf
                / total_working_days
                * paid_days
            )

            professional_tax = (
                monthly_professional_tax
                / total_working_days
                * paid_days
            )

        else:

            pf = 0
            professional_tax = 0

        # ==========================================
        # TOTAL DEDUCTIONS
        # ==========================================

        total_deductions = (
            pf
            + professional_tax
        )

        # ==========================================
        # NET SALARY
        # ==========================================

        net_salary = (
            earned_salary
            - total_deductions
        )

        # ==========================================
        # RESPONSE
        # ==========================================

        return {

            # ======================================
            # SALARY
            # ======================================

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

            # ======================================
            # ATTENDANCE
            # ======================================

            "total_working_days": (
                total_working_days
            ),

            "present_days": present_days,

            "half_days": half_days,

            "absent_days": absent_days,

            "leave_days": leave_days,

            "paid_days": round(
                paid_days,
                2,
            ),

            # ======================================
            # SALARY CALCULATION
            # ======================================

            "daily_salary": round(
                daily_salary,
                2,
            ),

            "earned_salary": round(
                earned_salary,
                2,
            ),

            # ======================================
            # DEDUCTIONS
            # ======================================

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

            # ======================================
            # FINAL SALARY
            # ======================================

            "net_salary": round(
                net_salary,
                2,
            ),
        }