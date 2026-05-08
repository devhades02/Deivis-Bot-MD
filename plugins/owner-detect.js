let handler = async (m, { conn, isOwner, isAdmin }) => {
  if (!isOwner && !isAdmin) return m.reply('❌ Solo owners o admins pueden usar este comando.');
  let chat = global.db.chats[m.chat] || {};
  chat.detect = !chat.detect;
  global.db.chats[m.chat] = chat;
  m.reply(`✅ Detect en este grupo ahora está *${chat.detect ? 'ACTIVADO' : 'DESACTIVADO'}*`);
};
handler.help = ['detect'];
handler.tags = ['owner'];
handler.command = ['detect'];
handler.admin = true;
export default handler;