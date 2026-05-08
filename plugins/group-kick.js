const handler = async (m, { conn, args, isAdmin, isOwner, isBotAdmin }) => {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.');
  if (!isBotAdmin) return m.reply('❌ El bot necesita ser administrador para expulsar.');
  if (!isAdmin && !isOwner) return m.reply('❌ Solo los administradores pueden expulsar.');

  let who;
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    who = m.mentionedJid[0];
  } else if (args[0]) {
    const num = args[0].replace(/[^0-9]/g, '');
    if (num) who = num + '@s.whatsapp.net';
  } else {
    return m.reply('❌ Menciona a un usuario o escribe su número.\nEjemplo: .kick @usuario\n.kick 51929264225');
  }

  if (!who) return m.reply('❌ No se pudo identificar al usuario.');
  if (who === conn.user.id) return m.reply('❌ No puedo expulsarme a mí mismo.');
  if (who === m.sender) return m.reply('❌ No puedes expulsarte a ti mismo.');

  const metadata = await conn.groupMetadata(m.chat);
  const participant = metadata.participants.find(p => p.id === who);
  if (participant?.admin) return m.reply('❌ No puedes expulsar a un administrador.');

  try {
    await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
    m.reply(`✅ @${who.split('@')[0]} ha sido expulsado.`, { mentions: [who] });
  } catch (e) {
    m.reply(`❌ Error al expulsar: ${e.message}`);
  }
};

handler.help = ['kick @usuario/número'];
handler.tags = ['group'];
handler.command = ['kick', 'expulsar', 'ban'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;
export default handler;