const secp = require('ethereum-cryptography/secp256k1')
const { toHex } = require('ethereum-cryptography/utils')
const { keccak256 } = require('ethereum-cryptography/keccak')

const privateKey = secp.utils.randomPrivateKey()
const pubKey = toHex(keccak256(secp.getPublicKey(privateKey)))

console.log('Private Key: ', toHex(privateKey))
console.log('Public Key: ', pubKey.slice(-20))



// npm i ethereum-cryptography/secp256k1@1.2