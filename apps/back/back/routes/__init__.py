from .tg_auth import router as tg_auth_router
from .vk_auth import router as vk_auth_router

__all__ = ["tg_auth_router", "vk_auth_router"]
