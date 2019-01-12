/**
 * 统一出口配置
 * PORT 服务开启的端口
 * DEBUG 开启调试,控制台看到出错信息
 * LOG 开启日志,程序执行信息将被写入到文件
 * STATISTICS 开启API调用统计
 * DB 数据库相关配置
 * SESSION 会话相关配置
 * PROXY 爬虫请求代理相关配置
 * CRAWL 爬虫相关配置
 */

module.exports = {
  PORT: 3001,
  DEBUG: false,
  LOG: false,
  STATISTICS: false,
  DB: require('./db'),
  SESSION: require('./session'),
  PROXY: require('./proxy'),
  CRAWL: require('./crawl')
}
