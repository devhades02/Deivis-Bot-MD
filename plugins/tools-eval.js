import util from 'util';

let handler = async (m, { conn, text, isOwner, isMod }) => {
  if (!isOwner && !isMod) return m.reply('❌ Solo el owner o moderadores pueden usar este comando.');
  if (!text) return m.reply('❌ Ingresa un código JavaScript.');

  let result;
  try {
    result = await eval(`(async () => { ${text} })()`);
  } catch (e) {
    result = e.message;
  }

  let output = util.inspect(result, { depth: null });
  if (output.length > 4000) output = output.slice(0, 4000) + '... (truncado)';
  await m.reply(`*📥 Resultado:*\n\`\`\`\n${output}\n\`\`\``);
};
handler.help = ['> <código>'];
handler.tags = ['tools'];
handler.command = ['>', 'eval', 'ev'];
handler.mods = true;
export default handler;