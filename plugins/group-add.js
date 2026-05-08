const handler = async (m, { conn, args, isAdmin, isOwner, isBotAdmin }) => {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.');
  if (!isBotAdmin) return m.reply('❌ El bot necesita ser administrador para agregar.');
  if (!isAdmin && !isOwner) return m.reply('❌ Solo los administradores pueden agregar.');

  if (!args[0]) return m.reply('❌ Escribe el número del usuario.\nEjemplo: .add 51929264225');
  const who = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';

  try {
    await conn.groupParticipantsUpdate(m.chat, [who], 'add');
    m.reply(`✅ @${who.split('@')[0]} ha sido agregado al grupo.`, { mentions: [who] });
  } catch (e) {
    m.reply(`❌ Error al agregar: ${e.message}`);
  }
};

handler.help = ['add <número>'];
handler.tags = ['group'];
handler.command = ['add', 'agregar'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;
export default handler;