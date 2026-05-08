let handler = async (m, { conn, isOwner }) => {
  let user = global.db.users[m.sender];
  if (!user) return m.reply('❌ No tienes perfil aún.');

  let today = new Date().toDateString();
  if (user.lastMineDate !== today) {
    user.mineCount = 0;
    user.lastMineDate = today;
  }

  if (!isOwner && (user.mineCount || 0) >= 2) return m.reply('⏳ Ya has minado 2 veces hoy. Vuelve mañana.');

  let pickaxe = user.pickaxe || 1;
  let ganancia = Math.floor(Math.random() * 30 + 15) * pickaxe;
  user.money = (user.money || 0) + ganancia;
  if (!isOwner) user.mineCount = (user.mineCount || 0) + 1;
  else ganancia = Math.floor(ganancia * 2); // Bonus para owner

  let txt = `⛏️ *${isOwner ? 'Minería Owner (ilimitada)' : 'Minería'}*\n\n`;
  txt += `Obtuviste *${ganancia}* 💰\n`;
  txt += `💰 Balance: ${user.money}\n`;
  if (!isOwner) txt += `🔢 Minas restantes hoy: ${2 - user.mineCount}`;
  m.reply(txt);
};
handler.help = ['minar'];
handler.tags = ['rpg'];
handler.command = ['minar', 'mine'];
export default handler;