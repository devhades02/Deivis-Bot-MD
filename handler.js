// handler.js
import { smsg } from './lib/simple.js';
import { format } from 'util';
import { fileURLToPath } from 'url';
import path, { join } from 'path';
import { unwatchFile, watchFile, readdirSync, existsSync, watch } from 'fs';
import chalk from 'chalk';
import moment from 'moment-timezone';
import './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── PLUGINS ──────────────────────────────
global.plugins = {};
const pluginFolder = join(__dirname, './plugins');

function loadPlugins() {
  if (!existsSync(pluginFolder)) return;
  const files = readdirSync(pluginFolder).filter(f => f.endsWith('.js'));
  const total = files.length;
  let shown = 0;
  const maxShow = 5;

  for (const filename of files) {
    try {
      loadPlugin(filename);
      shown++;
      if (shown <= maxShow) {
        console.log(chalk.green(`  ✓ ${filename}`));
      }
    } catch (e) {
      console.error(chalk.red(`  ✗ Error cargando ${filename}:`), e);
    }
  }

  if (total > maxShow) {
    console.log(chalk.cyan(`✨ ${maxShow} mostrados • ${total - maxShow} más (${total} plugins en total)`));
  } else if (total > 0) {
    console.log(chalk.cyan(`✨ ${total} plugins cargados correctamente.`));
  }
}

async function loadPlugin(filename) {
  const filePath = join(pluginFolder, filename);
  const { default: plugin } = await import(`file://${filePath}?update=${Date.now()}`);
  if (plugin) global.plugins[filename] = plugin;
}

function unloadPlugin(filename) {
  if (global.plugins[filename]) {
    delete global.plugins[filename];
    console.log(chalk.yellow(`  ✗ Plugin eliminado: ${filename}`));
  }
}

function watchPlugins() {
  if (!existsSync(pluginFolder)) return;
  watch(pluginFolder, (eventType, filename) => {
    if (!filename || !filename.endsWith('.js')) return;
    if (eventType === 'change' || eventType === 'rename') {
      if (existsSync(join(pluginFolder, filename))) loadPlugin(filename);
      else unloadPlugin(filename);
    }
  });
}

loadPlugins();
watchPlugins();

// ─── VARIABLES GLOBALES ──────────────────
global.db = global.db || { users: {}, chats: {}, settings: {} };
global.owner = global.owner || [['51929264225', 'Hady', true]];
global.mods = global.mods || [];
global.prems = global.prems || [];
global.uptime = Date.now();
global.stats = { cmds: 0, msgs: 0 };
global.subbots = global.subbots || [];

const isNumber = x => typeof x === 'number' && !isNaN(x);

// ─── HANDLER PRINCIPAL ───────────────────
export async function handler(chatUpdate) {
  if (!chatUpdate) return;
  let m = Array.isArray(chatUpdate) ? chatUpdate[0] : chatUpdate.messages?.[0];
  if (!m || !m.message) return;

  try {
    m = smsg(global.conn, m);
    if (!m) return;
    if (!m.chat || !m.sender) return;

    const conn = m.conn || global.conn;
    global.stats.msgs++;

    // ─── OBTENER METADATA DEL GRUPO (si aplica) ──
    if (m.isGroup) {
      m.metadata = await conn.groupMetadata(m.chat).catch(_ => null) || {};
    } else {
      m.metadata = {};
    }

    // ─── INICIALIZAR USUARIO ──────────────────
    let user = global.db.users[m.sender];
    if (typeof user !== 'object') global.db.users[m.sender] = {};
    user = global.db.users[m.sender];
    if (!user) {
      global.db.users[m.sender] = {
        exp: 0, money: 10, level: 0, role: '♛ Novato',
        premium: false, banned: false, warn: 0, registered: false,
        diamond: 0, afk: -1, afkReason: '',
        lastMineDate: '', mineCount: 0, lastDaily: '',
        pickaxe: 1,
      };
      user = global.db.users[m.sender];
    }

    // ─── EXPERIENCIA ─────────────────────────
    m.exp = Math.ceil(Math.random() * 4) + 1;
    user.exp = (user.exp || 0) + m.exp;
    let expNecesaria = (user.level || 0) * 150 + 100;
    while (user.exp >= expNecesaria && expNecesaria > 0) {
      user.exp -= expNecesaria;
      user.level += 1;
      if (user.level >= 20) user.role = '♛ Leyenda';
      else if (user.level >= 15) user.role = '♛ Maestro';
      else if (user.level >= 10) user.role = '♛ Experto';
      else if (user.level >= 5) user.role = '♛ Aprendiz';
      else user.role = '♛ Novato';
      expNecesaria = user.level * 150 + 100;
    }

    // Anti spam
    const now = Date.now();
    if (user.lastMsg && now - user.lastMsg < 2000) return;
    user.lastMsg = now;

    // AFK
    if (user.afk > 0 && !m.fromMe) {
      let reason = user.afkReason || 'sin motivo';
      if (!user.afkNotified) {
        await m.reply(`👤 @${m.sender.split('@')[0]} está *AFK*.\n📝 Motivo: ${reason}`, { mentions: [m.sender] });
        user.afkNotified = true;
      }
    }
    if (user.afk > 0 && m.key.fromMe) {
      user.afk = -1; user.afkReason = '';
      m.reply('✅ Has vuelto, tu AFK ha sido desactivado.');
    }

    // Anti link
    let chat = global.db.chats[m.chat] || {};
    if (m.isGroup && chat?.antiLink && !m.fromMe && !m.isAdmin) {
      if (/(https?:\/\/)/gi.test(m.text)) {
        await conn.sendMessage(m.chat, { delete: m.key });
        return m.reply('❌ Los enlaces están prohibidos en este grupo.');
      }
    }

    // Reacción aleatoria
    if (chat?.reaction && m.text && !m.fromMe) {
      if (/(ción|dad|aje|oso|izar|mente|pero|tion|age|ous|ate|and|but|ify)/gi.test(m.text)) {
        const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];
        await conn.sendMessage(m.chat, { react: { text: emojis[Math.floor(Math.random() * emojis.length)], key: m.key } });
      }
    }

    // Plugins "all"
    for (let name in global.plugins) {
      let plugin = global.plugins[name];
      if (plugin?.all && typeof plugin.all === 'function') {
        try { await plugin.all.call(conn, m, { chatUpdate, __dirname }); } catch (e) { console.error(e); }
      }
    }

    // ─── COMANDOS ─────────────────────────────
    const prefix = global.prefix || /^[.!?/]/i;
    if (m.text && prefix.test(m.text)) {
      let usedPrefix = m.text.match(prefix)[0];
      let noPrefix = m.text.replace(usedPrefix, '');
      let [command, ...args] = noPrefix.split(/ +/);
      command = command.toLowerCase();
      let text = args.join(' ');

      for (let name in global.plugins) {
        let plugin = global.plugins[name];
        if (!plugin || !plugin.command) continue;
        let isMatch = Array.isArray(plugin.command)
          ? plugin.command.includes(command)
          : plugin.command === command;
        if (!isMatch) continue;

        // Permisos
        const isROwner = [conn.decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)]
          .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
        const isOwner = isROwner || m.fromMe;
        const isMod = isOwner || global.mods?.some(mod => mod === m.sender.split('@')[0]);
        const isPrems = isROwner || user.premiumTime > 0 || user.premiumTime === -1;

        // Ahora usamos m.isAdmin y m.isBotAdmin que se calculan con los getters
        const isAdmin = m.isAdmin;
        const isBotAdmin = m.isBotAdmin;

        const publicCommands = ['menu', 'ayuda', 'comandos', 'help', 'reg', 'registrar', 'verificar', 'register', 'ping', 'owner'];
        if (!user.registered && !publicCommands.includes(command) && !isOwner && !isMod) {
          return m.reply('❌ Debes registrarte primero. Usa *.reg Nombre.Edad* para registrarte.');
        }

        if (plugin.owner && !isOwner) return m.reply('❌ Solo el creador puede usar este comando');
        if (plugin.mods && !isMod) return m.reply('❌ Solo los moderadores pueden usar este comando');
        if (plugin.group && !m.isGroup) return m.reply('❌ Solo funciona en grupos');
        if (plugin.premium && !isPrems) return m.reply('❌ Necesitas ser premium');
        if (plugin.admin && !isAdmin) return m.reply('❌ Solo administradores');
        if (plugin.botAdmin && !isBotAdmin) return m.reply('❌ El bot necesita ser admin');

        if (typeof plugin.before === 'function') {
          if (await plugin.before.call(conn, m, { conn, usedPrefix, isOwner, isROwner, isMod, isAdmin, isBotAdmin, isPrems }) === false) continue;
        }

        try {
          global.stats.cmds++;
          console.log(chalk.yellow(`⌨️ Comando: ${command} | Plugin: ${name}`));
          await plugin(m, { conn, args, command, text, usedPrefix, isOwner, isROwner, isMod, isPrems });
        } catch (e) {
          console.error(chalk.red(`Error en comando ${command}:`, e));
          m.reply('❌ Error al ejecutar el comando');
        }

        if (typeof plugin.after === 'function') {
          try { await plugin.after.call(conn, m, { conn, args, command, text, usedPrefix, isOwner, isROwner, isMod, isPrems }); } catch (e) { console.error(e); }
        }
        break;
      }
    }

    // Auto leer
    let settingsREAD = global.db.settings?.[conn.user?.jid] || {};
    if (settingsREAD.autoread || settingsREAD.autoread2) {
      await conn.readMessages([m.key]);
    }

    try { await (await import('./lib/print.js')).default(m, conn); } catch {}

  } catch (e) {
    console.error(chalk.red('Error en handler:'), e);
  }
}

// ─── EVENTOS DE GRUPO ────────────────────
handler.participantsUpdate = async function({ id, participants, action }) {
  let chat = global.db.chats[id] || {};
  if (!chat.welcome) return;
  try {
    const conn = global.conn;
    let groupMetadata = await conn.groupMetadata(id);
    for (let user of participants) {
      let text = action === 'add'
        ? (chat.sWelcome || `¡Bienvenido @${user.split('@')[0]} a ${groupMetadata.subject}!`)
        : (chat.sBye || `¡Adiós @${user.split('@')[0]}!`);
      text = text.replace('@user', '@' + user.split('@')[0])
                 .replace('@subject', groupMetadata.subject)
                 .replace('@desc', groupMetadata.desc || '');
      await conn.sendMessage(id, { text, contextInfo: { mentionedJid: [user] } });
    }
  } catch (e) { console.error('Error en welcome:', e); }
};

handler.groupsUpdate = async function(groupsUpdate) {
  for (let groupUpdate of groupsUpdate) {
    const id = groupUpdate.id;
    let chat = global.db.chats[id] || {};
    if (!chat.detect) continue;
    let text;
    if (groupUpdate.subject) text = `El nombre del grupo cambió a *${groupUpdate.subject}*`;
    if (groupUpdate.desc)    text = `La descripción del grupo cambió a: ${groupUpdate.desc}`;
    if (groupUpdate.icon)    text = 'La imagen del grupo fue cambiada';
    if (text) await global.conn.sendMessage(id, { text });
  }
};

handler.deleteUpdate = async function(message) {
  try {
    const { fromMe, id, participant } = message;
    if (fromMe) return;
    let msg = global.conn.loadMessage(id);
    let chat = global.db.chats[msg?.chat] || {};
    if (!chat?.delete) return;
    await global.conn.sendMessage(msg.chat, {
      text: `🗑️ Mensaje eliminado de @${participant.split('@')[0]}`,
      mentions: [participant]
    });
    global.conn.copyNForward(msg.chat, msg).catch(() => {});
  } catch {}
};

handler.callUpdate = async function(callUpdate) {
  let isAnticall = global.db.settings[global.conn?.user?.jid]?.antiCall;
  if (!isAnticall) return;
  for (let cs of callUpdate) {
    if (cs.isGroup === false && cs.status === "offer") {
      await global.conn.reply(cs.from, '❌ Llamadas no permitidas, serás bloqueado');
      await global.conn.updateBlockStatus(cs.from, 'block');
    }
  }
};

// Hot reload
let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright("Update 'handler.js'"));
  import(`file://${file}?update=${Date.now()}`);
});