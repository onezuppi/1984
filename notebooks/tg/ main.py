from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import uvicorn
from telethon import TelegramClient
import asyncio

# ===================== ПАРАМЕТРЫ =====================
API_ID = 1234567
API_HASH = "xxxxxxxxxxxxxxxxxxxxxxxx"
GROUP_USERNAME = "my_group_or_channel"


client = TelegramClient('session_name', API_ID, API_HASH)


app = FastAPI()
templates = Jinja2Templates(directory="templates")


authenticated_users = {}


@app.get("/", response_class=HTMLResponse)
async def read_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/auth")
async def auth_user(request: Request):
    data = await request.json()
    user_id = data.get("id")
    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid user data")
    authenticated_users[user_id] = data
    return {"status": "ok"}

@app.get("/channel", response_class=HTMLResponse)
async def read_channel(request: Request):
    messages_html = await fetch_last_messages(10)
    return templates.TemplateResponse("channel.html", {
        "request": request,
        "messages_html": messages_html,
        "group_username": GROUP_USERNAME.lstrip("@")
    })

async def fetch_last_messages(limit=10):
    if not client.is_connected():
        await client.connect()

    entity = await client.get_entity(GROUP_USERNAME)
    result_html = "<ul>"
    async for message in client.iter_messages(entity, limit=limit):
        text = message.text.replace('\n', '<br>') if message.text else ""
        result_html += f"<li><strong>ID:</strong> {message.id} | <strong>Дата:</strong> {message.date}<br>{text}</li>"
    result_html += "</ul>"
    return result_html

@app.on_event("startup")
async def on_startup():
    await client.connect()

@app.on_event("shutdown")
async def on_shutdown():
    await client.disconnect()

if name == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
