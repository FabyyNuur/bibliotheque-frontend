#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-http://localhost:3000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3001}"
MAX_RETRIES=30
RETRY_DELAY=2

wait_for_url() {
  local url="$1"
  local label="$2"
  for i in $(seq 1 "$MAX_RETRIES"); do
    if curl -sf "$url" > /dev/null; then
      echo "${label} disponible."
      return 0
    fi
    if [ "$i" -eq "$MAX_RETRIES" ]; then
      echo "Erreur : ${label} inaccessible sur ${url}"
      return 1
    fi
    echo "Attente ${label} (${i}/${MAX_RETRIES})..."
    sleep "$RETRY_DELAY"
  done
}

echo "Vérification des services..."
wait_for_url "${API_URL}/health" "API"
wait_for_url "${FRONTEND_URL}/books" "Frontend"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}/../selenium-tests"

mvn test "$@"
