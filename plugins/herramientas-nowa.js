// plugins/herramientas-nowa.js
const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Ejemplo: ${usedPrefix + command} 5192926422x`)
  if (!text.match(/x/g)) return m.reply(`Debes incluir al menos una 'x' como comodín. Ejemplo: ${usedPrefix + command} 5192926422x`)

  await m.react('⏳')

  let random = text.match(/x/g).length
  let total = Math.pow(10, random)
  let array = []

  for (let i = 0; i < total; i++) {
    let list = [...i.toString().padStart(random, '0')]
    let result = text.replace(/x/g, () => list.shift()) + '@s.whatsapp.net'
    if (await conn.onWhatsApp(result).then(v => (v[0] || {}).exists)) {
      let info = await conn.fetchStatus(result).catch(_ => {})
      array.push({ exists: true, jid: result, ...info })
    } else {
      array.push({ exists: false, jid: result })
    }
  }

  let txt = '*Registrados*\n\n'
  txt += array.filter(v => v.exists).map(v => `• wa.me/${v.jid.split('@')[0]}\nBio: ${v.status || 'Sin descripción'}\nFecha: ${formatDate(v.setAt)}`).join('\n\n')
  txt += '\n\n*No registrados*\n\n'
  txt += array.filter(v => !v.exists).map(v => v.jid.split('@')[0]).join('\n')

  await m.reply(txt)
  await m.react('✅')
}

handler.help = ['nowa <número con x>']
handler.tags = ['herramientas']
handler.command = ['nowa']

export default handler

function formatDate(n, locale = 'es') {
  let d = new Date(n)
  return d.toLocaleDateString(locale, { timeZone: 'America/Lima' })
}