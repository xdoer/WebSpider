/**
 * session配置模块
 */
module.exports = {
  key: 'koa:FlyBird',
  maxAge: 1000 * 60 * 60 * 5,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false
}
