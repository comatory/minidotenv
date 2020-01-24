const path = require('path')
const minidotenv = require('../dist/index.js')

// NOTE: Loads .env file in this directory
const conf = minidotenv()

console.info(`key FOO: ${conf('FOO')}`)
console.info(`key HELLO: ${conf('HELLO')}`)
console.info(`key SENTENCE: ${conf('SENTENCE')}`)
console.info(`key PORT: ${conf('PORT')}`)
console.info(`key SIZE: ${conf('SIZE')}`)
console.info(`key VERSION: ${conf('VERSION')}`)

// NOTE: Loads src.env file in src/ subdirectory
const additionalConf = minidotenv({
  path: path.join(__dirname, 'src', 'src.env')
})

console.info(`key FOO: ${additionalConf('FOO')}`)
