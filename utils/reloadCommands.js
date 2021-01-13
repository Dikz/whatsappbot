const Loader = require('../struct/LoaderCommands')
const { resolve } = require('path')

module.exports = client => {

  client.commands.forEach(command => {
    delete require.cache[require.resolve(command.path)]
  })

  client.commands.clear()
  const loader = new Loader(client);
  loader.Load(resolve(__dirname, '..', 'commands'));
}
