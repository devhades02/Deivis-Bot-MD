const handler = async (m, { conn, args, isAdmin, isOwner, isBotAdmin }) => {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.');
  if (!isBotAdmin) return m.reply('❌ El bot necesita ser administrador para degradar.');
  if (!isAdmin && !isOwner) return m.reply('❌ Solo los administradores pueden degradar.');

  let who;
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    who = m.mentionedJid[0];
  } else if (args[0]) {
    const num = args[0].replace(/[^0-9]/g, '');
    if (num) who = num + '@s.whatsapp.net';
  } else {
    return m.reply('❌ Menciona a un usuario o escribe su número.\nEjemplo: .demote @usuario\n.demote 51929264225');
  }

  if (!who) return m.reply('❌ No se pudo identificar al usuario.');
  if (who === conn.user.id) return m.reply('❌ No puedo degradarme a mí mismo.');

  const metadata = await conn.groupMetadata(m.chat);
  const participant = metadata.participants.find(p => p.id === who);
  if (!participant?.admin) return m.reply('❌ Ese usuario no es administrador.');

  try {
    await conn.groupParticipantsUpdate(m.chat, [who], 'demote');
    m.reply(`✅ @${who.split('@')[0]} ya no es administrador.`, { mentions: [who] });
  } catch (e) {
    m.reply(`❌ Error al degradar: ${e.message}`);
  }
};

handler.help = ['demote @usuario/número'];
handler.tags = ['group'];
handler.command = ['demote', 'degradar', 'quitaradmin'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;
export default handler;