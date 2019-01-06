/**
 * 爬虫配置信息路由
 */

const Router = require('koa-router')
const { Crawl } = require('../model')
const { _debug } = require('../utils')
const fetch = require('../crawl')
const getProxies = require('../crawl/proxy')
const verification = require('./utils/verification')
const router = new Router()

router
  /**
   * 用户分享的API接口
   * 传递的参数:page,pageSize
   */
  .get('/crawl/share', async ctx => {
    const { page, pageSize } = ctx.request.query
    const configs = await Crawl.get({}, { fields: { config: 1 }, sort: { time: -1 }, skip: pageSize * page, limit: pageSize })
    if (!configs.state) {
      _debug(`获取爬虫配置失败,失败详情 ${configs.data}`)
      ctx.body = configs
    } else {
      ctx.body = configs
    }
  })
  /**
   * 抓取预览
   * 传递的参数:urls目标网址,tags标签列表,depth抓取深度,form输出形式,charset网页编码,proxies代理
   * @param {array} urls 爬取的链接列表
   * @param {array} tags 分析的标签列表
   * @param {string} depth 抓取深度
   * @param {object} form 需要输出的形式
   * @param {string} charset 网页编码(utf-8,gbk)
   * @param {string} proxyMode 代理模式(无代理，内置代理，自定义代理)
   * @param {array} proxies 可选(自定义代理选项)
   * @param {string} mode 抓取模式(普通模式与分页模式)
   * @param {string} start 分页模式下起始页码
   * @param {string} end 分页模式下终止页码
   */
  .post('/crawl/preview', async ctx => {
    let { url, tags, depth = '1', form, charset = 'utf-8', proxyMode, proxies = [], mode = 'plain', start = '0', end = '0' } = ctx.request.body

    depth = Number.parseInt(depth)

    if (!verification({ tags, form, proxies })) {
      ctx.body = {
        state: false,
        data: '参数验证失败',
        msg: '参数验证失败'
      }
      return
    }

    let urls = []
    let proxy

    /**
     * 构造请求链接数组
     * 链接中的页码部分用*替代
     */
    urls = mode === 'pagination' ? (new Array(end - start)).fill(url).map(n => n.replace(/\*/i, start++)) : [url]

    /**
     * 代理模式
     * 内置代理模式,用户配置的代理,不使用代理
     */
    if (proxyMode === 'internal') {
      let _proxies = await getProxies()
      proxy = _proxies[Math.floor(Math.random() * _proxies.length + 1) - 1]
    } else if (proxyMode === 'own') {
      proxy = proxies[Math.floor(Math.random() * proxies.length + 1) - 1]
    }

    /** 调用爬虫 */
    const hh = await fetch({ urls, tags, depth, form, charset, proxy })
    ctx.body = {
      state: true,
      data: hh,
      msg: '获取成功'
    }
  })

module.exports = router
