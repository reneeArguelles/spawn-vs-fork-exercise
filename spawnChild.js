import { encryptFile } from './lib/cryptoFunctions.js'

process.stdin.on('data', (data) => {
  const { publicKey, fileObject } = JSON.parse(data.toString())
  const encrypted = encryptFile(publicKey, Buffer.from(JSON.stringify(fileObject)))
  process.stdout.write(encrypted)
})

process.stderr.on('data', (data) => {
  console.error(data.message)
})
