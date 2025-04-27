FROM python:3.12-alpine AS development_build

RUN pip install poetry

WORKDIR /app

COPY pyproject.toml poetry.lock main.py /app/
COPY back/ /app/back

RUN poetry install

ENTRYPOINT ["poetry", "run", "start"]
