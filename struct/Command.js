class Command {
  constructor(options = {}) {
    this.name = options.name
    this.aliases = options.aliases || []
    this.category = options.category
    this.description = options.description || 'command.withoutDescription'

    this.onlyBotOwner = options.onlyBotOwner || false
    this.onlyBotStaff = options.onlyBotStaff || false
  }

  register(client) {
    this.client = client
    this.client.commands.set(this.name, this)
    this.aliases.map((alias) => this.client.aliases.set(alias, this.name))
  }

  async execute(message) {

    const content = message.body.split(' ')
    const args = content.slice(1)

    try {
      //await this.run({ message, args }, group)
      await this.run({ message, args })
    } catch (err) {
      console.log(err)
    }
  }

}

module.exports = Command
