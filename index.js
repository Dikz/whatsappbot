require('dotenv').config()
const wa = require('@open-wa/wa-automate')
const Loader = require('./struct/LoaderCommands')
const { resolve } = require('path')

wa.create().then(client => start(client))

function start(client) {
  client.commands = new Map()
  client.aliases = new Map();

  const loader = new Loader(client);
  loader.Load(resolve(__dirname, 'commands'));

  client.onMessage(async message => {

    const content = message.body.split(' ');
    const command = content[0];
    const commandFormated = command.slice(process.env.PREFIX.length).toLowerCase();

    if (!message.body.startsWith(process.env.PREFIX)) {
      //
    } else {
      const commandfile =
        client.commands.get(commandFormated) ||
        client.commands.get(client.aliases.get(commandFormated));
      if (commandfile) commandfile.execute(message);
    }
  })
}
