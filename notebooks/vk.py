from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

VK_CLIENT_ID = os.getenv("VK_CLIENT_ID")
VK_CLIENT_SECRET = os.getenv("VK_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

VK_OAUTH_URL = "https://oauth.vk.com/authorize"
VK_TOKEN_URL = "https://oauth.vk.com/access_token"

@app.get("/auth/login")
def login():
    url = f"{VK_OAUTH_URL}?client_id={VK_CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code&scope=wall,offline"
    return RedirectResponse(url)

@app.get("/auth/callback")
def auth_callback(code: str):
    token_params = {
        "client_id": VK_CLIENT_ID,
        "client_secret": VK_CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "code": code
    }
    response = requests.get(VK_TOKEN_URL, params=token_params)
    data = response.json()
    if "error" in data:
        raise HTTPException(status_code=400, detail=data.get("error_description", "Ошибка авторизации"))
    return data

@app.get("/get_public_data")
def get_public_data(domain: str, access_token: str, count: int = 10):
    vk_api_url = "https://api.vk.com/method/wall.get"
    params = {
        "domain": domain,
        "count": count,
        "access_token": access_token,
        "v": "5.131"
    }
    response = requests.get(vk_api_url, params=params)
    data = response.json()
    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"].get("error_msg", "Ошибка получения данных"))
    return data

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
