const Command = require('../../struct/Command')
const reloadCommands = require('../../utils/reloadCommands')

class Reload extends Command {
  constructor() {
    super({
      name: 'reload',
			aliases: ['r']
    });
  }

  async run({ message, args }) {
    reloadCommands(this.client)
    await this.client.sendText(message.from, 'Reiniciando Comandos...')
  }
}

module.exports = new Reload();
