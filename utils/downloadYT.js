const ytdl = require('ytdl-core')
const { default: buri } = require('buffer-to-data-url')
const path = require('path')
const fs = require('fs')

module.exports = async ({ client, message, user }) => {
	const { video } = user
	const option = video.labels[Number(message.body-1)]

	await client.sendText(message.from, `Baixando "${video.title}" em ${option.quality}`)

	const title = video.title.replace(/[\/\\|?<>*:“]/gm, '-')

	await new Promise((resolve, reject) => {
    const stream = ytdl(video.url, {
      format: 'mp4',
      quality: option.itag,
			filter: 'videoandaudio',
			/*requestOptions: {
				headers: {
					'Cookie'
				}
			}*/
    })
		.pipe(fs.createWriteStream(path.resolve(__dirname, '..', 'downloads', `${title}-${option.quality}.mp4`)))
    .on('finish', () => {
			resolve()
			stream.close()
		})
  })

  const videoBuffer = fs.readFileSync((path.resolve(__dirname, '..', 'downloads', `${title}-${option.quality}.mp4`)))
  const dataURL = buri('video/mp4', videoBuffer)

  //console.log(dataURL)

  await client.sendFile(
    message.from,
    dataURL,
    `${title}-${option.quality}.mp4`,
    'Seu video :)'
  )

	client.chats.delete(`${message.type}/${message.from}`)
}
