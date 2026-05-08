// plugins/herramientas-tourl.js
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'

const handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''

  if (!mime) {
    return m.reply(`Responde a una imagen, video o sticker con *${usedPrefix + command}*`)
  }

  await m.react('⏳')

  try {
    let buffer = await q.download()
    let url

    if (/image|webp/.test(mime)) {
      url = await uploadImage(buffer)
    } else {
      url = await uploadFile(buffer)
    }

    await m.reply(`✅ Archivo subido\n${url}`)
    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply('❌ No se pudo subir el archivo.')
  }
}

handler.help = ['tourl']
handler.tags = ['herramientas']
handler.command = ['tourl', 'upload', 'geturl']

export default handler