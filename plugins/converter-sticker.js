// plugins/convertidor-sticker.js
import { sticker } from '../lib/sticker.js'

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}

const handler = async (m, { conn, args, usedPrefix, command, text }) => {
  let stiker = false
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''

  if (!/webp|image|video/g.test(mime) && !text) {
    return m.reply(`Responde a una imagen, vídeo o sticker con *${usedPrefix + command}*.\nTambién puedes pasar una URL.`)
  }

  if (/video/g.test(mime) && (q.msg || q).seconds > 10) {
    return m.reply('El vídeo no puede durar más de 10 segundos.')
  }

  await m.react('⏳')
  await m.reply('Creando sticker...')

  if (/webp|image|video/g.test(mime)) {
    let img = await q.download?.()
    stiker = await sticker(img, false, global.packname, global.author)
  } else if (args[0]) {
    if (isUrl(args[0])) {
      stiker = await sticker(false, args[0], global.packname, global.author)
    } else {
      return m.reply('El enlace no es válido.')
    }
  }

  if (stiker) {
    await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
    await m.react('✅')
  } else {
    await m.react('❌')
    m.reply('❌ No se pudo crear el sticker.')
  }
}

handler.help = ['sticker', 's', 'stickers', 'stickergif', 'stickerimg']
handler.tags = ['convertidores']
handler.command = ['sticker', 's', 'stickers', 'stickergif', 'stickerimg']

export default handler