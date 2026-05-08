const handler = async (m, { conn, text, isAdmin, isOwner, isMod }) => {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.');
  if (!isAdmin && !isOwner && !isMod) return m.reply('❌ Solo los administradores pueden usar este comando.');

  const metadata = await conn.groupMetadata(m.chat);
  const participants = metadata.participants;

  let txt = text ? `📢 *${text}*\n\n` : '📢 *Atención a todos*\n\n';
  participants.forEach((p, i) => {
    txt += ` ${i + 1}. @${p.id.split('@')[0]}\n`;
  });

  const mentions = participants.map(p => p.id);
  await conn.sendMessage(m.chat, {
    text: txt,
    mentions
  }, { quoted: m });
};

handler.help = ['tagall <texto>'];
handler.tags = ['group'];
handler.command = ['tagall', 'everyone', 'all'];
handler.admin = true;
handler.group = true;
export default handler;