// plugins/herramientas-remini.js
import fetch from 'node-fetch';
import FormData from 'form-data';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';

const apiHeaders = {
  'User-Agent': 'okhttp/4.9.2',
  'Accept-Encoding': 'gzip'
};

const apiUrl = 'https://sharpify-api.vercel.app/api/enhance/auto_enhance';

async function getImageBuffer(m, conn) {
  const msg = m.message;
  const types = ['imageMessage', 'ephemeralMessage', 'viewOnceMessage', 'viewOnceMessageV2'];
  let imageMsg = null;

  for (const t of types) {
    if (msg?.[t]) {
      imageMsg = t === 'ephemeralMessage'
        ? msg[t]?.message?.imageMessage
        : t.startsWith('viewOnce')
          ? msg[t]?.message?.imageMessage
          : msg[t];
      if (imageMsg) break;
    }
  }

  if (!imageMsg && m.quoted) {
    const q = m.quoted;
    const qMsg = q.message || q.msg || q;
    for (const t of types) {
      if (qMsg?.[t]) {
        imageMsg = t === 'ephemeralMessage'
          ? qMsg[t]?.message?.imageMessage
          : t.startsWith('viewOnce')
            ? qMsg[t]?.message?.imageMessage
            : qMsg[t];
        if (imageMsg) break;
      }
    }
    if (!imageMsg && (q.mimetype || '').startsWith('image/')) {
      imageMsg = q;
    }
  }

  if (!imageMsg) return null;
  const stream = await downloadContentFromMessage(imageMsg, 'image');
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function sharpify(imgBuffer) {
  const form = new FormData();
  form.append('file', imgBuffer, { filename: 'source.jpg', contentType: 'image/jpeg' });

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { ...apiHeaders, ...form.getHeaders() },
    body: form
  });

  if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
  const data = await res.json();
  return data;
}

const handler = async (m, { conn, usedPrefix, command }) => {
  await m.react('⏳');

  let imgBuffer;
  try {
    imgBuffer = await getImageBuffer(m, conn);
  } catch (e) {
    console.error('[Remini] Error descargando imagen:', e.message);
  }

  if (!imgBuffer) {
    await m.react('❌');
    return m.reply(
      `*Remini - Mejora HD*\n\n` +
      `Responde a una imagen con *${usedPrefix}${command}* para mejorar su calidad automáticamente.`
    );
  }

  try {
    const data = await sharpify(imgBuffer);
    const imgUrl = data?.url || data?.image || data?.result || data?.output;

    if (!imgUrl) {
      console.error('[Remini] Respuesta API:', JSON.stringify(data));
      throw new Error('La API no devolvió imagen. Intenta con otra foto.');
    }

    const caption = `✅ Imagen mejorada (HD)\n${global.wm || 'Deivis Bot'}`;

    if (typeof imgUrl === 'string' && imgUrl.startsWith('http')) {
      await conn.sendMessage(m.chat, { image: { url: imgUrl }, caption }, { quoted: m });
    } else {
      const buf = Buffer.from(imgUrl, 'base64');
      await conn.sendMessage(m.chat, { image: buf, caption }, { quoted: m });
    }

    await m.react('✅');
  } catch (e) {
    await m.react('❌');
    console.error('[Remini] Error:', e.message);
    m.reply(`❌ Error al procesar la imagen: ${e.message}`);
  }
};

handler.help = ['remini'];
handler.tags = ['herramientas'];
handler.command = ['remini'];

export default handler;