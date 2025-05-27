#!/bin/sh
set -e

poetry run start &
poetry run python bot/main.py
