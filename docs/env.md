# 环境

程序中提供了三种环境:开发环境、生产环境和测试环境

## 开发环境
>* 默认开启了 debug 功能,应用运行状态，错误都将输出到控制台
>* 默认关闭API请求频率限制
>* 数据库名为 crawlDev
>* 开启端口为 3000
>* 启动命令  `npm start`

相关配置文件在:`/src/config/dev/index.js`

## 生产环境
>* 默认开启了 log 功能, 应用运行状态，错误将输出到日志文件。
>* 默认开启API请求频率限制,时间为1秒
>* 数据库名为 crawlProd
>* 开启端口 4000
>* 启动命令 `npm run prod`

相关配置文件在:`/src/config/prod/index.js`

## 测试环境
>* 默认关闭 debug,log 功能
>* 默认开启API请求频率限制,时间为2秒(方便测试)
>* 数据库名为 crawlTest
>* 开启端口 3001
>* 启动命令 `npm test`

相关配置文件在:`/src/config/test/index.js`

如果要使用 `node app.js` 启动程序时，需要指定`NODE_NEV`。
