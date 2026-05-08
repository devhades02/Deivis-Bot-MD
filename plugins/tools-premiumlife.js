// plugins/owner-premiumlife.js
let handler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Solo el owner oficial puede dar premium de por vida.');

  let who;
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    who = m.mentionedJid[0];
  } else if (args[0]) {
    let num = args[0].replace(/[^0-9]/g, '');
    if (num) who = num + '@s.whatsapp.net';
  } else {
    return m.reply('❌ Menciona a un usuario o escribe su número.\nEjemplo: .premiumlife @usuario\n.premiumlife 51929264225');
  }

  if (!who) return m.reply('❌ No se pudo identificar al usuario.');

  let user = global.db.users[who];
  if (!user) {
    global.db.users[who] = {};
    user = global.db.users[who];
  }

  user.premium = true;
  user.premiumTime = -1;   // -1 = permanente
  user.level = Math.max(user.level || 0, 10);
  user.role = user.role || '💎 Premium Vitalicio';
  user.registered = true;

  let num = who.split('@')[0];
  let name = await conn.getName(who);
  await conn.sendMessage(m.chat, { text: `✅ *Premium de por vida otorgado a:*\n👤 @${num} (${name})\n⏳ No expira nunca.`, mentions: [who] }, { quoted: m });
};

handler.help = ['premiumlife @usuario/número'];
handler.tags = ['owner'];
handler.command = ['premiumlife', 'vipforever', 'premiumpermanente'];
handler.owner = true;
export default handler;