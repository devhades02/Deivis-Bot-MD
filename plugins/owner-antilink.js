let handler = async (m, { conn, args, isOwner, isAdmin }) => {
  if (!isOwner && !isAdmin) return m.reply('❌ Solo owners o admins pueden usar este comando.');

  const option = args[0]?.toLowerCase();
  if (!option || !['on', 'off'].includes(option))
    return m.reply(`❌ Uso: .antilink on/off`);

  let chat = global.db.chats[m.chat] || {};
  chat.antiLink = option === 'on';
  global.db.chats[m.chat] = chat;

  m.reply(`✅ AntiLink en este grupo ahora está *${chat.antiLink ? 'ACTIVADO' : 'DESACTIVADO'}*`);
};
handler.help = ['antilink on/off'];
handler.tags = ['owner'];
handler.command = ['antilink'];
handler.admin = true;
export default handler;