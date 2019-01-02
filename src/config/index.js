/**
 * 统一出口配置
 * PORT 服务开启的端口
 * DEBUG 开启调试,控制台看到出错信息
 * LOG 开启日志,程序执行信息将被写入到文件
 */

module.exports = {
  PORT: 3000,
  DEBUG: true,
  LOG: true,
  DB: require('./db'),
  SESSION: require('./session'),
  PROXY: require('./proxy'),
  CRAWL: require('./crawl')
}