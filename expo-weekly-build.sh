#!/usr/bin/env bash

# --------------------------------------------------------------
#  expo-weekly-build.sh  (versão Yarn‑Only – verificação de versão robusta)
#  Automatiza a build semanal de um app Expo (React Native) para iOS
#  (sem conta paga da Apple Developer)
#
#  REQUISITOS:
#    • Node >= 18
#    • Yarn  >= 1.22.0    (ou Yarn 2‑4 – o script lida com ambos)
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
    [[ -d "${LOG_DIR}" ]] || mkdir -p "${LOG_DIR}"
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "${LOG_FILE}"
}

die() {
    log "❌ ERRO: $*"
    if [[ -f "${LOG_FILE}" ]]; then
        echo "----- últimas linhas do log (${LOG_FILE}) -----"
        tail -n 20 "${LOG_FILE}"
        echo "-----------------------------------------------"
    fi
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

# Comparação semântica de versões: retorna 0 se $1 >= $2
verificaVersao() {
    local instal="$1"
    local requerida="$2"
    if [[ "$(printf '%s\n%s\n' "${requerida}" "${instal}" | sort -V | head -n1)" = "${requerida}" ]]; then
        return 0
    else
        return 1
    fi
}

# --------------------------------------------------------------
# 5.5 FUNÇÃO DE MIGRAÇÃO AUTOMÁTICA (executada somente se necessário)
# --------------------------------------------------------------
migrar_projeto_xcode() {
    local workspace="${PROJECT_ROOT}/ios/FormCam.xcworkspace"
    local project="${PROJECT_ROOT}/ios/FormCam.xcodeproj"

    if [[ -d "${workspace}" ]]; then
        log "🔧 Tentando migração automática (workspace)…"
        xcodebuild -workspace "${workspace}" -scheme "FormCam" -runFirstLaunch \
            >> "${LOG_FILE}" 2>&1 || true
    elif [[ -d "${project}" ]]; then
        log "🔧 Tentando migração automática (project)…"
        xcodebuild -project "${project}" -scheme "FormCam" -runFirstLaunch \
            >> "${LOG_FILE}" 2>&1 || true
    else
        log "⚠️ Nenhum .xcworkspace nem .xcodeproj encontrado – nada para migrar."
        return 1
    fi

    # Verifica se ainda ficou a flag antiga “LastUpgradeCheck”
    if [[ -f "${project}/project.pbxproj" ]] && grep -q "LastUpgradeCheck" "${project}/project.pbxproj"; then
        log "⚠️ Migração pode não ter sido concluída (flag ainda presente)."
        return 1
    fi

    log "✅ Migração automática concluída."
    return 0
}

# --------------------------------------------------------------
# 2️⃣ INSTALAR DEPENDÊNCIAS (YARN) – escolha da flag correta
# --------------------------------------------------------------
instalar_dependencias() {
    log "📦 Instalando dependências com Yarn…"
    cd "${PROJECT_ROOT}"

    [[ -f yarn.lock ]] || die "yarn.lock não encontrado…"

    # Remove o prefixo “v” caso venha (ex.: “v4.12.0”)
    YARN_MAJOR=$(yarn -v | tr -d 'v' | cut -d. -f1)

    if (( YARN_MAJOR >= 2 )); then
        log "   → Yarn ${YARN_MAJOR} detectado – usando '--immutable --no-progress --non-interactive'"
        yarn install --immutable --no-progress --non-interactive 2>&1 | tee -a "${LOG_FILE}"
    else
        log "   → Yarn ${YARN_MAJOR} detectado – usando '--frozen-lockfile --no-progress --non-interactive'"
        yarn install --frozen-lockfile --no-progress --non-interactive 2>&1 | tee -a "${LOG_FILE}"
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

instalar_dependencias   # <- agora captura stderr e não pede interação

# --------------------------- 3️⃣ LIMPAR BUILD ANTERIOR ---------------------------

log "🧹 Limpando artefatos de build anteriores…"

[[ -d ios/build ]] && { rm -rf ios/build && log "   • ios/build removida"; }
[[ -d .expo ]] && { rm -rf .expo && log "   • .expo removida"; }

DERIVED=$(find ~/Library/Developer/Xcode/DerivedData -maxdepth 1 -type d -name "$(basename "$(pwd)")*")
[[ -n "${DERIVED}" ]] && { rm -rf "${DERIVED}" && log "   • DerivedData (${DERIVED}) removida"; }

# ----- RESET DO CACHE DO METRO (fire‑and‑forget) -----
log "   • Resetando cache do Metro (modo background)"
npx expo start --clear --non-interactive >> "${LOG_FILE}" 2>&1 &
METRO_PID=$!
sleep 5   # geralmente suficiente
kill "$METRO_PID" 2>/dev/null || true
wait "$METRO_PID" 2>/dev/null || true
log "   • Cache do Metro limpo (processo $METRO_PID finalizado)"

# --------------------------- 4️⃣ PODS ---------------------------

log "🔧 Instalando/atualizando Pods…"
cd ios
pod install --repo-update >> "${LOG_FILE}" 2>&1
cd "${PROJECT_ROOT}"
log "✅ Pods instalados"

# --------------------------- 5️⃣ DETECTAR DISPOSITIVO ---------------------------

log "📱 Detectando iPhone conectado…"

get_device_id_idevice() { idevice_id -l | head -n1; }
get_device_name_system_profiler() { system_profiler SPUSBDataType | awk -F': +' '/iPhone/ {print $2; exit}'; }

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

# --------------------------- 6️⃣ BUILD (COM RETRY AUTOMÁTICO) ---------------------------

run_build() {
    local attempt="${1}"
    log "🛠️ Iniciando build (tentativa ${attempt}) com Expo (Yarn)…"
    local BUILD_CMD="npx expo run:ios --device \"${DEVICE_ID}\" --non-interactive"

    log "   • Executando: ${BUILD_CMD}"
    eval "${BUILD_CMD}" >> "${LOG_FILE}" 2>&1
    local exit_code=$?

    if (( exit_code == 0 )); then
        log "✅ Build concluída na tentativa ${attempt}."
        return 0
    fi

    # Detecta se o erro foi por migração do projeto
    if grep -qi "Xcode precisa de migração do projeto" "${LOG_FILE}" \
        || grep -qi "Projeto desatualizado" "${LOG_FILE}"; then
        log "⚠️ Detectado erro de migração do projeto."

        if (( attempt == 1 )); then
            log "🔁 Tentando migrar o projeto antes de refazer a build..."
            migrar_projeto_xcode || {
                die "Falha ao migrar o projeto automaticamente. Abra o Xcode manualmente."
            }
            return 2   # sinaliza que precisamos refazer a build
        else
            die "Mesmo após migração automática a build falhou. Verifique o log."
        fi
    else
        die "Build falhou (código ${exit_code}). Consulte o log."
    fi
}

# Executor (máximo de duas tentativas)
retry=1
while (( retry <= 2 )); do
    run_build "${retry}"
    status=$?
    if (( status == 0 )); then
        break               # sucesso
    elif (( status == 2 )); then
        ((retry++))        # migrou, tenta novamente
        continue
    else
        exit 1              # run_build já chamou die()
    fi
done

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
