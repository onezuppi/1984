#!/bin/sh
set -e

poetry run start &
poetry run bot
