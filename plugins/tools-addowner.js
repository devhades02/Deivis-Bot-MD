// plugins/owner-addowner2.js
let handler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Solo el owner oficial puede agregar owners.');

  // Determinar si es permanente (flag --perm o --permanente)
  let isPermanent = args.some(arg => arg === '--perm' || arg === '--permanente');
  args = args.filter(arg => arg !== '--perm' && arg !== '--permanente');

  let who;
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    who = m.mentionedJid[0];
  } else if (args[0]) {
    let num = args[0].replace(/[^0-9]/g, '');
    if (num) who = num + '@s.whatsapp.net';
  } else {
    return m.reply('❌ Menciona a un usuario o escribe su número.\nEjemplo: .addowner @usuario\n.addowner 51929264225\n.addowner @usuario --perm (permanente)');
  }

  if (!who) return m.reply('❌ No se pudo identificar al usuario.');

  let num = who.split('@')[0];
  let name = await conn.getName(who);

  // Verificar si ya es owner
  if (global.owner.some(o => o[0] === num)) {
    return m.reply(`⚠️ @${num} ya es owner.`, { mentions: [who] });
  }

  // Agregar a la lista global
  global.owner.push([num, name, isPermanent]);

  // Beneficios en la base de datos
  let user = global.db.users[who];
  if (!user) {
    global.db.users[who] = {};
    user = global.db.users[who];
  }
  user.level = 99;
  user.role = isPermanent ? '👑 Owner Permanente' : '👑 Owner';
  user.premium = true;
  user.premiumTime = isPermanent ? -1 : Date.now() + 10 * 365 * 86400000; // 10 años si no es permanente
  user.money = 999999;
  user.diamond = 999;
  user.registered = true;
  user.ownerPermanent = isPermanent;

  let txt = `✅ *Nuevo owner agregado*\n👤 @${num} (${name})\n🔰 Tipo: ${isPermanent ? 'Permanente' : 'Secundario'}\n📅 Ahora tiene privilegios de owner.`;
  await conn.sendMessage(m.chat, { text: txt, mentions: [who] }, { quoted: m });
};

handler.help = ['addowner @usuario/número [--perm]'];
handler.tags = ['owner'];
handler.command = ['addowner', 'addpropietario'];
handler.owner = true;
export default handler;