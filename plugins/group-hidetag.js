const handler = async (m, { conn, text, isAdmin, isOwner, isMod }) => {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.');


  const metadata = await conn.groupMetadata(m.chat);
  const participants = metadata.participants;

  const mentions = participants.map(p => p.id);

  const message = text ? text : '';
  await conn.sendMessage(m.chat, {
    text: message,
    mentions
  }, { quoted: m });
};

handler.help = ['hidetag <texto>'];
handler.tags = ['group'];
handler.command = ['hidetag', 'htag'];
handler.group = true;
export default handler;