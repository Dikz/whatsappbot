const Command = require('../struct/Command')
const ig = require('instagram-save')
const { default: buri } = require('buffer-to-data-url')
const { resolve } = require('path')
const fs = require('fs')

class Insta extends Command {
  constructor() {
    super({
      name: 'insta',
			aliases: ['ig']
    });
  }

  async run({ message, args }) {
    const url = args[0]
		const urlFormated = url.replace('https://www.instagram.com/p/', '')
		.replace('https://www.instagram.com/reel/', '')
		.replace('https://www.instagram.com/tv/', '').split('/')[0]

		console.log(urlFormated)

    if(!url) return this.client.sendText(message.from, `Você não informou o link do video`)

		await this.client.sendText(message.from, `Opa, vou começar baixar o video: ${urlFormated}`)

		await this.client.simulateTyping(message.from, true)

		await ig('https://www.instagram.com/p/'+urlFormated, resolve(__dirname, '..', 'downloads'))
		.then(async response => {
			const id = response.url.replace('https://www.instagram.com/p/', '')

			const videoBuffer = fs.readFileSync((resolve(__dirname, '..', 'downloads', `${id}.mp4`)))
			const dataURL = buri('video/mp4', videoBuffer)

			await this.client.sendFile(
				message.from,
				dataURL,
				`${id}.mp4`,
				'Seu video :)'
			)

			await this.client.simulateTyping(message.from, false)
		})
		.catch(err => {
			this.client.sendText(message.from, `Deu algo errado ao baixar o: ${urlFormated}.mp4 :[`)
		})


  }
}

module.exports = new Insta();
