let handler = async (m, { conn, args, isOwner }) => {
  let user = global.db.users[m.sender];
  if (!user) return m.reply('❌ No tienes perfil aún.');

  let amount = parseInt(args[0]);
  if (!amount || amount <= 0) return m.reply(`❌ Uso: .transferir <cantidad> @usuario`);

  let who = m.mentionedJid[0] || (args[1] ? args[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);
  if (!who || !who.includes('@')) return m.reply('❌ Debes mencionar a un usuario válido.');
  if (m.sender === who) return m.reply('❌ No puedes transferirte a ti mismo.');

  let target = global.db.users[who];
  if (!target) return m.reply('❌ Ese usuario no tiene perfil aún.');

  if (!isOwner) {
    if (user.money < amount) return m.reply(`❌ No tienes suficiente dinero. Tienes ${user.money} 💰`);
    user.money -= amount;
  }
  target.money = (target.money || 0) + amount;

  let txt = `✅ *Transferencia exitosa*\n`;
  if (!isOwner) txt += `Transferiste ${amount} 💰 a @${who.split('@')[0]}\nTu balance: ${user.money} 💰\n`;
  else txt += `Como owner, regalaste ${amount} 💰 a @${who.split('@')[0]} (sin costo)\n`;
  txt += `Balance de @${who.split('@')[0]}: ${target.money} 💰`;
  await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender, who] }, { quoted: m });
};
handler.help = ['transferir <cantidad> @usuario'];
handler.tags = ['rpg'];
handler.command = ['transferir', 'transfer', 'pagar'];
handler.register = true;
export default handler;