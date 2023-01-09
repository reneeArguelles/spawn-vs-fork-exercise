import {
  generateKeyPairSync, publicEncrypt, privateDecrypt, sign, verify,
} from 'node:crypto'

const createKeyPair = (secret) => generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: secret,
  },
})

const encryptFile = (key, data) => publicEncrypt(key, data)

const decryptFile = (key, passphrase, data) => privateDecrypt({
  key,
  passphrase,
}, data)

const signFile = (key, passphrase, data) => sign('SHA256', Buffer.from(data), {
  key,
  passphrase,
})

const verifyFile = (key, data, signature) => verify('SHA256', Buffer.from(data), key, Buffer.from(signature, 'base64'))

export {
  createKeyPair,
  encryptFile,
  decryptFile,
  signFile,
  verifyFile,
}
