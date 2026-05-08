# 🤖 Deivis Bot

<div align="center">

```
██████╗ ███████╗██╗██╗   ██╗██╗███████╗    ██████╗  ██████╗ ████████╗
██╔══██╗██╔════╝██║██║   ██║██║██╔════╝    ██╔══██╗██╔═══██╗╚══██╔══╝
██║  ██║█████╗  ██║██║   ██║██║███████╗    ██████╔╝██║   ██║   ██║   
██║  ██║██╔══╝  ██║╚██╗ ██╔╝██║╚════██║    ██╔══██╗██║   ██║   ██║   
██████╔╝███████╗██║ ╚████╔╝ ██║███████║    ██████╔╝╚██████╔╝   ██║   
╚═════╝ ╚══════╝╚═╝  ╚═══╝  ╚═╝╚══════╝    ╚═════╝  ╚═════╝    ╚═╝   
```

**Bot de WhatsApp potente, rápido y fácil de instalar**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Bot-25D366?style=for-the-badge&logo=whatsapp)](https://wa.me/TUNUMERO)
[![GitHub](https://img.shields.io/badge/GitHub-DeivisBot-181717?style=for-the-badge&logo=github)](https://github.com/Hadyxyz/DeivisBot)
[![Termux](https://img.shields.io/badge/Termux-Compatible-black?style=for-the-badge&logo=android)](https://f-droid.org/packages/com.termux/)

</div>

---

## 📌 Índice

- [✨ Características](#-características)
- [📋 Requisitos](#-requisitos)
- [📱 Instalación en Termux](#-instalación-en-termux)
- [🖥️ Instalación en Servidor Linux](#️-instalación-en-servidor-linux)
- [🚀 Iniciar el Bot](#-iniciar-el-bot)
- [🔗 Vincular con WhatsApp](#-vincular-con-whatsapp)
- [👨‍💻 Creador](#-creador)

---

## ✨ Características

- ⚡ Rápido y ligero
- 📲 Compatible con Termux y servidores Linux
- 🔒 Vinculación segura con código de 8 dígitos
- 🎵 Soporte multimedia con FFmpeg
- 🤖 Comandos inteligentes y personalizables
- 🌐 Conexión estable con reconexión automática

---

## 📋 Requisitos

| Requisito | Versión mínima |
|-----------|---------------|
| Node.js   | 18+           |
| Git       | Cualquiera    |
| Yarn      | 1.x o 3.x     |
| FFmpeg    | Cualquiera    |
| Internet  | Estable       |

---

## 📱 Instalación en Termux

> ⚠️ **Importante:** Descarga Termux desde [F-Droid](https://f-droid.org/packages/com.termux/), **NO** desde Play Store.

### Paso 1 — Actualizar paquetes

```bash
pkg update -y && pkg upgrade -y
```

### Paso 2 — Instalar dependencias

```bash
pkg install -y nodejs git ffmpeg curl
```

### Paso 3 — Instalar Yarn

```bash
npm install -g yarn
```

### Paso 4 — Clonar el repositorio

```bash
cd ~
git clone https://github.com/Hadyxyz/DeivisBot.git
cd DeivisBot
```

### Paso 5 — Ejecutar el instalador

> ⚠️ Si `./deivis.sh` da error de permisos, usa `bash` directamente:

```bash
bash deivis.sh
```

> *(Opcional)* Si quieres ejecutarlo con `./`:
> ```bash
> chmod +x deivis.sh
> ./deivis.sh
> ```

### Paso 6 — Seleccionar opción 1

El menú te preguntará qué acción realizar.
Selecciona **`1`** → *Instalar todo y ejecutar*.

El script correrá `yarn install` y luego iniciará el bot automáticamente.

---

## 🖥️ Instalación en Servidor Linux

### Paso 1 — Actualizar el sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### Paso 2 — Instalar Node.js (v18+)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Paso 3 — Instalar dependencias del sistema

```bash
sudo apt install -y git ffmpeg curl
```

### Paso 4 — Instalar Yarn

```bash
npm install -g yarn
```

### Paso 5 — Clonar el repositorio

```bash
cd ~
git clone https://github.com/Hadyxyz/DeivisBot.git
cd DeivisBot
```

### Paso 6 — Dar permisos e instalar

```bash
chmod +x deivis.sh
bash deivis.sh
```

---

## 🚀 Iniciar el Bot

Si prefieres iniciar manualmente sin el script:

```bash
yarn install
yarn start
```

---

## 🔗 Vincular con WhatsApp

1. Al iniciar por primera vez, el bot pedirá tu **número de teléfono** del bot.
   > Ejemplo: `51910201997`

2. Recibirás un **código de vinculación de 8 dígitos**.

3. En WhatsApp ve a:
   > ⚙️ **Ajustes → Dispositivos vinculados → Vincular un dispositivo**

4. Ingresa el código de 8 dígitos.

5. ✅ ¡Listo! El bot estará activo y listo para recibir comandos.

---

## ⚠️ Solución de Problemas

### Permission denied en el script

```bash
# Solución: ejecuta siempre con bash
bash deivis.sh
```

### El script está corrupto o vacío

```bash
nano deivis.sh
# Pega el contenido del script
# Guarda: Ctrl+O → Enter
# Sale: Ctrl+X
bash deivis.sh
```

### El bot se desconecta solo

Verifica tu conexión a internet y vuelve a ejecutar:

```bash
bash deivis.sh
```

---

## 👨‍💻 Creador

<div align="center">

Hecho con ❤️ por **Deivis**

[![WhatsApp](https://img.shields.io/badge/Contactar%20al%20Creador-WhatsApp-25D366?style=for-the-badge&logo=whatsapp)](https://wa.me/TUNUMERO)
[![GitHub](https://img.shields.io/badge/GitHub-Hadyxyz-181717?style=for-the-badge&logo=github)](https://github.com/Hadyxyz)

> 📝 *Si tienes dudas, sugerencias o quieres reportar un bug, escríbeme directamente por WhatsApp.*

</div>

---

<div align="center">

⭐ **Si te gustó el bot, dale una estrella al repositorio** ⭐

[![Star on GitHub](https://img.shields.io/github/stars/Hadyxyz/DeivisBot?style=social)](https://github.com/Hadyxyz/DeivisBot)

</div>
