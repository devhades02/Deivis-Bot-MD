let handler = async (m, { conn, args, isOwner, isAdmin }) => {
  if (!isOwner) return m.reply('❌ Solo owners o admins pueden usar este comando.');

  const option = args[0]?.toLowerCase();
  if (!option || !['on', 'off'].includes(option))
    return m.reply(`❌ Uso: .autoreact on/off`);

  let chat = global.db.chats[m.chat] || {};
  chat.reaction = option === 'on';
  global.db.chats[m.chat] = chat;

  m.reply(`✅ AutoReaction en este chat ahora está *${chat.reaction ? 'ACTIVADO' : 'DESACTIVADO'}*`);
};
handler.help = ['autoreact on/off'];
handler.tags = ['owner'];
handler.command = ['autoreact', 'autoreaccion'];
handler.isOwner = true;
export default handler;