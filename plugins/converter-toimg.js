// plugins/convertidor-toimg.js
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const tmpDir = path.join(__dirname, '..', 'tmp')
const execAsync = promisify(exec)

const handler = async (m, { conn, usedPrefix, command }) => {
  // Obtener el sticker (puede ser el mensaje citado o el actual)
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''

  if (!mime.includes('webp')) {
    return m.reply(`Responde a un sticker con *${usedPrefix + command}* para convertirlo a imagen.`)
  }

  await m.react('⏳')

  try {
    // Descargar el sticker
    let buffer = await q.download()
    let inputPath = path.join(tmpDir, `sticker_${Date.now()}.webp`)
    let outputPath = path.join(tmpDir, `output_${Date.now()}.png`)

    fs.writeFileSync(inputPath, buffer)

    // Convertir con ffmpeg
    await execAsync(`ffmpeg -y -i "${inputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease" "${outputPath}"`)

    let resultBuffer = fs.readFileSync(outputPath)

    // Enviar imagen
    await conn.sendMessage(m.chat, {
      image: resultBuffer,
      caption: `✅ Sticker convertido a imagen\n${global.wm || 'Deivis Bot'}`
    }, { quoted: m })

    // Limpiar archivos temporales
    try { fs.unlinkSync(inputPath) } catch {}
    try { fs.unlinkSync(outputPath) } catch {}

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply('❌ No se pudo convertir el sticker.')
  }
}

handler.help = ['toimg']
handler.tags = ['convertidores']
handler.command = ['toimg', 'stickeraimg', 'img']

export default handler