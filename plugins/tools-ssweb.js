// plugins/herramientas-ssweb.js
import axios from 'axios';

const ssweb = async (url, { width = 1280, height = 720, full_page = false, device_scale = 1 } = {}) => {
  if (!url.startsWith('https://')) throw new Error('La URL debe comenzar con https://');

  const { data } = await axios.post('https://gcp.imagy.app/screenshot/createscreenshot', {
    url,
    browserWidth: parseInt(width),
    browserHeight: parseInt(height),
    fullPage: full_page,
    deviceScaleFactor: parseInt(device_scale),
    format: 'png'
  }, {
    headers: {
      'content-type': 'application/json',
      referer: 'https://imagy.app/full-page-screenshot-taker/',
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
    }
  });

  return data.fileUrl;
};

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const url = args.join(' ').trim();

  if (!url) {
    return m.reply(
      `*Screenshot Web*\n` +
      `Uso: ${usedPrefix}${command} <url>\n` +
      `Ejemplo: ${usedPrefix}ss https://google.com\n\n` +
      `Resolución: 1280x720\n` +
      `Formato: PNG`
    );
  }

  const fullUrl = url.startsWith('https://') ? url : `https://${url}`;

  try {
    await m.react('⏳');
    await m.reply('⏳ Capturando pantalla...');

    const imageUrl = await ssweb(fullUrl);
    if (!imageUrl) throw new Error('No se obtuvo la imagen.');

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `🌐 ${fullUrl}\n📐 1280x720 | PNG\n${global.wm || 'Deivis Bot'}`
    }, { quoted: m });

    await m.react('✅');
  } catch (e) {
    console.error(e);
    await m.react('❌');
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.help = ['ss <url>'];
handler.tags = ['herramientas'];
handler.command = ['screenshot', 'ssweb', 'ss'];

export default handler;