const Command = require('../struct/Command')

class Teste extends Command {
  constructor() {
    super({
      name: 'teste'
    });
  }

  async run({ message, args }) {
    await this.client.sendText(message.from, 'World')
  }
}

module.exports = new Teste();
