let handler = async (m, { conn }) => {
  let user = global.db.users[m.sender];
  if (!user) return m.reply('❌ No tienes perfil aún. Escribe algo para crear uno.');

  let expNecesaria = (user.level || 0) * 150 + 100;
  let expActual = user.exp || 0;
  let porcentaje = Math.min(100, Math.floor((expActual / expNecesaria) * 100));
  let barra = '█'.repeat(Math.floor(porcentaje / 10)) + '░'.repeat(10 - Math.floor(porcentaje / 10));

  let txt = `╭───── ★ TU PROGRESO ★ ─────╮\n`;
  txt += `👤 @${m.sender.split('@')[0]}\n`;
  txt += `🏆 Nivel: ${user.level || 0}  |  ⭐ Rol: ${user.role || 'Novato'}\n`;
  txt += `⚡ Exp: ${expActual} / ${expNecesaria}\n`;
  txt += `📊 [${barra}] ${porcentaje}%\n`;
  txt += `💰 Monedas: ${user.money || 0}  |  💎 Diamantes: ${user.diamond || 0}\n`;
  txt += `⛏️ Pico: ${user.pickaxe || 1}  |  💎 Premium: ${user.premium ? 'Sí' : 'No'}\n`;
  txt += `╰──────────────────────────────╯`;
  await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] }, { quoted: m });
};
handler.help = ['perfil'];
handler.tags = ['rpg'];
handler.command = ['perfil', 'stats', 'progreso'];
export default handler;