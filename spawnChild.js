import { encryptFile } from './lib/cryptoFunctions.js'

try {
  let parentPublicKey

  process.on('message', (message) => {
    if (!parentPublicKey) {
      const parsedMessage = JSON.parse(message.toString())
      parentPublicKey = parsedMessage.publicKey
    } else {
      const encrypted = encryptFile(parentPublicKey, message)
      process.send(encrypted)
    }
  })

  process.stderr.on('data', (data) => {
    console.error(data)
  })
} catch (error) {
  console.error(error.message)
}
