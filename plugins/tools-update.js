import { exec } from 'child_process';
import { promisify } from 'util';

let handler = async (m, { conn, isOwner, isMod }) => {
  if (!isOwner && !isMod) return m.reply('❌ Solo el owner o moderadores pueden actualizar el bot.');

  let msg = await m.reply('⏳ Actualizando desde GitHub...');
  try {
    let { stdout } = await promisify(exec)('git pull', { timeout: 30000 });
    await conn.sendMessage(m.chat, { text: `✅ *Actualización completada:*\n\`\`\`\n${stdout.trim()}\n\`\`\`\nReiniciando...`, edit: msg.key });
    process.exit(0);
  } catch (e) {
    await conn.sendMessage(m.chat, { text: `❌ *Error al actualizar:*\n\`\`\`\n${e.message}\n\`\`\``, edit: msg.key });
  }
};
handler.help = ['update'];
handler.tags = ['tools'];
handler.command = ['update', 'actualizar'];
handler.mods = true;
export default handler;