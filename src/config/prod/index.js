/**
 * 统一出口配置
 * PORT 服务开启的端口
 * DEBUG 开启调试,控制台看到出错信息
 * LOG 开启日志,程序执行信息将被写入到文件
 * STATISTICS 开启API调用统计
 * API_FREQUENCY API 调用频率(0为关闭调用频率限制,1、2、3...为两次API调用时间限制为1秒2秒3秒...)
 * PREVIEW_FREQUENCY  调用频率(0为关闭调用频率限制,1、2、3...为两次API调用时间限制为1秒2秒3秒...)
 * DB 数据库相关配置
 * SESSION 会话相关配置
 * PROXY 爬虫请求代理相关配置
 * CRAWL 爬虫相关配置
 */

module.exports = {
  PORT: process.env.PORT || 4000,
  CRAWL: require('./crawl'),
  DEBUG: false,
  DB: require('./db'),
}
