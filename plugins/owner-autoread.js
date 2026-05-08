let handler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Solo los owners pueden usar este comando.');

  const option = args[0]?.toLowerCase();
  if (!option || !['on', 'off'].includes(option))
    return m.reply(`❌ Uso: .autoread on/off`);

  let s = global.db.settings[global.conn.user.jid] || {};
  s.autoread = option === 'on';
  global.db.settings[global.conn.user.jid] = s;

  m.reply(`✅ AutoRead ahora está *${s.autoread ? 'ACTIVADO' : 'DESACTIVADO'}*`);
};
handler.help = ['autoread on/off'];
handler.tags = ['owner'];
handler.command = ['autoread'];
handler.owner = true;
export default handler;