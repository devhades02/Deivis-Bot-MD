// plugins/owner-delpremium.js
let handler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Solo el owner oficial puede quitar el premium.');

  let who;
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    who = m.mentionedJid[0];
  } else if (args[0]) {
    let num = args[0].replace(/[^0-9]/g, '');
    if (num) who = num + '@s.whatsapp.net';
  } else {
    return m.reply('❌ Menciona a un usuario o escribe su número.\nEjemplo: .delpremium @usuario\n.delpremium 51929264225');
  }

  if (!who) return m.reply('❌ No se pudo identificar al usuario.');

  let user = global.db.users[who];
  if (!user || !user.premium) {
    return m.reply(`⚠️ @${who.split('@')[0]} no es premium.`, { mentions: [who] });
  }

  user.premium = false;
  user.premiumTime = 0;

  let name = await conn.getName(who);
  await conn.sendMessage(m.chat, { text: `✅ Se ha eliminado el premium de @${who.split('@')[0]} (${name}).`, mentions: [who] }, { quoted: m });
};

handler.help = ['delpremium @usuario/número'];
handler.tags = ['owner'];
handler.command = ['delpremium', 'quitarpremium', 'unvip'];
handler.owner = true;
export default handler;