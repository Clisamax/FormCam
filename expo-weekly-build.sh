#!/usr/bin/env bash
# --------------------------------------------------------------
#  expo‑weekly‑build.sh – versão “pronta‑para‑uso” em macOS Apple Silicon
#  • Limpeza paralela ultra‑rápida (mv → staging + rm em background)
#  • Usa o Development Team (DEVELOPMENT_TEAM) que você informa abaixo
#  • Compila usando todos os núcleos da M‑series
#  • Cache inteligente de Yarn + Pods (re‑instala só se lock‑files mudarem)
# --------------------------------------------------------------

set -euo pipefail
IFS=$'\n\t'

# -------------------------- VARIÁVEIS GLOBAIS -------------------------
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${PROJECT_ROOT}/logs"
TIMESTAMP="$(date +%F_%H-%M-%S)"
LOG_FILE="${LOG_DIR}/weekly-build-${TIMESTAMP}.log"

# <<<---- 1️⃣ INFORME seu Team ID aqui (10 caracteres) -----------------
# Exemplo obtido no Xcode > Preferences > Accounts ou no portal
DEVELOPMENT_TEAM="VW658NV936"
# --------------------------------------------------------------------
DEVICE_ID="${DEVICE_ID:-00008120-000A7C400A05A01E}"   # UDID do iPhone conectado
SKIP_METRO_RESET="${SKIP_METRO_RESET:-0}"

# -------------------------- LOG & ERRO ------------------------------
log() {
  [[ -d "${LOG_DIR}" ]] || mkdir -p "${LOG_DIR}"
  local now
  now=$(date '+%Y-%m-%d %H:%M:%S')
  printf "[%s] %s\n" "$now" "$*" | tee -a "${LOG_FILE}"
}
die() { log "❌ ERRO: $*" && exit 1; }

run_and_log() {
  local cmd=("$@")
  log "   • Executando: ${cmd[*]}"
  "${cmd[@]}" 2>&1 | tee -a "${LOG_FILE}"
}

# -------------------------- PRE‑CHECKS ----------------------------
log "🚀 Iniciando script – ${TIMESTAMP}"

# Node
command -v node >/dev/null || die "Node.js não encontrado."
log "✅ Node $(node -v) OK"

# Yarn
command -v yarn >/dev/null || die "Yarn não encontrado."
log "✅ Yarn $(yarn -v) OK"

# Xcode
command -v xcodebuild >/dev/null || die "Xcode não encontrado."
log "✅ Xcode $(xcodebuild -version | awk 'NR==1{print $2}') OK"

# CocoaPods
command -v pod >/dev/null || die "CocoaPods não encontrado."
log "✅ CocoaPods $(pod --version) OK"

# libimobiledevice (idevicepair)
if command -v idevicepair >/dev/null; then
  log "✅ libimobiledevice (idevicepair) disponível"
  HAVE_IDEVICE=1
else
  log "⚠️ libimobiledevice ausente – algumas verificações poderão ser limitadas."
  HAVE_IDEVICE=0
fi

# -------------------------- DETECÇÃO DO EXPPO --------------------
if [[ -x "${PROJECT_ROOT}/node_modules/.bin/expo" ]]; then
  EXPO_CMD="${PROJECT_ROOT}/node_modules/.bin/expo"
else
  EXPO_CMD="npx expo"
fi

# -------------------------- VERIFICAÇÃO DO TEAM ----------------
[[ -n "${DEVELOPMENT_TEAM}" ]] || die "⚠️ DEVELOPMENT_TEAM está vazio. Preencha a variável no script."
log "✅ DEVELOPMENT_TEAM definido: $DEVELOPMENT_TEAM"

# ---------------------------------------------------------
#  Garantir que o .pbxproj está na versão corrente do Xcode
# ---------------------------------------------------------
ensure_project_upgraded() {
  local ws_path="${PROJECT_ROOT}/ios/FormCam.xcworkspace"
  local scheme="FormCam"

  # Tenta forçar a leitura do projeto com xcodebuild.
  # -dry-run não compila, mas faz o Xcode atualizar o formato se precisar.
  if ! xcodebuild -workspace "$ws_path" \
                   -scheme "$scheme" \
                   -allowProvisioningUpdates \
                   -quiet \
                   -dry-run \
      >/dev/null 2>&1; then
    log "⚠️ Xcode precisa de migração do projeto. Abra a workspace manualmente e aceite a atualização."
    log "   👉 Execute: open \"$ws_path\" e clique em “Use the version on disk”."
    die "Projeto desatualizado – interrompendo para correção manual."
  else
    log "✅ Projeto já está na versão correta do Xcode."
  fi
}

# Chame isso antes de qualquer coisa que invoque xcodebuild:
ensure_project_upgraded


# -------------------------- FUNÇÃO LIMPA TUDO (rápida) -----------------
clean_all_fast() {
  log "🧹 Iniciando limpeza rápida dos artefatos da build anterior…"

  # ----- remoção assíncrona com prioridade baixa (nice) -----
  rm_async() {
    local target="$1"
    [[ -e "$target" ]] || return 0

    # 1️⃣ Move para um diretório temporário (rename O(1) no APFS)
    local staging="${TMPDIR:-/tmp}/expo-clean-$(basename "$target")-$$"
    mv "$target" "$staging" 2>/dev/null || {
      nice -n 20 rm -rf "$target" &
      return 0
    }

    # 2️⃣ Apaga o staging em background, também com nice
    nice -n 20 rm -rf "$staging" &
    log "   • $target → $staging (remoção async iniciada)"
  }

  # ----- diretórios que realmente precisam ser apagados -----
  to_clean=(
    "${PROJECT_ROOT}/node_modules"
    "${PROJECT_ROOT}/ios/Pods"
    "${PROJECT_ROOT}/ios/Podfile.lock"
    "${PROJECT_ROOT}/ios/build"
    "${PROJECT_ROOT}/.expo"
  )

  # DerivedData apenas do projeto (evita varredura desnecessária)
  derived_path=$(find ~/Library/Developer/Xcode/DerivedData -maxdepth 1 \
                 -type d -name "$(basename "$PROJECT_ROOT")*" -print -quit 2>/dev/null || true)
  [[ -n "$derived_path" ]] && to_clean+=("$derived_path")

  # ----- paralelismo: usa todos os núcleos da M‑series -----
  max_jobs=$(sysctl -n hw.ncpu)   # ex.: 8, 10, 12 …
  log "   • Jobs paralelos permitidos: $max_jobs"

  for dir in "${to_clean[@]}"; do
    rm_async "$dir" &
    while (( $(jobs -r | wc -l) >= max_jobs )); do sleep 0.1; done
  done

  log "   • Aguardando finalização das remoções async…"
  wait   # espera todos os rm -rf em background
  log "✅ Limpeza rápida concluída."
}

# -------------------------- FUNÇÃO INSTALA DEPENDÊNCIAS (Yarn) ----------
install_deps() {
  log "📦 Instalando dependências JavaScript (Yarn)…"
  if [[ -f "${PROJECT_ROOT}/yarn.lock" && -f "${PROJECT_ROOT}/.last-yarn.lock" && \
        "$(shasum -a 256 "${PROJECT_ROOT}/yarn.lock")" == "$(cat "${PROJECT_ROOT}/.last-yarn.lock")" ]]; then
    log "🔄 yarn.lock inalterado – pulando yarn install."
  else
    cd "$PROJECT_ROOT"
    yarn install --frozen-lockfile >> "$LOG_FILE" 2>&1
    shasum -a 256 yarn.lock > "${PROJECT_ROOT}/.last-yarn.lock"
    log "✅ Yarn install concluído."
  fi
}

# -------------------------- FUNÇÃO expo‑doctor ----------
run_expo_doctor() {
  log "🩺 Executando expo‑doctor..."
  if ! command -v expo-doctor >/dev/null; then
    log "⚡ expo‑doctor ausente – instalando como dev‑dependency"
    run_and_log yarn add -D expo-doctor
  fi
  run_and_log npx expo-doctor
  log "✅ expo‑doctor finalizado sem erros críticos."
}

# -------------------------- FUNÇÃO INSTALA PODS (cache de lock‑file) ----------
install_pods() {
  log "📦 Instalando pods iOS…"

  if [[ -f "${PROJECT_ROOT}/ios/Podfile.lock" && -f "${PROJECT_ROOT}/.last-Podfile.lock" && \
        "$(shasum -a 256 "${PROJECT_ROOT}/ios/Podfile.lock")" == "$(cat "${PROJECT_ROOT}/.last-Podfile.lock")" ]]; then
    log "🔄 Podfile.lock inalterado – pulando pod install."
  else
    # Se houver app config, gera o Podfile via prebuild (necessário para expo‑bare)
    if [[ -f "${PROJECT_ROOT}/app.json" || -f "${PROJECT_ROOT}/app.config.js" || \
          -f "${PROJECT_ROOT}/app.config.ts" ]]; then
      cd "$PROJECT_ROOT"
      log "   • Rodando expo prebuild --clean…"
      run_and_log npx expo prebuild --clean
    else
      log "⚠️ Nenhum app config encontrado – pulando expo prebuild."
    fi

    cd "${PROJECT_ROOT}/ios"
    run_and_log pod install --repo-update
    cd "$PROJECT_ROOT"
    shasum -a 256 ios/Podfile.lock > "${PROJECT_ROOT}/.last-Podfile.lock"
    log "✅ Pods instalados."
  fi
}
# -------------------------------------------------------------
#  FUNÇÃO: TESTA COMPILAÇÃO COM xcodebuild (full‑featured)
# -------------------------------------------------------------
test_xcodebuild() {
  log "🔎 Testando compilação com xcodebuild (Debug)…"
  cd "${PROJECT_ROOT}/ios"

  # 1️⃣ Exporta as configurações de build (útil para debug)
  run_and_log xcodebuild \
        -workspace FormCam.xcworkspace \
        -scheme FormCam \
        -configuration Debug \
        -sdk iphoneos \
        -showBuildSettings -json \
        > "${LOG_DIR}/build-settings.json"

  # 2️⃣ Build real – paralelismo + provisionamento automático
  #    *NÃO* usamos -teamID aqui – o Xcode já tem o DEVELOPMENT_TEAM no pbxproj
  run_and_log xcodebuild \
        -workspace FormCam.xcworkspace \
        -scheme FormCam \
        -configuration Debug \
        -sdk iphoneos \
        -derivedDataPath "${PROJECT_ROOT}/ios/build" \
        -jobs "$(sysctl -n hw.ncpu)" \
        -allowProvisioningUpdates \
        -quiet \
        -showBuildTimingSummary \
        clean build

  cd "$PROJECT_ROOT"
  log "✅ xcodebuild terminou sem erros."
}


# -------------------------- FUNÇÃO Garante que o dispositivo está visível -----------------
ensure_device_visible() {
  local udid="$1"
  local timeout=45 step=5 elapsed=0

  if xcrun xctrace list devices | grep -q "$udid"; then
    log "✅ UDID $udid já está visível para o Xcode."
    return 0
  fi

  if (( HAVE_IDEVICE )); then
    log "🔗 Pareando dispositivo via idevicepair..."
    idevicepair pair || log "⚠️ Falha ao parear – continuando."
  else
    log "⚠️ idevicepair indisponível – pulando pareamento."
  fi

  log "🔄 Reiniciando daemon usbmuxd…"
  launchctl kickstart -k system/com.apple.usbmuxd 2>/dev/null || {
    log "⚠️ launchctl falhou – usando sudo killall"
    sudo killall -9 usbmuxd 2>/dev/null || true
  }
  sleep 3

  while (( elapsed < timeout )); do
    if xcrun xctrace list devices | grep -q "$udid"; then
      log "✅ UDID $udid agora visível (após ${elapsed}s)."
      return 0
    fi
    (( elapsed += step ))
    log "⏳ Aguardando Xcode reconhecer o UDID… (${elapsed}s)"
    sleep "$step"
  done

  die "❌ UDID $udid não apareceu no Xcode após ${timeout}s."
}

# -------------------------- FUNÇÃO BUILD FINAL COM expo run:ios ----------
run_expo_build() {
  log "🛠️ Iniciando build iOS com Expo…"
  ensure_device_visible "$DEVICE_ID"

  # Passa a Development Team para o expo run (ele a repassa ao xcodebuild interno)
  run_and_log "$EXPO_CMD" run:ios --device "$DEVICE_ID" --non-interactive \
                --team-id "$DEVELOPMENT_TEAM"
  log "✅ Build concluída! O app foi instalado no dispositivo ${DEVICE_ID}."
}

# -------------------------- FLUXO PRINCIPAL -------------------------
log "🚀 Script iniciado – ${TIMESTAMP}"

if [[ "${1:-}" == "fast" ]]; then
  log "⚡ MODO FAST – pulando limpeza/re‑install, usando artefatos existentes."
else
	ensure_project_upgraded 
  clean_all_fast
  install_deps
  run_expo_doctor
  install_pods
  test_xcodebuild
fi

# Build final (sempre executado)
run_expo_build

# -------------------------- NOTIFICAÇÕES (opcional) -----------------
if [[ -n "${EMAIL_NOTIF:-}" ]]; then
  echo -e "Subject: [Expo Build] Sucesso\n\nBuild concluída em $(date).\nLog: ${LOG_FILE}" \
    | /usr/sbin/sendmail "${EMAIL_NOTIF}"
fi
if [[ -n "${SLACK_WEBHOOK:-}" ]]; then
  payload=$(printf '{"text":"✅ *Expo Build* concluída em %s"}' "$(date '+%Y-%m-%d %H:%M')")
  curl -s -X POST -H 'Content-type: application/json' --data "${payload}" "${SLACK_WEBHOOK}" >/dev/null
fi

log "🏁 Script finalizado."
exit 0
