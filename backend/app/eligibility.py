"""Eligibility estimate (docs/API.md).

Income limits are 2026 LA County HOME 50% AMI limits. The 80% tier is a prototype
estimate of 1.6x the 50% limit rounded to the nearest $50. The table is hardcoded
on purpose; it is not computed at runtime.
"""

# household_size -> (income_limit_50, income_limit_80)
INCOME_LIMITS: dict[int, tuple[int, int]] = {
    1: (58300, 93300),
    2: (66650, 106650),
    3: (74950, 119900),
    4: (83300, 133300),
    5: (89950, 143900),
    6: (96650, 154650),
    7: (103300, 165300),
    8: (109950, 175900),
}


def evaluate(household_size: int, annual_income: int, employer: str) -> dict:
    """Status is first-match-wins: other employer, then 50%, then 80%, else over."""
    if household_size not in INCOME_LIMITS:
        raise ValueError(f"household_size must be between 1 and 8, got {household_size}")
    limit_50, limit_80 = INCOME_LIMITS[household_size]

    if employer == "other":
        status = "needs_review"
    elif annual_income <= limit_50:
        status = "priority"
    elif annual_income <= limit_80:
        status = "eligible"
    else:
        status = "over_income"

    return {
        "status": status,
        "income_limit_50": limit_50,
        "income_limit_80": limit_80,
        # floor(annual_income * 0.30 / 12) in integer arithmetic
        "max_comfortable_rent": annual_income * 30 // 1200,
    }
