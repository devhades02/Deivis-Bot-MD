let handler = async (m, { conn, isOwner, isMod }) => {
  if (!isOwner && !isMod) return m.reply('❌ Solo el owner o moderadores pueden ver la lista de plugins.');
  let plugins = Object.keys(global.plugins);
  if (!plugins.length) return m.reply('📦 No hay plugins cargados.');
  let txt = `📦 *Plugins cargados: ${plugins.length}*\n\n`;
  plugins.forEach((p, i) => txt += `${i + 1}. ${p}\n`);
  m.reply(txt);
};
handler.help = ['listplugins'];
handler.tags = ['tools'];
handler.command = ['listplugins', 'plugins'];
handler.mods = true;
export default handler;