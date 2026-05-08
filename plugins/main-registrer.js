// plugins/main-register.js
import moment from 'moment-timezone';
import pkg from 'awesome-phonenumber';
const { parsePhoneNumber } = pkg;

let handler = async (m, { conn, text }) => {
  let user = global.db?.users?.[m.sender];
  if (!user) return m.reply('❌ Primero debes enviar un mensaje al bot para crear tu perfil.');

  // Si ya está registrado, mostramos su perfil bonito en lugar de repetir el registro
  if (user.registered) {
    let pp;
    try {
      pp = await conn.profilePictureUrl(m.sender, 'image');
    } catch {
      pp = 'https://i.ibb.co/whs9jxJ/menu.jpg'; // Imagen por defecto si no tiene foto
    }

    // Obtener bandera del país
    let country = 'Desconocida';
    try {
      let num = m.sender.split('@')[0];
      let pn = parsePhoneNumber('+' + num);
      if (pn && pn.country) {
        country = pn.country.toUpperCase();
        // Agregar bandera con emoji
        let flag = getFlagEmoji(pn.country);
        country = flag + ' ' + country;
      }
    } catch {}

    let name = user.name || await conn.getName(m.sender);
    let age = user.age || '?';
    let exp = user.exp || 0;
    let money = user.money || 0;
    let diamond = user.diamond || 0;
    let level = user.level || 0;
    let role = user.role || '♛ Novato';
    let fecha = moment(user.regTime || Date.now()).format('DD/MM/YYYY');

    let caption = `╭─ ✦ ${global.packname || 'Deivis Bot'} ✦ ─╮\n`;
    caption += `👤 ${name}\n`;
    caption += `🎂 Edad: ${age}\n`;
    caption += `📍 País: ${country}\n`;
    caption += `♛ Rango: ${role}\n`;
    caption += `🏆 Nivel: ${level}\n`;
    caption += `⚡ Experiencia: ${exp} pts\n`;
    caption += `💰 Monedas: ${money}\n`;
    caption += `💎 Diamantes: ${diamond}\n`;
    caption += `📅 Registrado: ${fecha}\n`;
    caption += `╰────────────────────❖`;

    // Enviar imagen con caption y botón al menú
    await conn.sendMessage(m.chat, {
      image: { url: pp },
      caption,
      footer: global.wm || 'Deivis Bot',
      buttons: [
        { buttonId: '.menu', buttonText: { displayText: '📋 VER MENÚ' }, type: 1 }
      ],
      headerType: 4
    }, { quoted: m });
    return;
  }

  // ─── PROCESO DE REGISTRO ──────────────────
  if (!text) return m.reply(`❌ Uso: .reg Nombre.Edad\nEjemplo: .reg Hady.16`);

  let parts = text.split('.');
  if (parts.length < 2) return m.reply(`❌ Formato incorrecto.\nUso: .reg Nombre.Edad`);

  let name = parts[0].trim();
  let age = parseInt(parts[1]);

  if (!name || name.length < 2) return m.reply('❌ El nombre debe tener al menos 2 caracteres.');
  if (!age || isNaN(age)) return m.reply('❌ La edad debe ser un número.');
  if (age > 150) return m.reply(`😂 ¿${age} años? ¡Eres más viejo que Matusalén! Usa una edad real.`);
  if (age < 5) return m.reply(`🍼 ¿${age} años? Apenas sabes caminar. Pon tu edad de verdad.`);

  user.name = name;
  user.age = age;
  user.registered = true;
  user.regTime = Date.now();

  // Obtener foto de perfil
  let pp;
  try {
    pp = await conn.profilePictureUrl(m.sender, 'image');
  } catch {
    pp = 'https://i.ibb.co/whs9jxJ/menu.jpg';
  }

  // Obtener bandera
  let country = 'Desconocida';
  try {
    let num = m.sender.split('@')[0];
    let pn = parsePhoneNumber('+' + num);
    if (pn && pn.country) {
      country = pn.country.toUpperCase();
      let flag = getFlagEmoji(pn.country);
      country = flag + ' ' + country;
    }
  } catch {}

  let caption = `╭─ ✦ ${global.packname || 'Deivis Bot'} ✦ ─╮\n`;
  caption += `✅ *REGISTRO EXITOSO*\n\n`;
  caption += `👤 Nombre: ${name}\n`;
  caption += `🎂 Edad: ${age}\n`;
  caption += `📍 País: ${country}\n`;
  caption += `♛ Rango: ${user.role || '♛ Novato'}\n`;
  caption += `🏆 Nivel: ${user.level || 0}\n`;
  caption += `⚡ Experiencia: ${user.exp || 0} pts\n`;
  caption += `💰 Monedas: ${user.money || 0}\n`;
  caption += `💎 Diamantes: ${user.diamond || 0}\n`;
  caption += `📅 Fecha: ${moment().format('DD/MM/YYYY')}\n`;
  caption += `╰────────────────────❖\n\n`;
  caption += `¡Ahora puedes usar todos los comandos!`;

  // Enviar imagen con caption y botón al menú
  await conn.sendMessage(m.chat, {
    image: { url: pp },
    caption,
    footer: global.wm || 'Deivis Bot',
    buttons: [
      { buttonId: '.menu', buttonText: { displayText: '📋 IR AL MENÚ' }, type: 1 }
    ],
    headerType: 4
  }, { quoted: m });
};

// Función para obtener emoji de bandera a partir del código de país
function getFlagEmoji(countryCode) {
  try {
    let codePoints = countryCode.toUpperCase().split('').map(c => 127397 + c.charCodeAt());
    return String.fromCodePoint(...codePoints);
  } catch {
    return '';
  }
}

handler.help = ['reg nombre.edad'];
handler.tags = ['main'];
handler.command = ['reg', 'registrar', 'verificar'];
export default handler;