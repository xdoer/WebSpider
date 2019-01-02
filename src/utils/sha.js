/**
 * 加密模块
 */
const crypto = require('crypto')

module.exports = secret => crypto.createHmac('sha256', '' + secret).update('I love cupcakes').digest('hex')
