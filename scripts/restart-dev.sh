#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-4173}"
HOST="${HOST:-127.0.0.1}"
NODE_BIN="$ROOT_DIR/.local/node-v22.22.2-darwin-arm64/bin"

cd "$ROOT_DIR"

if [ -d "$NODE_BIN" ]; then
  export PATH="$NODE_BIN:$PATH"
fi

PIDS="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"

if [ -n "$PIDS" ]; then
  echo "Stopping old dev server on port $PORT: $PIDS"
  kill $PIDS 2>/dev/null || true
  sleep 1
fi

REMAINING_PIDS="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"

if [ -n "$REMAINING_PIDS" ]; then
  echo "Force stopping stubborn process on port $PORT: $REMAINING_PIDS"
  kill -9 $REMAINING_PIDS 2>/dev/null || true
  sleep 1
fi

echo "Starting TOPCENT dev server at http://localhost:$PORT/"
exec npm run dev -- --host "$HOST" --port "$PORT"
