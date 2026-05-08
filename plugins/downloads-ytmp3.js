// plugins/descargas-ytmp3.js
import axios from 'axios'

const qualityaudio = ['96', '128', '256', '320']

function convertid(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|embed|watch|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[&?]|$)/
  const match = url.match(regex)
  return match ? match[1] : null
}

function mapaudioquality(bitrate) {
  if (bitrate == 320) return 0
  if (bitrate == 256) return 1
  if (bitrate == 128) return 4
  if (bitrate == 96) return 5
  return 4
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

async function cnvmp3(yturl, quality) {
  const youtube_id = convertid(yturl)
  if (!youtube_id) throw new Error('URL de YouTube inválida')

  const formatValue = 1
  if (!qualityaudio.includes(String(quality))) throw new Error(`Calidad inválida. Usa: ${qualityaudio.join(', ')}`)
  const finalQuality = mapaudioquality(parseInt(quality))

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
  const qualityArg = args[1] || '128'

  if (!url) {
    return m.reply(
      `╭─❒「 🎵 YT MP3 (Documento) 」\n` +
      `│\n` +
      `│ Uso: *${usedPrefix}ytmp3* <url> [calidad]\n` +
      `│ Ejemplo: ${usedPrefix}ytmp3 youtu.be/... 320\n` +
      `│\n` +
      `│ Calidades: 96 • 128 • 256 • 320 kbps\n` +
      `│ (Archivo mediano, se envía como documento)\n` +
      `╰─⬣`
    )
  }

  if (!convertid(url)) {
    await m.react('❌')
    return m.reply('❌ URL de YouTube inválida.')
  }

  const calidad = qualityaudio.includes(qualityArg) ? qualityArg : '128'
  await m.react('⏳')

  try {
    const result = await cnvmp3(url, calidad)
    if (!result?.download) throw new Error('No se obtuvo enlace de descarga')
    const titulo = result.title || 'audio'

    await m.reply(`📥 Descargando *${titulo}* (${calidad}kbps)...`)

    const fileRes = await axios.get(encodeURI(result.download), {
  responseType: 'arraybuffer',
  timeout: 120000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
    referer: 'https://cnvmp3.com/'
  }
})
    const buffer = Buffer.from(fileRes.data)

    await conn.sendMessage(m.chat, {
      document: buffer,
      mimetype: 'audio/mpeg',
      fileName: `${titulo}.mp3`,
      caption: `🎵 ${titulo} (${calidad}kbps)\n${global.wm || 'Deivis Bot'}`
    }, { quoted: m })

    await m.react('✅')
  } catch (e) {
    await m.react('❌')
    console.error(e)
    return m.reply(`❌ Error: ${e.message}`)
  }
}

handler.help = ['ytmp3 <url> [calidad]']
handler.tags = ['descargas']
handler.command = ['ytmp3', 'ytaudio']
export default handler