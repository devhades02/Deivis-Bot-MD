/**
 * •• DEIVIS BOT MD ••
 * @param: Código inspirado en GataNina-Li. Deivis-Bot creado por Devhady.
 */

import { watchFile, unwatchFile, existsSync, readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';
import { platform } from 'process';
import pino from 'pino';
import chalk from 'chalk';
import readline from 'readline';
import { Boom } from '@hapi/boom';
import cfonts from 'cfonts';
import moment from 'moment-timezone';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { handler } from './handler.js';
import './config.js';
import baileysPkg from '@whiskeysockets/baileys';
const {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  Browsers,               // ← Importante para la conexión original
  makeInMemoryStore,      // ← Para la store (igual que en el original)
  delay
} = baileysPkg;

protoType();
serialize();

moment.locale('es');
process.env.TZ = 'America/Lima';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear carpetas necesarias si no existen
['session', 'tmp', 'plugins'].forEach(dir => {
  const dirPath = join(__dirname, dir);
  if (!existsSync(dirPath)) mkdirSync(dirPath, { recursive: true });
});

// ─── OPCIONES GLOBALES ────────────────────
global.opts = {
  self: process.argv.includes('--self'),
  pconly: process.argv.includes('--pconly'),
  gconly: process.argv.includes('--gconly'),
  swonly: process.argv.includes('--swonly'),
  test: process.argv.includes('--test'),
  autoread: process.argv.includes('--autoread'),
  noprint: process.argv.includes('--noprint'),
  nyimak: process.argv.includes('--nyimak'),
  restrict: process.argv.includes('--restrict'),
  queque: process.argv.includes('--queque'),
  legacy: process.argv.includes('--legacy'),
};

// ─── SOPORTE PARA STICKERS ────────────────
global.support = {
  ffmpeg: true,
  ffprobe: true,
  ffmpegWebp: true,
  convert: true,
  magick: false,
  gm: false,
  find: false
};

// ─── BASE DE DATOS ────────────────────────
global.db = {
  users: {},
  chats: {},
  stats: {},
  msgs: {},
  sticker: {},
  settings: {},
  ...(existsSync('./lib/database.json') ? JSON.parse(readFileSync('./lib/database.json', 'utf-8')) : {})
};

setInterval(async () => {
  if (global.db) {
    const fs = await import('fs');
    fs.promises.writeFile('./lib/database.json', JSON.stringify(global.db, null, 2));
  }
}, 30 * 1000);

// ─── LIMPIEZA DE TMP ─────────────────────
setInterval(() => {
  const tmpDir = join(__dirname, 'tmp');
  if (existsSync(tmpDir)) {
    import('fs').then(fs => {
      const files = fs.readdirSync(tmpDir);
      files.forEach(file => {
        try { fs.unlinkSync(join(tmpDir, file)); } catch {}
      });
    });
  }
}, 5 * 60 * 1000);

// ─── FUNCIÓN PRINCIPAL ────────────────────
async function startBot() {
  console.clear();

  // Banner limpio
  cfonts.say('DEIVIS BOT', {
    font: 'block',
    align: 'left',
    gradient: ['#FF0000', '#FF7F00', '#FFFF00'],
    background: 'transparent',
    letterSpacing: 2,
    lineHeight: 1,
    space: false,
    maxLength: '0'
  });
  console.log(chalk.hex('#FFD700').bold(`  Creador: Hady D'xyz (devhades02)`));
  console.log(chalk.hex('#FF69B4')(`  ${moment().format('LLLL')}`));
  console.log();

  // ─── STORE (igual que en el original) ────
  const store = makeInMemoryStore({
    logger: pino().child({ level: 'silent', stream: 'store' })
  });

  // ─── AUTENTICACIÓN ──────────────────────
  const sessionDir = join(__dirname, 'session');
  if (!existsSync(sessionDir)) mkdirSync(sessionDir, { recursive: true });
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const { version } = await fetchLatestBaileysVersion();

  // ─── CONEXIÓN (configuración original de wileys) ──
  const sock = makeWASocket({
    version,
    printQRInTerminal: !global.pairing_code,
    logger: pino({ level: 'silent' }),
    auth: state,
    browser: Browsers.ubuntu('Chrome'),   // ← como en el original
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => store.loadMessage(key.remoteJid, key.id, undefined)?.message,
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 25000,
    maxIdleTimeMs: 60000,
    emitOwnEvents: true,
    defaultQueryTimeoutMs: 60000,
  });

  global.conn = sock;

  // ─── PAIRING CODE ───────────────────────
  if (global.pairing_code && !sock.authState.creds.registered) {
    console.log(chalk.cyan('🔐 Modo Pairing Code activado'));
    const botNumberEnv = process.env.BOT_NUMBER || global.botNumberCode;
    let phoneNumber = botNumberEnv ? botNumberEnv.replace(/[^0-9]/g, '') : null;

    if (!phoneNumber) {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      const question = (text) => new Promise(resolve => rl.question(text, resolve));
      console.log(chalk.white('Ingresa el número de WhatsApp para el bot (ej: 51999999999):'));
      phoneNumber = await question('> ');
      rl.close();
      phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
      if (!phoneNumber) {
        console.log(chalk.red('❌ Número inválido'));
        process.exit(1);
      }
    }

    try {
      const code = await sock.requestPairingCode(phoneNumber);
      console.log(chalk.green('┌────────────────────────────────────────┐'));
      console.log(chalk.green('│           PAIRING CODE                 │'));
      console.log(chalk.green('├────────────────────────────────────────┤'));
      console.log(chalk.white.bold(`│           ${code}          │`));
      console.log(chalk.green('└────────────────────────────────────────┘'));
      console.log(chalk.yellow('\n📱 Ingresa este código en WhatsApp > Dispositivos vinculados'));
    } catch (e) {
      console.error(chalk.red('❌ Error al generar el pairing code:'), e.message);
      process.exit(1);
    }
  }

  // ─── MANEJO DE CONEXIÓN (reconexión progresiva como en el original) ──
  let reconnecting = false;
  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 10;
  const RECONNECT_BASE_DELAY = 5000;

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) console.log(chalk.yellow('📲 Escanea el QR'));

    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      console.log(chalk.red(`❌ Conexión cerrada (${reason})`));

      if (reason === DisconnectReason.loggedOut) {
        console.log(chalk.red('Sesión eliminada. Borra la carpeta session'));
        process.exit(0);
      }

      if (!reconnecting) {
        reconnecting = true;
        reconnectAttempts++;
        const baseDelay = Math.min(RECONNECT_BASE_DELAY * Math.pow(1.5, reconnectAttempts), 60000);
        const jitter = Math.random() * 2000;
        const delayTime = baseDelay + jitter;

        console.log(chalk.yellow(`🔄 Reintento ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} en ${Math.round(delayTime / 1000)}s...`));

        setTimeout(async () => {
          try {
            await startBot();
          } catch (e) {
            console.error('❌ Reconnect failed:', e.message);
          } finally {
            reconnecting = false;
          }
        }, delayTime);
      }
    }

    if (connection === 'open') {
      reconnectAttempts = 0;
      console.clear();
      console.log(chalk.green('⚡ Conectado exitosamente'));
      const userJid = sock.user?.id?.split(':')[0] || 'Desconocido';
      console.log(chalk.cyan(`👤 ${global.packname || 'Deivis Bot'}`));
      console.log(chalk.cyan(`🔢 ${userJid}`));
      console.log(chalk.cyan(`⏰ ${moment().format('DD/MM/YYYY hh:mm A')}`));
      console.log(chalk.yellow('🚀 Listo para recibir mensajes\n'));
      global.uptime = Date.now();
    }
  });

  // ─── VINCULAR STORE ─────────────────────
  await store.bind(sock.ev);

  // ─── EVENTOS DEL HANDLER ──────────────
  sock.ev.on('messages.upsert', ({ messages }) => handler(messages));
  sock.ev.on('group-participants.update', handler.participantsUpdate);
  sock.ev.on('groups.update', handler.groupsUpdate);
  sock.ev.on('message.delete', handler.deleteUpdate);
  sock.ev.on('call', handler.callUpdate);

  // Queue de mensajes
  const userQueues = {};
  const oriSend = sock.sendMessage.bind(sock);
  sock.sendMessage = async (jid, content, options) => {
    if (!userQueues[jid]) userQueues[jid] = Promise.resolve();
    userQueues[jid] = userQueues[jid].then(() =>
      Promise.race([
        oriSend(jid, content, options),
        new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout sendMessage')), 15000))
      ]).catch(err => console.error('Error enviando mensaje:', err.message))
    );
    return userQueues[jid];
  };

  return sock;
}

// ─── RECARGA DEL HANDLER ──────────────────
global.reloadHandler = async function() {
  const handlerPath = `./handler.js?update=${Date.now()}`;
  await import(handlerPath);
  console.log(chalk.green('♻️ Handler recargado.'));
};

// ─── INICIO CON CONTROL DE ERRORES ───────
startBot().catch(err => {
  console.error(chalk.red('Error fatal al iniciar:'), err);
  setTimeout(startBot, 10000);
});

// Hot reload del index
let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.yellow('⚡ index.js actualizado, reiniciando...'));
  process.exit(0);
});