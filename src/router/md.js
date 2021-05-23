const fs = require('fs')
const path = require('path')
const Router = require('koa-router')
const router = new Router()

router
  .get('/guide', async (ctx) => {
    try {
      const content = await fs.readFileSync(
        path.join(__dirname, '../../docs/guide.md'),
        { encoding: 'utf-8' }
      )
      ctx.body = {
        state: true,
        time: new Date().toLocaleString(),
        data: content,
        msg: `数据获取成功`,
      }
    } catch (e) {
      ctx.body = {
        state: false,
        time: new Date().toLocaleString(),
        data: e,
        msg: `获取失败`,
      }
    }
  })
  .get('/history', async (ctx) => {
    try {
      const content = await fs.readFileSync(
        path.join(__dirname, '../../docs/history.md'),
        { encoding: 'utf-8' }
      )
      ctx.body = {
        state: true,
        time: new Date().toLocaleString(),
        data: content,
        msg: `数据获取成功`,
      }
    } catch (e) {
      ctx.body = {
        state: false,
        time: new Date().toLocaleString(),
        data: e,
        msg: `获取失败`,
      }
    }
  })

module.exports = router
