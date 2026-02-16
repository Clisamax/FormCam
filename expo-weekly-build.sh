#!/usr/bin/env bash

# --------------------------------------------------------------
#  expo-weekly-build.sh  (versão Yarn‑Only – verificação de versão robusta)
#  Automatiza a build semanal de um app Expo (React Native) para iOS
#  (sem conta paga da Apple Developer)
#
#  REQUISITOS:
#    • Node >= 18
#    • Yarn  >= 1.22.0
#    • expo-cli (global ou via npx) >= 6
#    • Xcode >= 14
#    • CocoaPods (pod) >= 1.12
#    • watchman (opcional)
#    • libimobiledevice (idevice_id) – para detectar iPhone via USB
#
#  Como usar:
#    ./expo-weekly-build.sh          # modo interativo (padrão)
#    ./expo-weekly-build.sh silent   # modo silencioso (falha se precisar de input)
#
#  Agendamento (cron) – exemplo: segunda‑feira, 02:00h
#    0 2 * * 1 /caminho/para/expo-weekly-build.sh \
#        >> /caminho/para/cron.log 2>&1
# --------------------------------------------------------------

set -euo pipefail      # aborta ao primeiro erro
IFS=$'\n\t'           # evita split inesperado

# --------------------------- CONFIGURAÇÕES ---------------------------

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${PROJECT_ROOT}/logs"
TIMESTAMP="$(date +%F_%H-%M-%S)"
LOG_FILE="${LOG_DIR}/weekly-build-${TIMESTAMP}.log"

# Versões mínimas (use sempre o formato completo, ex.: 1.22.0)
REQ_NODE="18.0.0"
REQ_YARN="1.22.0"
REQ_EXPO="6.0.0"
REQ_XCODE="14.0.0"
REQ_POD="1.12.0"

# Notificações (deixe vazios para desativar)
EMAIL_NOTIF=""        # ex.: seu@email.com
SLACK_WEBHOOK=""      # ex.: https://hooks.slack.com/services/...

# --------------------------------------------------------------

# ---------- Funções auxiliares ----------
log() {
    # Garante que a pasta de logs exista na primeira chamada
    [[ -d "${LOG_DIR}" ]] || mkdir -p "${LOG_DIR}"
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "${LOG_FILE}"
}

die() {
    log "❌ ERRO: $*"
    [[ -n "${EMAIL_NOTIF}" ]] && {
        echo -e "Subject: [Expo Build] Falha\n\n${LOG_FILE}" | /usr/sbin/sendmail "${EMAIL_NOTIF}"
    }
    [[ -n "${SLACK_WEBHOOK}" ]] && {
        payload=$(printf '{"text":"⚠️ *Expo Build* falhou: %s"}' "$*")
        curl -s -X POST -H 'Content-type: application/json' \
            --data "${payload}" "${SLACK_WEBHOOK}" >/dev/null
    }
    exit 1
}

# Compara duas versões semânticas (x.y.z). Retorna 0 se $1 >= $2.
verificaVersao() {
    # $1 = versão instalada, $2 = versão mínima requerida
    local instal="${1}"
    local requerida="${2}"
    # Ordena as duas versões; a primeira da lista será a menor.
    # Se a menor for a requerida, então instal >= requerida.
    if [[ "$(printf '%s\n%s\n' "${requerida}" "${instal}" | sort -V | head -n1)" = "${requerida}" ]]; then
        return 0    # ok
    else
        return 1    # instal < requerida
    fi
}

# --------------------------- 1️⃣ PRE‑CHECKS ---------------------------

log "🚀 Iniciando script de build – ${TIMESTAMP}"

# ---- Node ----
command -v node >/dev/null 2>&1 || die "Node.js não encontrado."
INSTALLED_NODE=$(node -v | tr -d 'v')
verificaVersao "${INSTALLED_NODE}" "${REQ_NODE}" || die "Node ${REQ_NODE}+ requerida (encontrado: ${INSTALLED_NODE})."
log "✅ Node $(node -v) OK"

# ---- Yarn ----
command -v yarn >/dev/null 2>&1 || die "Yarn não encontrado. Instale com npm ou Homebrew."
INSTALLED_YARN=$(yarn -v)
verificaVersao "${INSTALLED_YARN}" "${REQ_YARN}" || die "Yarn ${REQ_YARN}+ requerida (encontrado: ${INSTALLED_YARN})."
log "✅ Yarn ${INSTALLED_YARN} OK"

# ---- Expo CLI ----
if command -v expo >/dev/null 2>&1; then
    INSTALLED_EXPO=$(expo --version)
    verificaVersao "${INSTALLED_EXPO}" "${REQ_EXPO}" || die "Expo CLI ${REQ_EXPO}+ requerida (encontrado: ${INSTALLED_EXPO})."
    log "✅ Expo CLI $(expo --version) OK"
else
    log "⚠️ Expo CLI não está instalado globalmente – será usado via npx."
fi

# ---- Xcode ----
command -v xcodebuild >/dev/null 2>&1 || die "Xcode não encontrado."
XCODE_FULL=$(xcodebuild -version | head -1 | awk '{print $2}')
verificaVersao "${XCODE_FULL}" "${REQ_XCODE}" || die "Xcode ${REQ_XCODE}+ requerida (encontrado: ${XCODE_FULL})."
log "✅ Xcode ${XCODE_FULL} OK"

# ---- CocoaPods ----
command -v pod >/dev/null 2>&1 || die "CocoaPods (pod) não encontrado."
INSTALLED_POD=$(pod --version)
verificaVersao "${INSTALLED_POD}" "${REQ_POD}" || die "CocoaPods ${REQ_POD}+ requerida (encontrado: ${INSTALLED_POD})."
log "✅ CocoaPods ${INSTALLED_POD} OK"

# ---- watchman (opcional) ----
if command -v watchman >/dev/null 2>&1; then
    log "✅ watchman $(watchman -v) encontrado"
else
    log "⚠️ watchman não encontrado – recomendável instalar (brew install watchman)."
fi

# ---- libimobiledevice (idevice_id) ----
if command -v idevice_id >/dev/null 2>&1; then
    log "✅ libimobiledevice (idevice_id) disponível"
    HAVE_IDEVICE=1
else
    log "⚠️ idevice_id não encontrado – usarei fallback via system_profiler."
    HAVE_IDEVICE=0
fi

# --------------------------- 2️⃣ ATUALIZAR DEPENDÊNCIAS ---------------------------

log "📦 Instalando dependências com Yarn (frozen‑lockfile)…"
cd "${PROJECT_ROOT}"

if [[ -f yarn.lock ]]; then
    yarn install --frozen-lockfile >> "${LOG_FILE}" 2>&1
else
    die "yarn.lock não encontrado. Crie‑o rodando \`yarn install\` antes de usar o script."
fi

# --------------------------- 3️⃣ LIMPAR BUILD ANTERIOR ---------------------------

log "🧹 Limpando artefatos de build anteriores…"

[[ -d ios/build ]] && { rm -rf ios/build && log "   • ios/build removida"; }
[[ -d .expo ]] && { rm -rf .expo && log "   • .expo removida"; }

DERIVED=$(find ~/Library/Developer/Xcode/DerivedData -maxdepth 1 -type d -name "$(basename "$(pwd)")*")
[[ -n "${DERIVED}" ]] && { rm -rf "${DERIVED}" && log "   • DerivedData (${DERIVED}) removida"; }

log "   • Resetando cache do Metro"
npx expo start --clear --non-interactive >> "${LOG_FILE}" 2>&1 || true

# --------------------------- 4️⃣ PODS ---------------------------

log "🔧 Instalando/atualizando Pods…"
cd ios
pod install --repo-update >> "${LOG_FILE}" 2>&1
cd "${PROJECT_ROOT}"
log "✅ Pods instalados"

# --------------------------- 5️⃣ DETECTAR DISPOSITIVO ---------------------------

log "📱 Detectando iPhone conectado…"

get_device_id_idevice() {
    idevice_id -l | head -n1
}
get_device_name_system_profiler() {
    system_profiler SPUSBDataType | awk -F': +' '/iPhone/ {print $2; exit}'
}

DEVICE_ID=""
if (( HAVE_IDEVICE )); then
    DEVICE_ID=$(get_device_id_idevice) || true
fi

if [[ -z "${DEVICE_ID}" ]]; then
    DEVICE_ID=$(get_device_name_system_profiler) || true
fi

if [[ -z "${DEVICE_ID}" ]]; then
    if [[ "${1:-}" == "silent" ]]; then
        die "Nenhum iPhone conectado detectado em modo silencioso."
    else
        read -rp $'⚠️ Não foi possível detectar o iPhone automaticamente.\nDigite o nome (ex.: "John’s iPhone") ou UUID do dispositivo: ' DEVICE_ID
        [[ -z "${DEVICE_ID}" ]] && die "Nenhum dispositivo informado."
    fi
fi

log "✅ Dispositivo selecionado: ${DEVICE_ID}"

# --------------------------- 6️⃣ BUILD ---------------------------

log "🛠️ Iniciando build com Expo (Yarn)…"
BUILD_CMD="npx expo run:ios --device \"${DEVICE_ID}\" --non-interactive"

log "   • Executando: ${BUILD_CMD}"
eval "${BUILD_CMD}" >> "${LOG_FILE}" 2>&1

log "✅ Build concluída! O app foi instalado no dispositivo."

# --------------------------- 7️⃣ NOTIFICAÇÃO DE SUCESSO ---------------------------

if [[ -n "${EMAIL_NOTIF}" ]]; then
    echo -e "Subject: [Expo Build] Sucesso\n\nBuild concluída com sucesso em $(date).\nLog: ${LOG_FILE}" \
        | /usr/sbin/sendmail "${EMAIL_NOTIF}"
fi

if [[ -n "${SLACK_WEBHOOK}" ]]; then
    payload=$(printf '{"text":"✅ *Expo Build* concluída com sucesso em %s"}' "$(date '+%Y-%m-%d %H:%M')")
    curl -s -X POST -H 'Content-type: application/json' --data "${payload}" "${SLACK_WEBHOOK}" >/dev/null
fi

log "🏁 Script finalizado."
exit 0
