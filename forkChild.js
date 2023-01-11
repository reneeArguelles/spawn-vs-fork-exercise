import { encryptFile } from './lib/cryptoFunctions.js'

process.on('message', (message) => {
  const { publicKey, fileObject } = message
  const encrypted = encryptFile(publicKey, Buffer.from(JSON.stringify(fileObject)))
  process.send(encrypted)
})

process.stderr.on('data', (data) => {
  console.error(data)
})
