// plugins/descargas-ytmp4.js
import axios from 'axios'

const qualityvideo = ['144', '240', '360', '720', '1080']

function convertid(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|embed|watch|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[&?]|$)/
  const match = url.match(regex)
  return match ? match[1] : null
}

async function request(url, data) {
  return axios.post(url, data, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
      'Content-Type': 'application/json',
      origin: 'https://cnvmp3.com',
      referer: 'https://cnvmp3.com/v54'
    },
    timeout: 60000
  })
}

async function cnvmp4(yturl, quality) {
  const youtube_id = convertid(yturl)
  if (!youtube_id) throw new Error('URL de YouTube inválida')

  const formatValue = 0
  if (!qualityvideo.includes(String(quality))) throw new Error(`Calidad inválida. Usa: ${qualityvideo.join(', ')}`)
  const finalQuality = parseInt(quality)

  const check = await request('https://cnvmp3.com/check_database.php',
    { youtube_id, quality: finalQuality, formatValue })

  if (check.data?.success) {
    return {
      title: check.data.data.title,
      download: check.data.data.server_path
    }
  }

  const yturlfull = `https://www.youtube.com/watch?v=${youtube_id}`
  const viddata = await request('https://cnvmp3.com/get_video_data.php',
    { url: yturlfull, token: '1234' })
  if (viddata.data.error) throw new Error(viddata.data.error)
  const title = viddata.data.title

  const download = await request('https://cnvmp3.com/download_video_ucep.php',
    { url: yturlfull, quality: finalQuality, title, formatValue })
  if (download.data.error) throw new Error(download.data.error)
  const finalLink = download.data.download_link

  await request('https://cnvmp3.com/insert_to_database.php',
    { youtube_id, server_path: finalLink, quality: finalQuality, title, formatValue }).catch(() => {})

  return { title, download: finalLink }
}

const handler = async (m, { conn, args, usedPrefix }) => {
  const url = args[0]
  const qualityArg = args[1] || '360'

  if (!url) {
    return m.reply(
      `╭─❒「 🎬 YT MP4 (Documento) 」\n` +
      `│\n` +
      `│ Uso: *${usedPrefix}ytmp4* <url> [calidad]\n` +
      `│ Ejemplo: ${usedPrefix}ytmp4 youtu.be/... 720\n` +
      `│\n` +
      `│ Calidades: 144 • 240 • 360 • 720 • 1080p\n` +
      `│ (Archivo mediano, se envía como documento)\n` +
      `╰─⬣`
    )
  }

  if (!convertid(url)) {
    await m.react('❌')
    return m.reply('❌ URL de YouTube inválida.')
  }

  const calidad = qualityvideo.includes(qualityArg) ? qualityArg : '360'
  await m.react('⏳')

  try {
    const result = await cnvmp4(url, calidad)
    if (!result?.download) throw new Error('No se obtuvo enlace de descarga')
    const titulo = result.title || 'video'

    await m.reply(`📥 Descargando *${titulo}* (${calidad}p)...`)

    const fileRes = await axios.get(encodeURI(result.download), {
  responseType: 'arraybuffer',
  timeout: 180000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
    referer: 'https://cnvmp3.com/'
  }
})
    const buffer = Buffer.from(fileRes.data)

    await conn.sendMessage(m.chat, {
      document: buffer,
      mimetype: 'video/mp4',
      fileName: `${titulo}.mp4`,
      caption: `🎬 ${titulo} (${calidad}p)\n${global.wm || 'Deivis Bot'}`
    }, { quoted: m })

    await m.react('✅')
  } catch (e) {
    await m.react('❌')
    console.error(e)
    return m.reply(`❌ Error: ${e.message}`)
  }
}

handler.help = ['ytmp4 <url> [calidad]']
handler.tags = ['descargas']
handler.command = ['ytmp4', 'ytvideo']
export default handler