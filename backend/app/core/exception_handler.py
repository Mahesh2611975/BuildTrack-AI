from fastapi import Request
from fastapi.responses import JSONResponse

from app.core.api_response import error_response


async def http_exception_handler(
    request: Request,
    exc,
):
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(exc.detail),
    )