import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve, basename } from 'node:path'
import dotenv from 'dotenv'
import {
  createKeyPair, decryptFile, signFile, verifyFile,
} from './lib/cryptoFunctions.js'

try {
  if (process.argv.length !== 3) {
    throw new Error('Invalid number of arguments. Must input a filepath / filename.')
  }

  dotenv.config()
  const { SECRET } = process.env

  const filePath = resolve(process.cwd(), process.argv[2])
  const fileContent = readFileSync(filePath, 'utf-8')
  const fileObject = {
    fileName: basename(filePath),
    content: fileContent,
  }

  const { publicKey, privateKey } = createKeyPair(SECRET)
  const signature = signFile(privateKey, SECRET, JSON.stringify(fileObject))

  const child = spawn('node', ['./spawnChild.js'])

  child.stdin.write(JSON.stringify({ publicKey, fileObject }))

  child.stdout.on('data', (data) => {
    const decrypted = decryptFile(privateKey, SECRET, Buffer.from(data))
    const isVerified = verifyFile(publicKey, decrypted.toString(), signature)
    const { fileName, content } = JSON.parse(decrypted)
    console.table([{
      fileName,
      content,
      isVerified,
      process_elapsed_time: process.uptime(),
      memory_consumed: process.memoryUsage().external,
    }])
    process.exit()
  })

  child.stderr.on('data', (data) => {
    console.error(data.message)
  })
} catch (error) {
  console.error(error.message)
}
