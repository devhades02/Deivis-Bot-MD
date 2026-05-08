let prices = { pickaxe: 50, potion: 25, diamond: 250 };

let handler = async (m, { conn, args, isOwner }) => {
  let user = global.db.users[m.sender];
  if (!user) return m.reply('❌ No tienes perfil aún.');

  if (!args[0]) {
    let txt = `💸 *VENTA DE ITEMS*\n\n`;
    for (let item in prices) txt += `*${item}* - ${prices[item]} 💰\n`;
    txt += `\nUsa: .sell <item> [cantidad]`;
    return m.reply(txt);
  }

  let item = args[0].toLowerCase();
  let amount = parseInt(args[1]) || 1;
  if (!prices[item]) return m.reply(`❌ Item no válido. Disponibles: ${Object.keys(prices).join(', ')}`);

  let userCount = item === 'pickaxe' ? (user.pickaxe || 1) : (user[item] || 0);
  if (userCount < amount) return m.reply(`❌ No tienes suficientes ${item}. Tienes: ${userCount}`);
  if (item === 'pickaxe' && userCount - amount < 1) return m.reply('❌ No puedes vender tu último pico.');

  let total = prices[item] * amount;
  if (item === 'pickaxe') user.pickaxe -= amount;
  else user[item] -= amount;
  user.money = (user.money || 0) + total;
  if (isOwner) user.money += total * 0.5; // Bono owner 50%

  m.reply(`✅ *Venta exitosa*\n${amount}x ${item}\nRecibiste: ${total} 💰${isOwner ? ` + Bono: ${total*0.5} 💰` : ''}\n💰 Balance: ${user.money}`);
};
handler.help = ['sell <item> [cantidad]'];
handler.tags = ['rpg'];
handler.command = ['sell', 'vender'];
handler.register = true;
export default handler;