// plugins/_handler-buttons.js
const { proto, generateWAMessage, areJidsSameUser } = (await import('@whiskeysockets/baileys')).default;

export async function all(m, chatUpdate) {
  // Solo actúa sobre respuestas de botones/interactivas
  if (!m.message) return;
  if (!(
    m.message.buttonsResponseMessage ||
    m.message.templateButtonReplyMessage ||
    m.message.listResponseMessage ||
    m.message.interactiveResponseMessage
  )) return;

  let id;
  if (m.message.buttonsResponseMessage) {
    id = m.message.buttonsResponseMessage.selectedButtonId;
  } else if (m.message.templateButtonReplyMessage) {
    id = m.message.templateButtonReplyMessage.selectedId;
  } else if (m.message.listResponseMessage) {
    id = m.message.listResponseMessage.singleSelectReply?.selectedRowId;
  } else if (m.message.interactiveResponseMessage) {
    id = JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id;
  }

  const text =
    m.message.buttonsResponseMessage?.selectedDisplayText ||
    m.message.templateButtonReplyMessage?.selectedDisplayText ||
    m.message.listResponseMessage?.title ||
    id;

  let isIdMessage = false;
  let usedPrefix;

  // Buscar si el ID coincide con algún comando registrado
  for (const name in global.plugins) {
    const plugin = global.plugins[name];
    if (!plugin || plugin.disabled) continue;
    if (global.opts?.restrict && plugin.tags?.includes('admin')) continue;
    if (typeof plugin !== 'function' && !plugin.command) continue;

    const str2Regex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    const prefix = plugin.customPrefix || global.prefix;
    const match = (
      prefix instanceof RegExp
        ? [[prefix.exec(id), prefix]]
        : Array.isArray(prefix)
          ? prefix.map(p => {
              const re = p instanceof RegExp ? p : new RegExp(str2Regex(p));
              return [re.exec(id), re];
            })
          : typeof prefix === 'string'
            ? [[new RegExp(str2Regex(prefix)).exec(id), new RegExp(str2Regex(prefix))]]
            : [[[], new RegExp]]
    ).find(p => p[1]);

    if ((usedPrefix = (match[0] || '')[0])) {
      const noPrefix = id.replace(usedPrefix, '');
      let [command] = noPrefix.trim().split(' ').filter(v => v);
      command = (command || '').toLowerCase();

      const isMatch =
        plugin.command instanceof RegExp
          ? plugin.command.test(command)
          : Array.isArray(plugin.command)
            ? plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(command) : cmd === command)
            : typeof plugin.command === 'string'
              ? plugin.command === command
              : false;

      if (!isMatch) continue;
      isIdMessage = true;
    }
  }

  // Generar el mensaje de respuesta
  const messages = await generateWAMessage(
    m.chat,
    { text: isIdMessage ? id : text, mentions: m.mentionedJid },
    {
      userJid: this.user.id,
      quoted: m.quoted?.fakeObj,
    }
  );

  messages.key.fromMe = areJidsSameUser(m.sender, this.user.id);
  messages.key.id = m.key.id;
  messages.pushName = m.pushName;
  if (m.isGroup) messages.key.participant = messages.participant = m.sender;

  const msg = {
    ...chatUpdate,
    messages: [proto.WebMessageInfo.fromObject(messages)].map(v => (v.conn = this, v)),
    type: 'append',
  };

  this.ev.emit('messages.upsert', msg);
}