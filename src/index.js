/**
 * 主文件
 */
const Koa = require('koa')
const session = require('koa-session')
const app = new Koa()

const { userRouter, crawlRouter } = require('./router')
const { PORT, SESSION } = require('./config')

/** 配置session */
app.keys = ['some secret']
app.use(session(SESSION, app))

/**
 * 解决跨域问题
 * 允许任意来源的访问,以调用生成的配置接口
 */
app.use(async (ctx, next) => {
  ctx.set({
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': ctx.request.header.origin
  })
  await next()
})

/** 应用路由 */
app.use(userRouter.routes()).use(userRouter.allowedMethods())
app.use(crawlRouter.routes()).use(crawlRouter.allowedMethods())

/** 监听端口 */
app.listen(PORT, () => {
  console.log('服务已经开始')
})
