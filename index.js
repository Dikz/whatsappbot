require('dotenv').config()
const wa = require('@open-wa/wa-automate')
const Loader = require('./struct/LoaderCommands')
const downloadVideo = require('./utils/downloadVideo')

const { resolve } = require('path')

wa.create({
  useChrome: true
}).then(client => start(client))

function start(client) {
  client.commands = new Map()
  client.aliases = new Map()
	client.chats = new Map()

  const loader = new Loader(client);
  loader.Load(resolve(__dirname, 'commands'));

  client.onMessage(async message => {
    if (!message.body.startsWith(process.env.PREFIX)) {
      const user = client.chats.get(`${message.type}/${message.from}`)

			if (!user) return

			switch(user.stage) {
				case 'quality':
					downloadVideo({ client, message, user })
					break;
			}
    } else {
			const content = message.body.split(' ');
			const command = content[0];
			const commandFormated = command.slice(process.env.PREFIX.length).toLowerCase();

      const commandfile =
        client.commands.get(commandFormated) ||
        client.commands.get(client.aliases.get(commandFormated));
      if (commandfile) commandfile.execute(message);
    }
  })
}
