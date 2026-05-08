// plugins/owner-delowner.js
let handler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Solo el owner oficial puede quitar owners.');

  let who;
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    who = m.mentionedJid[0];
  } else if (args[0]) {
    let num = args[0].replace(/[^0-9]/g, '');
    if (num) who = num + '@s.whatsapp.net';
  } else {
    return m.reply('❌ Menciona a un usuario o escribe su número.\nEjemplo: .delowner @usuario\n.delowner 51929264225');
  }

  if (!who) return m.reply('❌ No se pudo identificar al usuario.');
  let num = who.split('@')[0];

  // No permitir quitar al owner oficial (el primero con true)
  if (global.owner[0][0] === num && global.owner[0][2] === true) {
    return m.reply('❌ No puedes quitarte a ti mismo como owner oficial.');
  }

  let index = global.owner.findIndex(o => o[0] === num);
  if (index === -1) return m.reply(`⚠️ @${num} no es owner.`, { mentions: [who] });

  global.owner.splice(index, 1);

  // Quitar beneficios en db
  let user = global.db.users[who];
  if (user) {
    user.level = 0;
    user.role = '♛ Novato';
    user.premium = false;
    user.premiumTime = 0;
    user.money = 0;
    user.diamond = 0;
    user.ownerPermanent = false;
  }

  await conn.sendMessage(m.chat, { text: `✅ @${num} ya no es owner del bot.`, mentions: [who] }, { quoted: m });
};

handler.help = ['delowner @usuario/número'];
handler.tags = ['owner'];
handler.command = ['delowner', 'quitarowner'];
handler.owner = true;
export default handler;