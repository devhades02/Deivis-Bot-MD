let items = {
  pickaxe: { price: 100, desc: '⛏️ Pico mejorado (aumenta ganancia de minería)' },
  potion: { price: 50, desc: '🧪 Poción de vida' },
  diamond: { price: 500, desc: '💎 Diamante premium' }
};

let handler = async (m, { conn, args, isOwner }) => {
  let user = global.db.users[m.sender];
  if (!user) return m.reply('❌ No tienes perfil aún.');

  if (!args[0]) {
    let txt = `🛒 *TIENDA DEIVIS BOT*\n\n`;
    for (let item in items) txt += `*${item}* - ${items[item].price} 💰\n${items[item].desc}\n\n`;
    txt += `Usa: .buy <item> [cantidad]`;
    return m.reply(txt);
  }

  let item = args[0].toLowerCase();
  let amount = parseInt(args[1]) || 1;
  if (!items[item]) return m.reply(`❌ Item no válido. Disponibles: ${Object.keys(items).join(', ')}`);

  let total = items[item].price * amount;
  if (!isOwner && user.money < total) return m.reply(`❌ Necesitas ${total} 💰. Tienes ${user.money} 💰`);

  if (!isOwner) user.money -= total;
  if (item === 'pickaxe') user.pickaxe = (user.pickaxe || 1) + amount;
  else if (item === 'potion') user.potion = (user.potion || 0) + amount;
  else if (item === 'diamond') user.diamond = (user.diamond || 0) + amount;

  let txt = `✅ *Compra exitosa*\n${amount}x ${item}\n`;
  if (!isOwner) txt += `Pagado: ${total} 💰\nBalance: ${user.money} 💰`;
  else txt += `Como owner, no se te cobró.\nBalance: ${user.money} 💰`;
  m.reply(txt);
};
handler.help = ['buy <item> [cantidad]'];
handler.tags = ['rpg'];
handler.command = ['buy', 'comprar'];
handler.register = true;
export default handler;