let handler = async (m, { conn, isOwner, isMod }) => {
  if (!isOwner && !isMod) return m.reply('❌ Solo el owner o moderadores pueden reiniciar el bot.');
  await m.reply('🔄 Reiniciando Deivis Bot...');
  process.exit(0);
};
handler.help = ['restart'];
handler.tags = ['tools'];
handler.command = ['restart', 'reiniciar'];
handler.mods = true;
export default handler;