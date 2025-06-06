from .auth import router as auth_router
from .posts import router as posts_router
from .user import router as user_router
from .channels import router as channels_router
from .llm import router as llm_router

routers = [auth_router, posts_router, channels_router, user_router, llm_router]
