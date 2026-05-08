let handler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Solo los owners pueden cambiar el modo restrict.');

  const option = args[0]?.toLowerCase();
  if (!option || !['on', 'off'].includes(option))
    return m.reply(`❌ Uso: .restrict on/off\non = Solo admins pueden usar comandos\noff = Todos pueden usar comandos`);

  let s = global.db.settings[global.conn.user.jid] || {};
  s.restrict = option === 'on';
  global.db.settings[global.conn.user.jid] = s;

  m.reply(`✅ Modo restrict ahora está: *${s.restrict ? 'ACTIVADO (solo admins)' : 'DESACTIVADO (todos)'}*`);
};
handler.help = ['restrict on/off'];
handler.tags = ['owner'];
handler.command = ['restrict'];
handler.owner = true;
export default handler;