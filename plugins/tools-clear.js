import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tmpDir = path.join(__dirname, '..', 'tmp');

let handler = async (m, { conn, isOwner, isMod }) => {
  if (!isOwner && !isMod) return m.reply('❌ Solo el owner o moderadores pueden limpiar la carpeta temporal.');
  try {
    let files = await fs.readdir(tmpDir);
    for (let file of files) {
      try { await fs.unlink(path.join(tmpDir, file)); } catch {}
    }
    m.reply(`✅ Carpeta tmp limpiada. ${files.length} archivos eliminados.`);
  } catch (e) {
    m.reply(`❌ Error: ${e.message}`);
  }
};
handler.help = ['clear'];
handler.tags = ['tools'];
handler.command = ['clear', 'cleartmp'];
handler.mods = true;
export default handler;