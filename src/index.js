/**
 * 主文件
 */
const Koa = require('koa')
const session = require('koa-session')
const serve = require('koa-static')
const bodyParser = require('koa-bodyparser')
const path = require('path')
const app = new Koa()

const { userRouter, crawlRouter, proxyRouter, statisticsRouter } = require('./router')
const { SESSION } = require('./config')

/** 配置静态服务根目录 */
// if (process.env.NODE_ENV === 'dev') {
//   app.use(serve(path.resolve(__dirname, '../static/dev')))
// } else {
//   app.use(serve(path.resolve(__dirname, '../static/prod')))
// }

// 配置每30天更新一次缓存
app.use(serve(path.resolve(__dirname, '../static'), {
  maxage: 1000 * 60 * 60 * 24 * 30
}))

/** 配置session */
app.keys = ['some secret']
app.use(session(SESSION, app))

/** 配置Post解析 */
app.use(bodyParser())

/**
 * 解决跨域问题
 * 允许任意来源的访问,以调用生成的配置接口
 * 如果要前端面板文件需要由 Nginx、Tomcat等分发，则取消下面配置响应头的注释
 */
// app.use(async (ctx, next) => {
//   ctx.set({
//     'Access-Control-Allow-Credentials': true,
//     'Access-Control-Allow-Origin': ctx.request.header.origin,
//     'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE',
//   })
//   await next()
// })

/** 应用路由 */
app.use(userRouter.routes()).use(userRouter.allowedMethods())
app.use(crawlRouter.routes()).use(crawlRouter.allowedMethods())
app.use(proxyRouter.routes()).use(userRouter.allowedMethods())
app.use(statisticsRouter.routes()).use(statisticsRouter.allowedMethods())

module.exports = app
