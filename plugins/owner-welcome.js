let handler = async (m, { conn, args, isOwner, isAdmin }) => {
  if (!isOwner) return m.reply('❌ Solo owners o admins pueden usar este comando.');

  const option = args[0]?.toLowerCase();
  if (!option || !['on', 'off'].includes(option))
    return m.reply(`❌ Uso: .welcome on/off`);

  let chat = global.db.chats[m.chat] || {};
  chat.welcome = option === 'on';
  global.db.chats[m.chat] = chat;

  m.reply(`✅ Welcome en este grupo ahora está *${chat.welcome ? 'ACTIVADO' : 'DESACTIVADO'}*`);
};
handler.help = ['welcome on/off'];
handler.tags = ['owner'];
handler.command = ['welcome'];
handler.isOwner = true;
export default handler;