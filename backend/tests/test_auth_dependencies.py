from fastapi import HTTPException

from app.core.security import get_bearer_token


def test_get_bearer_token_rejects_missing_credentials() -> None:
    try:
        get_bearer_token(None)
    except HTTPException as exc:
        assert exc.status_code == 401
    else:
        raise AssertionError("Expected missing credentials to raise HTTPException")
