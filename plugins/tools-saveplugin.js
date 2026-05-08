import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let handler = async (m, { conn, text, isOwner, isMod }) => {
  if (!isOwner && !isMod) return m.reply('❌ Solo el owner o moderadores pueden crear plugins desde el chat.');
  if (!text) return m.reply('❌ Uso: .saveplugin <nombre> (responde al mensaje con el código)');
  let name = text.split(' ')[0];
  if (!name) return m.reply('❌ Especifica un nombre para el plugin (ej: miplugin.js)');
  if (!name.endsWith('.js')) name += '.js';
  let code = m.quoted ? m.quoted.text : text.replace(name, '').trim();
  if (!code) return m.reply('❌ Responde a un mensaje con el código del plugin o escríbelo después del nombre.');
  let filePath = path.join(__dirname, name);
  try {
    await fs.writeFile(filePath, code, 'utf-8');
    m.reply(`✅ Plugin *${name}* guardado correctamente.`);
  } catch (e) {
    m.reply(`❌ Error al guardar: ${e.message}`);
  }
};
handler.help = ['saveplugin <nombre>'];
handler.tags = ['tools'];
handler.command = ['saveplugin', 'sp'];
handler.mods = true;
export default handler;