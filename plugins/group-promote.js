const handler = async (m, { conn, args, isAdmin, isOwner, isBotAdmin }) => {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.');
  if (!isBotAdmin) return m.reply('❌ El bot necesita ser administrador para promover.');
  if (!isAdmin && !isOwner) return m.reply('❌ Solo los administradores pueden promover.');

  let who;
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    who = m.mentionedJid[0];
  } else if (args[0]) {
    const num = args[0].replace(/[^0-9]/g, '');
    if (num) who = num + '@s.whatsapp.net';
  } else {
    return m.reply('❌ Menciona a un usuario o escribe su número.\nEjemplo: .promote @usuario\n.promote 51929264225');
  }

  if (!who) return m.reply('❌ No se pudo identificar al usuario.');

  const metadata = await conn.groupMetadata(m.chat);
  const participant = metadata.participants.find(p => p.id === who);
  if (participant?.admin) return m.reply('❌ Ese usuario ya es administrador.');

  try {
    await conn.groupParticipantsUpdate(m.chat, [who], 'promote');
    m.reply(`✅ @${who.split('@')[0]} ahora es administrador.`, { mentions: [who] });
  } catch (e) {
    m.reply(`❌ Error al promover: ${e.message}`);
  }
};

handler.help = ['promote @usuario/número'];
handler.tags = ['group'];
handler.command = ['promote', 'promover', 'admin'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;
export default handler;