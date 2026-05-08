let handler = async (m, { conn, text, isOwner, isMod }) => {
  if (!isOwner && !isMod) return m.reply('❌ Solo el owner o moderadores pueden hacer broadcast.');
  if (!text) return m.reply('❌ Debes escribir un mensaje para enviar.');

  let chats = Object.keys(global.db.chats).filter(id => id.endsWith('.us'));
  let success = 0;
  for (let id of chats) {
    try {
      await conn.sendMessage(id, { text: `📢 *MENSAJE DEL CREADOR*\n\n${text}` });
      success++;
    } catch {}
  }
  m.reply(`✅ Broadcast enviado a ${success} chats.`);
};
handler.help = ['broadcast <mensaje>'];
handler.tags = ['tools'];
handler.command = ['broadcast', 'bc'];
handler.mods = true;
export default handler;