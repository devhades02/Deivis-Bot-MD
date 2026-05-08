// plugins/_handler-all.js
import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

let handler = m => m

handler.all = async function (m) {
  // ─── getBuffer global ──────────────────────
  global.getBuffer = async (url, options) => {
    try {
      options ? options : {}
      const res = await axios({
        method: 'get',
        url,
        headers: {
          'DNT': 1,
          'User-Agent': 'GoogleBot',
          'Upgrade-Insecure-Request': 1
        },
        ...options,
        responseType: 'arraybuffer'
      })
      return res.data
    } catch (e) {
      console.error(`Error getBuffer: ${e}`)
    }
  }

  // ─── Variables dinámicas ───────────────────
  let pp = ''
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? this.user.jid : m.sender

  // Imagen por defecto (usando tu menú o logo)
  const defaultImg = global.menu || global.logo || global.imagen1
  const wm = global.wm || 'Deivis Bot'
  const wm2 = global.wm2 || 'Deivis Bot ✨'
  const packname = global.packname || 'Deivis Bot'
  const author = global.author || 'Hady D\'xyz'
  const des = global.des || 'Deivis Bot - El bot más pro'

  // Imágenes aleatorias (si no tienes ImgAll, usamos la default)
  global.fotos = defaultImg
  global.enlaces = ''

  // ─── MENSAJES FALSOS (QUOTED) ──────────────

  // GIF falso
  global.fgif = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', ...(m.chat ? { remoteJid: 'status@broadcast' } : {}) },
    message: { videoMessage: { title: wm, h: 'Hmm', seconds: '999999999', gifPlayback: 'true', caption: wm, jpegThumbnail: defaultImg } }
  }

  // Enlace de grupo falso
  global.fgclink = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net' },
    message: { groupInviteMessage: { groupJid: '0@g.us', inviteCode: null, groupName: packname, caption: wm2, jpegThumbnail: defaultImg } }
  }

  // Documento falso
  global.fdocs = {
    key: { participant: '0@s.whatsapp.net' },
    message: { documentMessage: { title: wm, jpegThumbnail: defaultImg } }
  }

  // Tienda / Producto falso
  global.ftoko = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', ...(m.chat ? { remoteJid: '17608914335@s.whatsapp.net' } : {}) },
    message: { productMessage: { product: { productImage: { mimetype: 'image/jpeg', jpegThumbnail: defaultImg }, title: wm, description: des, currencyCode: 'USD', priceAmount1000: '99999999', retailerId: 'Ghost', productImageCount: 1 }, businessOwnerJid: '0@s.whatsapp.net' } }
  }

  // Imagen falsa
  global.fimg = {
    key: { participant: '0@s.whatsapp.net' },
    message: { imageMessage: { url: '', mimetype: 'image/jpeg', fileLength: '999999', height: 306, width: 366, jpegThumbnail: defaultImg } }
  }

  // Texto falso
  global.ftextt = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', ...(m.chat ? { remoteJid: 'status@broadcast' } : {}) },
    message: { extendedTextMessage: { text: wm, title: wm, jpegThumbnail: defaultImg } }
  }

  // Ubicación en vivo falsa
  global.fliveLoc = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', ...(m.chat ? { remoteJid: 'status@broadcast' } : {}) },
    message: { liveLocationMessage: { caption: 'By: ' + wm2, h: wm, jpegThumbnail: defaultImg } }
  }

  global.fliveLoc2 = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', ...(m.chat ? { remoteJid: 'status@broadcast' } : {}) },
    message: { liveLocationMessage: { title: author, h: wm, jpegThumbnail: defaultImg } }
  }

  global.fliveLoc3 = {
    key: { participants: '0@s.whatsapp.net', fromMe: false, id: '3B64558B07848BD81108C1D14712018E' },
    message: { locationMessage: { name: wm, jpegThumbnail: defaultImg, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${wm},;;;\nFN:${wm},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabell:Ponsel\nEND:VCARD` } },
    participant: '0@s.whatsapp.net'
  }

  // Encuesta falsa
  global.fpoll = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
    message: { pollCreationMessage: { name: wm, selectableOptionsCount: 1 } }
  }

  // Documento falso (otro estilo)
  global.fdocument = {
    key: { participant: '0@s.whatsapp.net' },
    message: { documentMessage: { title: `${wm}\n   ${des}`, jpegThumbnail: defaultImg } }
  }

  // Contacto falso (el que ya usamos en el menú)
  global.fkontak = {
    key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' },
    message: { contactMessage: { vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:${packname}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } },
    participant: '0@s.whatsapp.net'
  }

  // Tick falso
  global.faketick = {
    key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: '3B64558B07848BD81108C1D14712018E' },
    message: { stickerMessage: { fileSha256: 'uZiOJzqOvrOo2WGjnMKgX2MMQMyasT+ZDgqUczpIBmY=', thumbnail: defaultImg, mimetype: 'image/webp', height: 64, width: 64, directPath: '/v/t62.15575-24/56110107_763365384384977_5720135628188301198_n.enc?oh=450f8f684b06f0ba2dbc9779e5f06774&oe=605B81EE', fileLength: '60206', firstFrameLength: 3626, isAnimated: false } },
    messageTimestamp: '1614070775',
    status: 'PENDING'
  }

  // Imagen falsa (otro estilo)
  global.fakeimg = {
    key: { participant: '0@s.whatsapp.net', ...(m.chat ? { remoteJid: 'status@broadcast' } : {}) },
    message: { imageMessage: { title: `*${des}*`, h: 'Hmm', seconds: '99999', imagePlayback: 'true', caption: `${wm2}\n          ${des}`, jpegThumbnail: defaultImg } }
  }

  // Mensaje falso
  global.fakemsg = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', ...(m.chat ? { remoteJid: 'status@broadcast' } : {}) },
    message: { extendedTextMessage: { text: `${wm}\n${des}`, title: wm, jpegThumbnail: defaultImg } }
  }

  // Ubicación falsa
  global.flocation = {
    key: { participant: '0@s.whatsapp.net' },
    message: { locationMessage: { name: `${wm}\n   ${des}`, jpegThumbnail: defaultImg } }
  }

  // Estilo audio falso
  global.estiloaudio = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', ...(m.chat ? { remoteJid: 'status@broadcast' } : {}) },
    message: { audioMessage: { mimetype: 'audio/ogg; codecs=opus', seconds: '99569', ptt: 'true' } }
  }

  // Video falso
  global.fvideo = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', ...(m.chat ? { remoteJid: 'status@broadcast' } : {}) },
    message: { videoMessage: { title: wm, h: 'Hmm', seconds: '2022', caption: wm, jpegThumbnail: defaultImg } }
  }

  // Producto falso 2
  global.fproducto2 = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', ...(m.chat ? { remoteJid: 'status@broadcast' } : {}) },
    message: { productMessage: { product: { productImage: { mimetype: 'image/jpeg', jpegThumbnail: defaultImg }, title: wm, retailerId: packname, productImageCount: 1 }, businessOwnerJid: '0@s.whatsapp.net' } }
  }

  // Producto falso (otro)
  global.fproducto = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', ...(m.chat ? { remoteJid: '17608914335@s.whatsapp.net' } : {}) },
    message: { productMessage: { product: { productImage: { mimetype: 'image/jpeg', jpegThumbnail: defaultImg }, title: wm, description: packname, currencyCode: 'USD', priceAmount1000: '200000000', retailerId: 'Ghost', productImageCount: 1 }, businessOwnerJid: '0@s.whatsapp.net' } }
  }

  // Imagen de una sola vista falsa
  global.fakevoimg = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
    message: { imageMessage: { mimetype: 'image/jpeg', caption: wm, jpegThumbnail: defaultImg, viewOnce: true } }
  }

  // Video de una sola vista falso
  global.fakevovid = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
    message: { videoMessage: { mimetype: 'video/mp4', caption: wm, jpegThumbnail: defaultImg, viewOnce: true } }
  }

  // Pago falso
  global.fpay = {
    key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: '3B64558B07848BD81108C1D14712018E' },
    message: { requestPaymentMessage: { currencyCodeIso4217: 'USD', amount1000: '100000', requestFrom: '0@s.whatsapp.net', noteMessage: { extendedTextMessage: { text: wm } }, expiryTimestamp: '0', amount: { value: '100000', offset: 1000, currencyCode: 'USD' }, background: { id: 'BBB9307B17C17F928E57A7435E45033E', fileLength: '94896', width: 64, height: 64, mimetype: 'image/webp', placeholderArgb: 4288282521, textArgb: 4278190080, subtextArgb: 4288282521 } } }
  }

  // Orden falso
  global.estilo = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', ...(m.chat ? { remoteJid: 'status@broadcast' } : {}) },
    message: { orderMessage: { itemCount: +2022, status: 1, surface: 1, message: `${wm}\n${des}`, orderTitle: 'Deivis', thumbnail: defaultImg, sellerJid: '0@s.whatsapp.net' } }
  }

  // Invitación de grupo falsa
  global.twa = {
    key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net' },
    message: { groupInviteMessage: { groupJid: '0@g.us', inviteCode: 'm', groupName: 'Deivis', caption: wm, jpegThumbnail: defaultImg } }
  }

  global.fakemek = {
    key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net' },
    message: { groupInviteMessage: { groupJid: '0@g.us', inviteCode: 'm', groupName: 'Deivis', caption: packname, jpegThumbnail: null } }
  }

  // ─── EMOJI ALEATORIO ──────────────────────
  try {
    const moji = (await axios.get('https://raw.githubusercontent.com/GataNina-Li/YartexBot-MD/main/storage/juegos/emojis.json')).data
    global.emoji = await moji[Math.floor(moji.length * Math.random())]
  } catch {
    global.emoji = '✨'
  }

  // ─── SALUDO DINÁMICO ──────────────────────
  const ase = new Date(new Date() + 3600000)
  const hour = ase.getHours()
  let saludo
  switch (hour) {
    case 0: case 1: case 2: saludo = 'Buenas Noches'; break
    case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11: saludo = 'Buenos Días'; break
    case 12: case 13: case 14: case 15: case 16: case 17: saludo = 'Buenas Tardes'; break
    case 18: case 19: case 20: case 21: case 22: case 23: saludo = 'Buenas Noches'; break
  }
  global.saludo = '🐱 ' + saludo

  // ─── CONTEXTO FALSO REENVIADO ──────────────
  global.fake = {
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363302472386010@newsletter',
        serverMessageId: 100,
        newsletterName: `${packname} ✨`
      },
      externalAdReply: {
        showAdAttribution: true,
        title: packname,
        body: author,
        previewType: 'PHOTO',
        thumbnailUrl: defaultImg,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: false
      }
    }
  }
}

export default handler