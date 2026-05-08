import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

let handler = async (m, { conn, isOwner, isMod }) => {
  if (!isOwner && !isMod) return m.reply('❌ Solo el owner o moderadores pueden hacer backup.');

  let backupDir = './backups';
  try { await fs.mkdir(backupDir, { recursive: true }); } catch {}

  let date = new Date().toISOString().replace(/[:.]/g, '-');
  let zipFile = path.join(backupDir, `deivis-backup-${date}.zip`);

  try {
    let cmd = `cd .. && zip -r DeivisBot/${zipFile} DeivisBot -x "DeivisBot/node_modules/*" "DeivisBot/session/*" "DeivisBot/backups/*" "DeivisBot/tmp/*"`;
    await promisify(exec)(cmd, { timeout: 60000 });

    let buffer = await fs.readFile(zipFile);
    await conn.sendMessage(m.sender, {
      document: buffer,
      fileName: `deivis-backup-${date}.zip`,
      mimetype: 'application/zip',
      caption: `✅ Backup completado: ${new Date().toLocaleString()}`
    }, { quoted: m });
    m.reply('✅ Backup enviado por privado.');
  } catch (e) {
    m.reply(`❌ Error al crear backup: ${e.message}`);
  }
};
handler.help = ['backup'];
handler.tags = ['tools'];
handler.command = ['backup', 'respaldo'];
handler.mods = true;
export default handler;