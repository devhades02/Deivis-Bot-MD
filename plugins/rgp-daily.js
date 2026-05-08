let handler = async (m, { conn, isOwner }) => {
  let user = global.db.users[m.sender];
  if (!user) return m.reply('❌ No tienes perfil aún.');

  let today = new Date().toDateString();
  if (!isOwner && user.lastDaily === today) return m.reply('🎁 Ya reclamaste tu regalo hoy. Vuelve mañana.');

  let recompensa = Math.floor(Math.random() * 50 + 20);
  if (isOwner) recompensa = Math.floor(recompensa * 3); // Owner recibe triple
  user.money = (user.money || 0) + recompensa;
  if (!isOwner) user.lastDaily = today;

  m.reply(`🎁 *Regalo diario${isOwner ? ' (Owner x3)' : ''}*\n\nRecibiste *${recompensa}* 💰\n💰 Balance: ${user.money}`);
};
handler.help = ['daily'];
handler.tags = ['rpg'];
handler.command = ['daily', 'regalo', 'claim'];
export default handler;