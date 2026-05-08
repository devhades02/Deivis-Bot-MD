// plugins/main-menu.js
import moment from 'moment-timezone';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);
const { version } = require(join(__dirname, '../package.json'));

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

const handler = async (m, { conn, args, usedPrefix: _p }) => {
  // ─── Imagen del menú ──────────────────────
  const menuImage = global.menu || global.imagen1 || 'https://i.ibb.co/whs9jxJ/menu.jpg';

  // ─── Datos del usuario ────────────────────
  const user = global.db?.users?.[m.sender] || {};
  const isPremium = user.premium || false;
  const role = user.role || 'Novato';
  const exp = user.exp || 0;
  const level = user.level || 0;
  const money = user.money || 0;
  const diamond = user.diamond || 0;

  // ─── Recolección de comandos (solo el 1°) ──
  const categories = {};
  for (const name in global.plugins) {
    const plugin = global.plugins[name];
    if (!plugin || !plugin.command) continue;

    const tags = plugin.tags || ['general'];
    let firstCommand = null;

    if (typeof plugin.command === 'string') {
      firstCommand = plugin.command;
    } else if (Array.isArray(plugin.command) && plugin.command.length > 0) {
      firstCommand = plugin.command[0];
    } else if (plugin.command instanceof RegExp) {
      firstCommand = plugin.command.source
        .replace(/\\/g, '')
        .replace(/^\^|\$$/g, '')
        .replace(/\(|\)|\./g, '');
    }
    if (!firstCommand) continue;

    for (const tag of tags) {
      if (!categories[tag]) categories[tag] = [];
      if (!categories[tag].includes(firstCommand)) {
        categories[tag].push(firstCommand);
      }
    }
  }

  // Ordenar categorías y comandos
  const sortedCategories = Object.keys(categories).sort();
  for (const cat of sortedCategories) {
    categories[cat].sort();
  }

  // ─── Construir menú estilo kawaii ──────────
  let menu = `*. ⋅ᘛ⁐̤ᕐ⩺┈•༶ :･ﾟ✧:･ﾟ✧･ﾟ✧*\n`;
  menu += `*. ⋅⊰ꕤ ┆* ⭔ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈Ó𝐍\n`;
  menu += `*. ⋅⊰ꕤ ┆* ・・・・・・・・・・・\n`;
  menu += `*. ⋅⊰ꕤ ┆* 👤 @${m.sender.split('@')[0]}\n`;
  menu += `*. ⋅⊰ꕤ ┆* ⭐ Rol: ${role}  ${isPremium ? '💎 Premium' : '🔹 Gratuito'}\n`;
  menu += `*. ⋅⊰ꕤ ┆* ⚡ Exp: ${exp}  🏆 Nivel: ${level}\n`;
  menu += `*. ⋅⊰ꕤ ┆* 💰 Monedas: ${money}  💎 Diamantes: ${diamond}\n`;
  menu += `*. ⋅ ˚̣- : ✧ : – ⭒ ⊹ ⭒ – : ✧ : -˚̣⋅ .*\n`;

  // Añadir ReadMore para colapsar el resto del menú
  menu += `${readMore}\n`;

  // Agregar categorías y comandos
  for (const cat of sortedCategories) {
    menu += `*. ⋅ᘛ⁐̤ᕐ⩺┈•༶ :･ﾟ✧:･ﾟ✧･ﾟ✧*\n`;
    menu += `*. ⋅⊰ꕤ ┆* ⭔ ${cat.toUpperCase()}\n`;
    menu += `*. ⋅⊰ꕤ ┆* ・・・・・・・・・・・\n`;
    for (const cmd of categories[cat]) {
      // Envolver comando en backticks para estilo
      menu += `*. ⋅⊰ꕤ ┆* \`${_p}${cmd}\`\n`;
    }
    menu += `*. ⋅ ˚̣- : ✧ : – ⭒ ⊹ ⭒ – : ✧ : -˚̣⋅ .*\n\n`;
  }

  // Pie de página
  menu += `*. ⋅ᘛ⁐̤ᕐ⩺┈•༶ :･ﾟ✧:･ﾟ✧･ﾟ✧*\n`;
  menu += `*. ⋅⊰ꕤ ┆* ⭔ 𝐂𝐫𝐞𝐝𝐢𝐭𝐬\n`;
  menu += `*. ⋅⊰ꕤ ┆* ・・・・・・・・・・・\n`;
  menu += `*. ⋅⊰ꕤ ┆* Hady D'xyz\n`;
  menu += `*. ⋅ ˚̣- : ✧ : – ⭒ ⊹ ⭒ – : ✧ : -˚̣⋅ .*\n`;

  // ─── Quoted falso (fkontak) ────────────────
  const fkontak = {
    key: {
      participant: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'DeivisMenu'
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:${global.packname || 'Deivis Bot'}\nTEL;waid=${m.sender.split('@')[0]}:+${m.sender.split('@')[0]}\nEND:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  };

  // ContextInfo para forwarding
  const contextInfo = {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
      newsletterJid: global.ch.ch1,
      newsletterName: global.des,
      serverMessageId: -1
    }
  };

  // ─── Enviar menú con imagen y estilo reenviado ──
  if (Buffer.isBuffer(menuImage)) {
    await conn.sendMessage(m.chat, {
      image: menuImage,
      caption: menu,
      mentions: [m.sender],
      contextInfo
    }, { quoted: fkontak });
  } else {
    await conn.sendMessage(m.chat, {
      image: { url: menuImage },
      caption: menu,
      mentions: [m.sender],
      contextInfo
    }, { quoted: fkontak });
  }
};

handler.help = [];
handler.tags = ['main'];
handler.command = ['menu', 'ayuda', 'comandos'];

export default handler;