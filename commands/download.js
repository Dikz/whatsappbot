const Command = require('../struct/Command')
const ytdl = require('ytdl-core')

class Download extends Command {
  constructor() {
    super({
      name: 'download',
      aliases: ['baixar']
    });
  }

  async run({ message, args }) {
    const url = args[0]

    if(!url) return this.client.sendText(message.from, `Você não informou o link do video`)

    const info = await ytdl.getInfo(url);

    const {
			title,
			author,
			lengthSeconds,
			viewCount,
			thumbnails,
			likes,
			dislikes
		} = info.videoDetails

    const infos = `*Titulo:* ${title}
		*Canal:* ${author.name}
		*Visualizações:* ${viewCount}
		*Likes:* ${likes}
		*Dislikes:* ${dislikes}`.replace(/[\t]/gm, '')

    await this.client.sendImage(
      message.from,
      thumbnails[1].url,
      title,
      infos
    )

		const formats = info.formats.filter(
			format => format.container === 'mp4'
			&& format.hasVideo && format.hasAudio
		)

		const labels = formats.map(format => {
			const { qualityLabel } = format

			const reformated = {
				format: format.container,
				quality: qualityLabel,
				itag: format.itag
			}

			return reformated
		})

		//console.log(labels)
		const labelsText = labels.map((label, i) => {
			return `[${i+1}] *${label.quality}*`
		}).join('\n')

		const user = {
			stage: 'quality',
			options: {},
			video: {
				url,
				labels,
				title,
				author: author.name
			}
		}

		this.client.chats.set(`${message.type}/${message.from}`, user)

		this.client.sendText(
			message.from,
			`*Escolha a qualidade:*\n\n${labelsText}`
		)

  }
}

module.exports = new Download();
