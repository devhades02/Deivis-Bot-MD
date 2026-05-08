let handler = async (m, { conn }) => {
  const start = Date.now();
  let msg = await m.reply('🏓 Ping!');
  const end = Date.now();
  // Editar el mensaje con la velocidad
  await conn.sendMessage(m.chat, { text: `⚡ Velocidad: ${end - start} ms`, edit: msg.key });
};

handler.help = ['ping'];
handler.tags = ['info'];
handler.command = ['ping'];

export default handler;