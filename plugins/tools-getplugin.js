import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let handler = async (m, { conn, text, isOwner, isMod }) => {
  if (!isOwner && !isMod) return m.reply('❌ Solo el owner o moderadores pueden obtener el código de un plugin.');
  if (!text) return m.reply('❌ Escribe el nombre del plugin (ej: rpg-perfil.js)');
  let filePath = path.join(__dirname, text);
  if (!text.endsWith('.js')) filePath += '.js';
  try {
    let code = await fs.readFile(filePath, 'utf-8');
    if (code.length > 4000) code = code.slice(0, 4000) + '\n\n... (truncado)';
    m.reply(`📄 *${text}*\n\`\`\`\n${code}\n\`\`\``);
  } catch (e) {
    m.reply(`❌ No se encontró el plugin: ${text}`);
  }
};
handler.help = ['getplugin <nombre>'];
handler.tags = ['tools'];
handler.command = ['getplugin', 'gp'];
handler.mods = true;
export default handler;