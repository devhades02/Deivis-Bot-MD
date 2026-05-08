let handler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Solo los owners pueden cambiar el modo del bot.');

  const option = args[0]?.toLowerCase();
  if (!option || !['on', 'off'].includes(option))
    return m.reply(`❌ Uso: .mode on/off\non = Modo público (todos pueden usar)\noff = Modo privado (solo tú y admins)`);

  let s = global.db.settings[global.conn.user.jid] || {};
  s.self = option === 'off'; // self = true => modo privado
  global.db.settings[global.conn.user.jid] = s;

  m.reply(`✅ Modo del bot ahora es: *${s.self ? 'PRIVADO (solo owner/admins)' : 'PÚBLICO (todos pueden usar)'}*`);
};
handler.help = ['mode on/off'];
handler.tags = ['owner'];
handler.command = ['mode'];
handler.owner = true;
export default handler;