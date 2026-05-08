// plugins/descargas-play.js
import yts from 'yt-search'
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

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🎵 Ejemplo: ${usedPrefix + command} nome de canción`)

  await m.react('🔍')

  try {
    const search = await yts(text)
    if (!search.videos || search.videos.length === 0) throw new Error('Sin resultados.')

    const video = search.videos[0]
    const { title, url, timestamp, views, author, image } = video

    // Información limpia y ordenada
    let info = `🎵 *${title}*\n`
    info += `👤 ${author.name}\n`
    info += `⏰ ${timestamp}  👀 ${views}\n`
    info += `⏳ Descargando audio...`

    await conn.sendMessage(m.chat, { image: { url: image }, caption: info }, { quoted: m })

    await m.react('⏳')

    const calidad = '128'
    const result = await cnvmp3(url, calidad)
    if (!result?.download) throw new Error('No se obtuvo enlace de descarga')

    const fileRes = await axios.get(encodeURI(result.download), {
      responseType: 'arraybuffer',
      timeout: 120000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
        referer: 'https://cnvmp3.com/'
      }
    })
    const buffer = Buffer.from(fileRes.data)

    // Enviar como audio normal
    await conn.sendMessage(m.chat, {
      audio: buffer,
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
      ptt: false
    }, { quoted: m })

    await m.react('✅')
  } catch (e) {
    await m.react('❌')
    console.error('[Play]', e)
    m.reply(`❌ Error: ${e.message}`)
  }
}

handler.help = ['play <nombre>']
handler.tags = ['descargas']
handler.command = ['play', 'reproducir']
export default handler