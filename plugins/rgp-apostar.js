let handler = async (m, { conn, args, isOwner }) => {
  let user = global.db.users[m.sender];
  if (!user) return m.reply('❌ No tienes perfil aún.');

  let amount = parseInt(args[0]);
  if (!amount || amount <= 0) return m.reply(`❌ Uso: .apostar <cantidad>`);
  if (!isOwner && user.money < amount) return m.reply(`❌ No tienes suficiente. Tienes ${user.money} 💰`);

  let win = Math.random() < 0.4;
  if (win) {
    if (!isOwner) user.money += amount * 1; // recupera + gana igual
    else user.money += amount * 2; // owner gana el doble
    m.reply(`🎰 *¡Ganaste!* +${amount * (isOwner ? 3 : 2)} 💰\n💰 Balance: ${user.money}`);
  } else {
    if (!isOwner) user.money -= amount;
    m.reply(`😢 *Perdiste* -${amount} 💰\n💰 Balance: ${user.money}`);
  }
};
handler.help = ['apostar <cantidad>'];
handler.tags = ['rpg'];
handler.command = ['apostar', 'bet'];
handler.register = true;
export default handler;