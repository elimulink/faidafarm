import logging

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

logger = logging.getLogger(__name__)


def _register_validation_logging(app) -> None:
    """Logs why a request was rejected, not just that it was.

    A 422 in the access log says nothing about which field failed, which turned
    a one-line schema bug into a long hunt. The offending locations are logged
    (not the values, which can carry a farmer's question).
    """
    from fastapi.exceptions import RequestValidationError
    from fastapi.responses import JSONResponse

    @app.exception_handler(RequestValidationError)
    async def _on_validation_error(request, exc: RequestValidationError):
        logging.getLogger(__name__).warning(
            "422 on %s: %s",
            request.url.path,
            [{"loc": e.get("loc"), "type": e.get("type"), "msg": e.get("msg")} for e in exc.errors()],
        )
        return JSONResponse(status_code=422, content={"detail": exc.errors()})


def register_error_handlers(app: FastAPI) -> None:
    _register_validation_logging(app)
    @app.exception_handler(SQLAlchemyError)
    async def sqlalchemy_error_handler(_: Request, exc: SQLAlchemyError) -> JSONResponse:
        logger.exception("Database error", exc_info=exc)
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"detail": "Database service is temporarily unavailable."},
        )

    @app.exception_handler(Exception)
    async def unexpected_error_handler(_: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unhandled application error", exc_info=exc)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Internal server error."},
        )
