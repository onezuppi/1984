FROM python:3.12-alpine AS development_build

RUN pip install poetry

WORKDIR /app

COPY pyproject.toml poetry.lock /app/
COPY main.py /app/
COPY config.py /app/
COPY .env /app/
COPY back/ /app/back
COPY bot/ /app/bot

RUN poetry lock && poetry install

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
