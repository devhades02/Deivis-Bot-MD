let handler = async (m, { conn }) => {
  let users = Object.entries(global.db.users)
    .filter(([id, u]) => u && u.level > 0)
    .sort((a, b) => b[1].level - a[1].level || b[1].exp - a[1].exp)
    .slice(0, 10);
  if (!users.length) return m.reply('📊 Aún no hay usuarios con nivel.');

  let txt = `🏆 *TOP 10 - NIVEL* 🏆\n\n`;
  for (let i = 0; i < users.length; i++) {
    let [jid, u] = users[i];
    txt += `${i+1}. @${jid.split('@')[0]} - Nivel ${u.level} (${u.exp} exp)\n`;
  }
  await conn.sendMessage(m.chat, { text: txt, mentions: users.map(u => u[0]) }, { quoted: m });
};
handler.help = ['top'];
handler.tags = ['rpg'];
handler.command = ['top', 'lb', 'leaderboard'];
export default handler;