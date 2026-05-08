import { exec } from 'child_process';
import { promisify } from 'util';
const execPromise = promisify(exec);

let handler = async (m, { conn, text, isOwner, isMod }) => {
  if (!isOwner && !isMod) return m.reply('❌ Solo el owner o moderadores pueden usar este comando.');
  if (!text) return m.reply('❌ Ingresa un comando de terminal.');

  let msg = await m.reply('⏳ Ejecutando...');
  try {
    let { stdout, stderr } = await execPromise(text, { timeout: 30000 });
    let result = '';
    if (stdout) result += `✅ *Salida:*\n\`\`\`\n${stdout.trim()}\n\`\`\``;
    if (stderr) result += `\n⚠️ *Error:*\n\`\`\`\n${stderr.trim()}\n\`\`\``;
    if (!result) result = '✅ Comando ejecutado sin salida.';
    await conn.sendMessage(m.chat, { text: result, edit: msg.key });
  } catch (e) {
    await conn.sendMessage(m.chat, { text: `❌ *Error:*\n\`\`\`\n${e.message}\n\`\`\``, edit: msg.key });
  }
};
handler.help = ['$ <comando>'];
handler.tags = ['tools'];
handler.command = ['$', 'exec'];
handler.mods = true;
export default handler;