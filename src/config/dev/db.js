/**
 * 数据库配置模块
 * db数据库名称
 * url链接数据库
 * 数据库如果有密码的话，请使用这样的  han:123456@localhost:27017/crawlDev   的url
 */
module.exports = {
  db: 'crawlDev',
  url: 'mongodb://thomas:test0.12345@cluster0-shard-00-00.glcfe.mongodb.net:27017,cluster0-shard-00-01.glcfe.mongodb.net:27017,cluster0-shard-00-02.glcfe.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-1hh76v-shard-0&authSource=admin&retryWrites=true&w=majority',
  connectOption: {
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  },
}
