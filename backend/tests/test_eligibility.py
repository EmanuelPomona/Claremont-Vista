"""Eligibility tests (docs/API.md). Exactly the 5 required by the owner directive."""

from fastapi.testclient import TestClient

from app.eligibility import evaluate
from app.main import app


def test_priority_household_of_three_at_52000_pomona():
    result = evaluate(household_size=3, annual_income=52000, employer="pomona")

    assert result == {
        "status": "priority",
        "income_limit_50": 74950,
        "income_limit_80": 119900,
        "max_comfortable_rent": 1300,
    }


def test_one_dollar_over_the_inclusive_50_percent_limit_is_eligible():
    result = evaluate(household_size=1, annual_income=58301, employer="pomona")

    assert result["status"] == "eligible"


def test_one_dollar_over_the_80_percent_limit_is_over_income():
    result = evaluate(household_size=4, annual_income=133301, employer="pomona")

    assert result["status"] == "over_income"


def test_employer_other_needs_review_even_when_income_is_low():
    result = evaluate(household_size=2, annual_income=20000, employer="other")

    assert result["status"] == "needs_review"


def test_application_without_email_or_phone_is_rejected_with_contact_required():
    client = TestClient(app)
    body = {
        "full_name": "Alex Rivera",
        "employer": "pomona",
        "job_category": "dining",
        "household_size": 3,
        "annual_income": 52000,
        "unit_type": "two_bedroom",
        "preferred_language": "es",
    }

    response = client.post("/api/applications", json=body)

    assert response.status_code == 400
    assert response.json()["error"] == "contact_required"
    assert response.json()["field"] == "email"
