/**
 * 获取代理模块
 */

const { PROXY: { url, proxy } } = require('../config')
const superagent = require('superagent')
const { _debug } = require('../utils')
let proxies = []

/**
 * 如果存在url选项，则进行请求获取代理
 * 如果存在proxy，则将代理返回
 */
if (url) {
  superagent.get(url).end((err, res) => {
    if (err) {
      _debug(`代理获取出错,错误详情 ${err}`, true)
    } else {
      if (res.data.state) {
        proxies = proxies.concat(res.data.data)
      } else {
        _debug(`接口数据获取失败,错误详情 ${res.data.msg}`, true)
      }
    }
  })
}

if (proxy.length > 0) {
  proxies = proxies.concat(proxy)
}

module.exports = proxies
