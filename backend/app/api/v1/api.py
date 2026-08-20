from fastapi import APIRouter

from app.api.v1.routes import admin, assistant, auth, farmer, field, health, integrations_kobo, media, notifications, operations, predictions, research, settings, users


api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(assistant.router, prefix="/assistant", tags=["assistant"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(farmer.router, prefix="/farmer", tags=["farmer"])
api_router.include_router(research.router, prefix="/research", tags=["research"])
api_router.include_router(field.router, prefix="/field", tags=["field"])
api_router.include_router(integrations_kobo.router, prefix="/integrations/kobo", tags=["integrations:kobo"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])
api_router.include_router(operations.router, prefix="/operations", tags=["operations"])
api_router.include_router(media.router, prefix="/media", tags=["media"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
