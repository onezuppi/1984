from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from gigachat import GigaChat
from back.utils.jwt import verify_and_get_user
from config import settings

router = APIRouter(prefix="/llm", tags=["LLM"])


class ChatRequest(BaseModel):
    prompt: str


class ChatResponse(BaseModel):
    response: str


def get_gigachat_client() -> GigaChat:
    return GigaChat(
        credentials=settings.GIGACHAT_API_KEY,
        scope=settings.GIGACHAT_SCOPE,
        model=settings.GIGACHAT_MODEL,
        verify_ssl_certs=False
    )


@router.post("/chat", response_model=ChatResponse, dependencies=[Depends(verify_and_get_user)])
async def chat_with_llm(
    request: ChatRequest,
    user_id: str = Depends(verify_and_get_user),
    gigachat: GigaChat = Depends(get_gigachat_client)
):
    try:
        sdk_response = gigachat.chat(request.prompt)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Ошибка при общении с GigaChat SDK: {e}")

    if not sdk_response.choices:
        raise HTTPException(status_code=502, detail="Некорректный ответ от GigaChat SDK")

    answer_text = sdk_response.choices[0].message.content
    return ChatResponse(response=answer_text)
