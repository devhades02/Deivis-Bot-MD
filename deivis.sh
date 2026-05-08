#!/bin/bash
# ═══════════════════════════════════════════════
#   DEIVIS BOT MD – Instalador Universal
#   Creado por Hady D'xyz (devhades02)
# ═══════════════════════════════════════════════
set -e

# ─── Colores ──────────────────────────────
R='\033[0;31m' G='\033[0;32m' Y='\033[1;33m'
C='\033[0;36m' M='\033[0;35m' W='\033[1;37m' N='\033[0m'

# ─── Banner ───────────────────────────────
clear
echo -e "${M}  ╔══════════════════════════════════════╗"
echo -e "  ║        DEIVIS BOT INSTALADOR        ║"
echo -e "  ║     by Hady D'xyz (devhades02)      ║"
echo -e "  ╚══════════════════════════════════════╝${N}"
sleep 0.5

# ─── Detectar entorno ─────────────────────
detectar_os() {
    if [ -d /data/data/com.termux ]; then
        OS="termux"
    elif [ "$(uname)" == "Darwin" ]; then
        OS="macos"
    elif [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
    else
        OS=$(uname -o)
    fi
    echo -e "${C}🖥️  Entorno: ${OS}${N}"
}

# ─── Instalar dependencias del sistema ────
instalar_sistema() {
    echo -e "${Y}📦 Verificando dependencias...${N}"
    case $OS in
        termux)
            pkg update -y && pkg upgrade -y
            pkg install -y nodejs ffmpeg git curl ;;
        *Ubuntu*|*Debian*)
            sudo apt update -y
            sudo apt install -y nodejs ffmpeg git curl ;;
        *CentOS*|*Fedora*|*RHEL*)
            sudo yum install -y nodejs ffmpeg git curl ;;
        macos)
            brew install node ffmpeg git curl ;;
    esac
    echo -e "${G}✅ Dependencias del sistema listas.${N}"
}

# ─── Instalar Yarn ────────────────────────
instalar_yarn() {
    if ! command -v yarn &> /dev/null; then
        echo -e "${Y}⚡ Instalando Yarn...${N}"
        npm install -g yarn
    fi
    echo -e "${G}✅ Yarn $(yarn -v)${N}"
}

# ─── Instalar dependencias del bot ────────
instalar_bot() {
    echo -e "${Y}📦 Instalando módulos con Yarn...${N}"
    yarn install
    echo -e "${G}✅ Módulos instalados.${N}"
}

# ─── Actualizar desde GitHub ──────────────
actualizar_bot() {
    echo -e "${Y}🔄 Actualizando repositorio...${N}"
    git pull
    echo -e "${Y}📦 Reinstalando dependencias...${N}"
    yarn install
    echo -e "${G}✅ Bot actualizado.${N}"
}

# ─── Iniciar bot ──────────────────────────
iniciar_bot() {
    echo -e "${C}🚀 Iniciando Deivis Bot...${N}"
    yarn start
}

# ─── Menú ─────────────────────────────────
menu() {
    echo ""
    echo -e "${W}Selecciona una opción:${N}"
    echo -e "  ${G}1${N}) Instalar todo y ejecutar"
    echo -e "  ${G}2${N}) Solo instalar dependencias"
    echo -e "  ${G}3${N}) Actualizar bot (git pull)"
    echo -e "  ${G}4${N}) Iniciar bot"
    echo -e "  ${G}5${N}) Salir"
    read -p "Opción [1-5]: " opcion

    case $opcion in
        1) detectar_os
           instalar_sistema
           instalar_yarn
           instalar_bot
           iniciar_bot ;;
        2) detectar_os
           instalar_yarn
           instalar_bot ;;
        3) actualizar_bot ;;
        4) iniciar_bot ;;
        5) echo -e "${C}¡Hasta luego!${N}"; exit 0 ;;
        *) echo -e "${R}Opción inválida.${N}"; menu ;;
    esac
}

# Ejecutar menú
menu