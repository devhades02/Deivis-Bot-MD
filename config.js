// config.js — Deivis Bot
import { watchFile, unwatchFile } from 'fs';
import fs from 'fs';
import chalk from 'chalk';
import moment from 'moment-timezone';
import { fileURLToPath } from 'url';
import path, { join } from 'path';

// ─── Rutas globales ────────────────────────
global.__filename = fileURLToPath(import.meta.url);
global.__dirname = path.dirname(global.__filename);

// ─── Zona horaria ──────────────────────────
moment.locale('es');
process.env.TZ = 'America/Lima';

// ─── OWNER / STAFF ─────────────────────────
global.owner = [['5110201997', 'Hady', true]];   // Owner principal
global.mods = [];                                   // Moderadores (números sin +)
global.prems = [];                                  // Premiums desde config

// ─── BOT PRINCIPAL ─────────────────────────
global.packname = 'Deivis Bot';
global.author = 'Hady D\'xyz';
global.wm = 'Deivis Bot | Hady D\'xyz';
global.wm2 = '                   Deivis Bot ✨\n> ♡°• ⊹Dєivis Bot⊹ •°♡';
global.des = 'Deivis Bot - MD 🍀';
global.vs = 'V1.0';
global.library = 'Baileys';
global.baileys = '@whiskeysockets/baileys (wileys)';
global.lenguaje = 'Español';
global.dev = 'Hady D\'xyz';
global.devnum = '+51 929 264 225';

// ─── CONEXIÓN ──────────────────────────────
global.pairing_code = true;          // true = pairing code, false = QR
global.botNumberCode = '';          // número fijo (vacío → lo pide)
global.prefix = /^[.!?/]/i;         // prefijos aceptados

// ─── IMÁGENES DEL BOT ──────────────────────
global.menu = fs.readFileSync('./src/menu.jpg');   // menú principal
global.logo = fs.readFileSync('./src/ds.png');     // logo pequeño
global.imagen1 = global.menu;                      // alias
global.imagen2 = global.menu;
global.imagen3 = global.menu;
global.imagen4 = global.menu;

// ─── CANALES (newsletter) ──────────────────
global.ch = {
  ch1: '120363423925111802@newsletter',
};

// ─── ESTILOS DEL MENÚ ──────────────────────
global.dis = ':▸';
global.cen1 = '✣──╮';
global.cen2 = '╰──✣';

// ─── TIEMPO ────────────────────────────────
global.d = new Date(new Date() + 3600000);
global.locale = 'es';
global.dia = global.d.toLocaleDateString(global.locale, { weekday: 'long' });
global.fecha = global.d.toLocaleDateString('es', { day: 'numeric', month: 'numeric', year: 'numeric' });
global.mes = global.d.toLocaleDateString('es', { month: 'long' });
global.año = global.d.toLocaleDateString('es', { year: 'numeric' });
global.tiempo = global.d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });

// ─── READMORE ──────────────────────────────
global.readMore = String.fromCharCode(8206).repeat(850);

// ─── APIS (estructura base) ────────────────
global.APIs = {};
global.APIKeys = {};

// ─── SISTEMA RPG ───────────────────────────
global.multiplier = 150;   // exp necesaria = (nivel * multiplier) + 100
global.rpg = {
  emoticon(string) {
    string = string.toLowerCase();
    let emot = {
      level: '🏆',
      limit: '💎',
      exp: '⚡',
      money: '💰',
      potion: '🧪',
      pickaxe: '⛏️',
      diamond: '💎',
      health: '❤️',
    };
    let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string));
    if (!results.length) return '';
    else return emot[results[0][0]];
  }
};

// ─── HOT RELOAD ────────────────────────────
let file = global.__filename;
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.yellow('Se actualizó el archivo config.js'));
  import(`${file}?update=${Date.now()}`);
});