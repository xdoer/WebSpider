const dev = require('./dev')
const test = require('./test')
const prod = require('./prod')

const _env = process.env.NODE_ENV

module.exports = {
  ..._env === 'test' ? test : _env === 'prod' ? prod : dev
}
